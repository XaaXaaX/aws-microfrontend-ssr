import { Stack } from 'aws-cdk-lib';
import {OriginBase} from 'aws-cdk-lib/aws-cloudfront';
import {S3OriginProps} from 'aws-cdk-lib/aws-cloudfront-origins';
import { Effect, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Bucket, BucketProps } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, CacheControl, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import path from 'path';

export class S3OriginWithoutOriginAccessIdentity extends OriginBase {
    constructor(fullyQualifiedBucketDomain: string, props?: S3OriginProps) {
        super(fullyQualifiedBucketDomain, props);
    }

    // note, intentionally violates the return type to render an object with no OAI properties
    protected renderS3OriginConfig() {
        return {};
    }
}

export type S3CloudFrontWebBucketProps = BucketProps & { DeploymentSourcePath: string; };
export class S3CloudFrontWebBucket extends Bucket {
    constructor(scope: Construct, id: string, props?: S3CloudFrontWebBucketProps) {
        super(scope, id, props);

        const { account: ACCOUNT_ID } = Stack.of(this);
        // Bucket definitions
        

        this.addToResourcePolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                principals: [new ServicePrincipal('cloudfront.amazonaws.com')],
                conditions: {
                    "StringEquals": {
                        "aws:SourceAccount": `${ACCOUNT_ID}`,
                    },
                    ArnLike: {
                        'aws:SourceArn': `arn:aws:cloudfront::${ACCOUNT_ID}:distribution/*`,
                    },
                },
                actions: ['s3:GetObject'],
                resources: [`${this.bucketArn}/*`],
            })
        );

        if(props?.DeploymentSourcePath)
            new BucketDeployment(this, 'BucketDeployment', {
                sources: [ Source.asset(path.join(process.cwd(), props?.DeploymentSourcePath)) ],
                cacheControl: [ CacheControl.fromString('max-age=1800,must-revalidate')],
                destinationBucket: this,
            });
    }
}
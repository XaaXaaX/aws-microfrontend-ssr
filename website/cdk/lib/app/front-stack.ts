import {NestedStack, RemovalPolicy, Stack, NestedStackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Bucket, IBucket} from 'aws-cdk-lib/aws-s3';
import { Effect, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import path from 'path';

export interface FrontStackProps extends NestedStackProps {}

export class FrontStack extends NestedStack {
    readonly Bucket: IBucket;

    constructor(scope: Construct, id: string, props: FrontStackProps) {
        super(scope, id, props);

        const { account: accountId } = Stack.of(this);

        // Bucket definitions
        this.Bucket = new Bucket(this, 'FrontSiteBucket' , {
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });

        this.Bucket.addToResourcePolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                principals: [new ServicePrincipal('cloudfront.amazonaws.com')],
                conditions: {
                    "StringEquals": {
                        "aws:SourceAccount": `${accountId}`,
                    },
                    ArnLike: {
                        'aws:SourceArn': `arn:aws:cloudfront::${accountId}:distribution/*`,
                    },
                },
                actions: ['s3:GetObject'],
                resources: [`${this.Bucket.bucketArn}/*`],
            })
        );

        new BucketDeployment(this, 'BucketDeployment', {
            sources: [ Source.asset(path.join(process.cwd(), '/website/app/build')) ],
            destinationBucket: this.Bucket,
          });
    }
}

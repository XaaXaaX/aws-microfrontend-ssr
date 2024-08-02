import { Duration, NestedStack, NestedStackProps } from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {
    AllowedMethods,
    CachePolicy,
    CfnDistribution,
    CfnOriginAccessControl,
    Distribution,
    HttpVersion,
    OriginRequestPolicy,
    PriceClass,
    SecurityPolicyProtocol,
    SSLMethod,
    ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { FunctionUrlOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { IFunctionUrl } from 'aws-cdk-lib/aws-lambda';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { S3OriginWithoutOriginAccessIdentity } from '@cdk/constructs/s3-cloudfront-origin';

export interface CloudFrontStackProps extends NestedStackProps {
    DefaultOriginListAccountsFunctionUrl: IFunctionUrl;
    AssetsBucket: IBucket;
}

export class CloudFrontStack extends NestedStack {
    readonly Distribution: Distribution;
    constructor(scope: Construct, id: string, props: CloudFrontStackProps) {
        super(scope, id, props);

        this.Distribution = new Distribution(this, 'AccountDistribution', {
            comment: 'Account Service Distribution',
            enabled: true,
            priceClass: PriceClass.PRICE_CLASS_100,
            httpVersion: HttpVersion.HTTP2_AND_3,
            sslSupportMethod: SSLMethod.SNI,
            minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
            errorResponses: [
              { httpStatus: 404, responseHttpStatus: 200, ttl: Duration.seconds(0), responsePagePath: '/' },
              { httpStatus: 403, responseHttpStatus: 200, ttl: Duration.seconds(0),  responsePagePath: '/' },
            ],
            defaultBehavior: {
                allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
                origin: new S3OriginWithoutOriginAccessIdentity(props.AssetsBucket.bucketDomainName, {
                    connectionAttempts: 3,
                    connectionTimeout: Duration.seconds(1),
                }),
                cachedMethods: AllowedMethods.ALLOW_GET_HEAD,
                cachePolicy: CachePolicy.CACHING_OPTIMIZED,
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
            additionalBehaviors: {
                '/accounts/signin/*': {
                    origin: new FunctionUrlOrigin(props.DefaultOriginListAccountsFunctionUrl, {
                        connectionAttempts: 3,
                        connectionTimeout: Duration.seconds(1),
                        keepaliveTimeout: Duration.seconds(5),
                    }),
                    allowedMethods: AllowedMethods.ALLOW_ALL,
                    cachedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
                    cachePolicy: CachePolicy.CACHING_DISABLED,
                    viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                    originRequestPolicy: OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
                },
            },
        });

        const cfCfnDist = this.Distribution.node.defaultChild as CfnDistribution;

        const assetsOriginAccessControl = new CfnOriginAccessControl(this, 'AssetsBucketOAC', {
            originAccessControlConfig: {
                name: `Assets-Bucket-OAC`,
                originAccessControlOriginType: 's3',
                signingBehavior: 'no-override',
                signingProtocol: 'sigv4',
            }
        });
 
        cfCfnDist.addPropertyOverride(
            'DistributionConfig.Origins.0.OriginAccessControlId',
            assetsOriginAccessControl.getAtt('Id')
        );

        const accountsOriginAccessControl = new CfnOriginAccessControl(this, 'LambdaUrlOAC', {
            originAccessControlConfig: {
                name: `Accounts-Lambda-OAC`,
                originAccessControlOriginType: 'lambda',
                signingBehavior: 'no-override',
                signingProtocol: 'sigv4',
            }
        });
 
        cfCfnDist.addPropertyOverride(
            'DistributionConfig.Origins.1.OriginAccessControlId',
            accountsOriginAccessControl.getAtt('Id')
        );

        new StringParameter(this, 'DistributionDomainName', {
            parameterName: '/accounts/distribution/domain/name',
            stringValue: this.Distribution.distributionDomainName,
        });
    }
}

import { Duration, NestedStack, NestedStackProps } from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {
    AllowedMethods,
    CacheCookieBehavior,
    CacheHeaderBehavior,
    CachePolicy,
    CacheQueryStringBehavior,
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

export interface CloudFrontStackProps extends NestedStackProps {
    DefaultOriginListBookmarksFunctionUrl: IFunctionUrl;
}

export class CloudFrontStack extends NestedStack {
    readonly Distribution: Distribution;
    constructor(scope: Construct, id: string, props: CloudFrontStackProps) {
        super(scope, id, props);

        this.Distribution = new Distribution(this, 'BookmarkDistribution', {
            comment: 'Bookmark Service Distribution',
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
                origin: new FunctionUrlOrigin(props.DefaultOriginListBookmarksFunctionUrl, {
                    connectionAttempts: 3,
                    connectionTimeout: Duration.seconds(1),
                    keepaliveTimeout: Duration.seconds(5),
                }),
                allowedMethods: AllowedMethods.ALLOW_ALL,
                cachedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
                cachePolicy: new CachePolicy(this, 'BookmarksCachePolicy', {
                    headerBehavior: CacheHeaderBehavior.none(),
                    cookieBehavior: CacheCookieBehavior.none(),
                    queryStringBehavior: CacheQueryStringBehavior.allowList(
                        'userid',
                        'ref',
                        'name'
                    ),
                    defaultTtl: Duration.hours(1),
                    minTtl: Duration.hours(0),
                    maxTtl: Duration.hours(24),
                }),
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                originRequestPolicy: OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
            },
        });

        const cfCfnDist = this.Distribution.node.defaultChild as CfnDistribution;

        const bookmarksOriginAccessControl = new CfnOriginAccessControl(this, 'LambdaUrlOAC', {
            originAccessControlConfig: {
                name: `Bookmarks-Lambda-OAC`,
                originAccessControlOriginType: 'lambda',
                signingBehavior: 'no-override',
                signingProtocol: 'sigv4',
            }
        });
 
        cfCfnDist.addPropertyOverride(
            'DistributionConfig.Origins.0.OriginAccessControlId',
            bookmarksOriginAccessControl.getAtt('Id')
        );

        new StringParameter(this, 'DistributionDomainName', {
            parameterName: '/bookmarks/distribution/domain/name',
            stringValue: this.Distribution.distributionDomainName,
        });
    }
}

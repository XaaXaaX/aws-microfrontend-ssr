import { Duration, NestedStack, NestedStackProps } from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {
    AllowedMethods,
    CacheHeaderBehavior,
    CachePolicy,
    CfnDistribution,
    CfnOriginAccessControl,
    Distribution,
    Function,
    FunctionCode,
    FunctionEventType,
    FunctionRuntime,
    HttpVersion,
    OriginRequestCookieBehavior,
    OriginRequestHeaderBehavior,
    OriginRequestPolicy,
    OriginRequestQueryStringBehavior,
    PriceClass,
    SecurityPolicyProtocol,
    SSLMethod,
    ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { S3OriginWithoutOriginAccessIdentity } from '@cdk/constructs/s3-cloudfront-origin';
import { HttpOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
export interface CloudFrontStackProps extends NestedStackProps {
    FrontSiteBucket: IBucket;
    ProductServiceDomainName: string;
    BookmarkServiceDomainName: string;
    AccountServiceDomainName: string;
}

export class CloudFrontStack extends NestedStack {
    readonly Distribution: Distribution;
    constructor(scope: Construct, id: string, props: CloudFrontStackProps) {
        super(scope, id, props);

        const WebCachePolicy = new CachePolicy(this, 'WebCachePolicy', {
            headerBehavior: CacheHeaderBehavior.none(),
            cookieBehavior: CacheHeaderBehavior.none(),
            queryStringBehavior: CacheHeaderBehavior.none(),
            defaultTtl: Duration.hours(1),
            minTtl: Duration.hours(0),
            maxTtl: Duration.hours(24),
        });

        const dynamicContentCachePolicy = new CachePolicy(this, 'DynamicContentCachePolicy', {
            headerBehavior: CacheHeaderBehavior.none(),
            cookieBehavior: CacheHeaderBehavior.none(),
            queryStringBehavior: CacheHeaderBehavior.none(),
            defaultTtl: Duration.seconds(0),
            minTtl: Duration.seconds(0),
        });

        const dynamicContentOriginRequestPolicy = new OriginRequestPolicy(this, 'DynamicContentOriginRequestPolicy', {
            queryStringBehavior: OriginRequestQueryStringBehavior.all(),
            headerBehavior: OriginRequestHeaderBehavior.none(),
            cookieBehavior: OriginRequestCookieBehavior.none()
        });

        const webbucketOrigin = new S3OriginWithoutOriginAccessIdentity(props.FrontSiteBucket.bucketDomainName, {
            connectionAttempts: 3,
            connectionTimeout: Duration.seconds(1),
        });

        this.Distribution = new Distribution(this, 'CloudFrontDistribution', {
            comment: 'Web Site Distribution',
            enabled: true,
            defaultRootObject: 'index.html',
            sslSupportMethod: SSLMethod.SNI,
            httpVersion: HttpVersion.HTTP2_AND_3,
            priceClass: PriceClass.PRICE_CLASS_100,
            minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
            errorResponses: [
              { httpStatus: 404, responseHttpStatus: 200, ttl: Duration.seconds(0), responsePagePath: '/' },
              { httpStatus: 403, responseHttpStatus: 200, ttl: Duration.seconds(0),  responsePagePath: '/' },
            ],
            defaultBehavior: {
                allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
                origin: webbucketOrigin,
                cachedMethods: AllowedMethods.ALLOW_GET_HEAD,
                cachePolicy: WebCachePolicy,
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                functionAssociations: [
                    {
                        function: new Function(scope, `ProductRedirectFunctionViewerResponse`, {
                            code: FunctionCode.fromFile({ filePath: `front-app/src/url-redirect.js`}),
                            runtime: FunctionRuntime.JS_2_0 
                        }),
                        eventType: FunctionEventType.VIEWER_RESPONSE,
                    },
                ],
            },
        });

        const cfCfnDist = this.Distribution.node.defaultChild as CfnDistribution;

        this.Distribution.addBehavior('api/v1/bookmarks/*', new HttpOrigin(props.BookmarkServiceDomainName), {
            allowedMethods: AllowedMethods.ALLOW_ALL,
            cachePolicy: dynamicContentCachePolicy,
            viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            originRequestPolicy: dynamicContentOriginRequestPolicy
        });

        this.Distribution.addBehavior('api/v1/products/*', new HttpOrigin(props.ProductServiceDomainName), {
            allowedMethods: AllowedMethods.ALLOW_ALL,
            cachePolicy: dynamicContentCachePolicy,
            viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            originRequestPolicy: dynamicContentOriginRequestPolicy,
        });
        
        this.Distribution.addBehavior('api/v1/accounts/*', new HttpOrigin(props.AccountServiceDomainName), {
            allowedMethods: AllowedMethods.ALLOW_ALL,
            cachePolicy: dynamicContentCachePolicy,
            viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            originRequestPolicy: dynamicContentOriginRequestPolicy
        });

        const frontSiteOriginAccessControl = new CfnOriginAccessControl(this, 'FrontSiteOAC', {
            originAccessControlConfig: {
                name: `FrontSite-Bucket-OAC`,
                originAccessControlOriginType: 's3',
                signingBehavior: 'no-override',
                signingProtocol: 'sigv4',
            }
        });
 
        cfCfnDist.addPropertyOverride(
            'DistributionConfig.Origins.0.OriginAccessControlId',
            frontSiteOriginAccessControl.getAtt('Id')
        );
    }
}

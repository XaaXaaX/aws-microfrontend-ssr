import {aws_cloudfront, Duration, NestedStack, NestedStackProps } from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {
    AllowedMethods,
    CachedMethods,
    CacheHeaderBehavior,
    CachePolicy,
    CfnDistribution,
    Distribution,
    HttpVersion,
    OriginRequestPolicy,
    PriceClass,
    SecurityPolicyProtocol,
    SSLMethod,
    ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { S3OriginWithoutOriginAccessIdentity } from '../../constructs/s3-cloudfront-origin';
import { HttpOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';

export interface CloudFrontStackProps extends NestedStackProps {
    FrontSiteBucket: IBucket;
    ProductServiceDomainName: string;
    BookmarkServiceDomainName: string;
}

export class CloudFrontStack extends NestedStack {
    readonly Distribution: Distribution;
    constructor(scope: Construct, id: string, props: CloudFrontStackProps) {
        super(scope, id, props);


        this.Distribution = new Distribution(this, 'CloudFrontDistribution', {
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
                origin: new S3OriginWithoutOriginAccessIdentity(props.FrontSiteBucket.bucketDomainName, {
                    connectionAttempts: 3,
                    connectionTimeout: Duration.seconds(1),
                }),
                cachedMethods: AllowedMethods.ALLOW_GET_HEAD,
                cachePolicy: new CachePolicy(this, 'WebSiteCachePolicy', {
                    headerBehavior: CacheHeaderBehavior.none(),
                    cookieBehavior: CacheHeaderBehavior.none(),
                    queryStringBehavior: CacheHeaderBehavior.none(),
                    defaultTtl: Duration.hours(1),
                    minTtl: Duration.hours(0),
                    maxTtl: Duration.hours(24),
                }),
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
        });

        const cfCfnDist = this.Distribution.node.defaultChild as CfnDistribution;

        this.Distribution.addBehavior('bookmarks/*', new HttpOrigin(props.BookmarkServiceDomainName), {
            allowedMethods: AllowedMethods.ALLOW_ALL,
            cachedMethods: CachedMethods.CACHE_GET_HEAD,
            cachePolicy: new CachePolicy(this, 'BookmarksCachePolicy', {}),
            viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            originRequestPolicy: OriginRequestPolicy.ALL_VIEWER_AND_CLOUDFRONT_2022,
        });

        this.Distribution.addBehavior('product/*', new HttpOrigin(props.ProductServiceDomainName), {
            allowedMethods: AllowedMethods.ALLOW_ALL,
            cachedMethods: CachedMethods.CACHE_GET_HEAD,
            cachePolicy: new CachePolicy(this, 'ProductCachePolicy', {}),
            viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            originRequestPolicy: OriginRequestPolicy.ALL_VIEWER_AND_CLOUDFRONT_2022,
        });

        const frontSiteOriginAccessControl = new aws_cloudfront.CfnOriginAccessControl(this, 'FrontSiteOAC', {
            originAccessControlConfig: {
                name: `FrontSite-Buclet-OAC`,
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

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

export interface FrontStackProps extends NestedStackProps {
    DefaultOriginFunctionUrl: IFunctionUrl;
    productDetailsFunctionUrl: IFunctionUrl;
}

export class CloudFrontStack extends NestedStack {
    readonly Distribution: Distribution;
    constructor(scope: Construct, id: string, props: FrontStackProps) {
        super(scope, id, props);

        this.Distribution = new Distribution(this, 'ProductDistribution', {
            comment: 'Product Service Distribution',
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
                origin: new FunctionUrlOrigin(props.DefaultOriginFunctionUrl, {
                    connectionAttempts: 3,
                    connectionTimeout: Duration.seconds(1),
                    keepaliveTimeout: Duration.seconds(5),
                }),
                allowedMethods: AllowedMethods.ALLOW_ALL,
                cachedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
                cachePolicy: new CachePolicy(this, 'ProductsCachePolicy', {
                    headerBehavior: CacheHeaderBehavior.none(),
                    cookieBehavior: CacheCookieBehavior.none(),
                    queryStringBehavior: CacheQueryStringBehavior.allowList(
                        'seller',
                        'ref',
                        'name',
                        'category',
                        'price'
                    ),
                    defaultTtl: Duration.hours(1),
                    minTtl: Duration.hours(0),
                    maxTtl: Duration.hours(24),
                }),
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                originRequestPolicy: OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
            },
        });

        this.Distribution.addBehavior('/api/v1/products/details/*', new FunctionUrlOrigin(props.productDetailsFunctionUrl, {
            connectionAttempts: 3,
            connectionTimeout: Duration.seconds(1),
            keepaliveTimeout: Duration.seconds(5),
        }), {
            allowedMethods: AllowedMethods.ALLOW_ALL,
            cachedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
            cachePolicy: new CachePolicy(this, 'ProductDetailsCachePolicy', {
                headerBehavior: CacheHeaderBehavior.none(),
                cookieBehavior: CacheCookieBehavior.none(),
                queryStringBehavior: CacheQueryStringBehavior.none(),
                defaultTtl: Duration.hours(1),
                minTtl: Duration.hours(0),
                maxTtl: Duration.hours(24),
            }),
            viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            originRequestPolicy: OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        });
        const cfCfnDist = this.Distribution.node.defaultChild as CfnDistribution;

        const procductCatalogOriginAccessControl = new CfnOriginAccessControl(this, 'LambdaUrlOAC', {
            originAccessControlConfig: {
                name: `ProductCatalog-Lambda-OAC`,
                originAccessControlOriginType: 'lambda',
                signingBehavior: 'no-override',
                signingProtocol: 'sigv4',
            }
        });
 
        cfCfnDist.addPropertyOverride(
            'DistributionConfig.Origins.0.OriginAccessControlId',
            procductCatalogOriginAccessControl.getAtt('Id')
        );

        cfCfnDist.addPropertyOverride(
            'DistributionConfig.Origins.1.OriginAccessControlId',
            procductCatalogOriginAccessControl.getAtt('Id')
        );
        

        new StringParameter(this, 'DistributionDomainName', {
            parameterName: '/products/distribution/domain/name',
            stringValue: this.Distribution.distributionDomainName,
        });
    }
}

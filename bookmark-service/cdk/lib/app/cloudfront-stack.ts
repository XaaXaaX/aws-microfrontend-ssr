import {aws_cloudfront, Duration, NestedStack, NestedStackProps } from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {
    AllowedMethods,
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
import {FunctionUrlOrigin, HttpOrigin} from 'aws-cdk-lib/aws-cloudfront-origins';
import {IFunctionUrl} from 'aws-cdk-lib/aws-lambda';

export interface CloudFrontStackProps extends NestedStackProps {
    DefaultOriginFunctionUrl: IFunctionUrl;
}

export class CloudFrontStack extends NestedStack {
    readonly Distribution: Distribution;
    constructor(scope: Construct, id: string, props: CloudFrontStackProps) {
        super(scope, id, props);

        this.Distribution = new Distribution(this, 'BookMarkDistribution', {
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
                origin: new HttpOrigin('www.example.com', {}),
                allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
                cachedMethods: AllowedMethods.ALLOW_GET_HEAD,
                cachePolicy: CachePolicy.CACHING_OPTIMIZED,
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                originRequestPolicy: OriginRequestPolicy.ALL_VIEWER_AND_CLOUDFRONT_2022,
            },
        });

        const cfCfnDist = this.Distribution.node.defaultChild as CfnDistribution;

        this.Distribution.addBehavior('bookmarks/*', new FunctionUrlOrigin(props.DefaultOriginFunctionUrl), {
            allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
            cachedMethods: AllowedMethods.ALLOW_GET_HEAD,
            cachePolicy: CachePolicy.CACHING_DISABLED,
            viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            originRequestPolicy: OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        });

        const procductCatalogOriginAccessControl = new aws_cloudfront.CfnOriginAccessControl(this, 'LambdaUrlOAC', {
            originAccessControlConfig: {
                name: `BookMarks-Lambda-OAC`,
                originAccessControlOriginType: 'lambda',
                signingBehavior: 'always',
                signingProtocol: 'sigv4',
            }
        });
 
        cfCfnDist.addPropertyOverride(
            'DistributionConfig.Origins.1.OriginAccessControlId',
            procductCatalogOriginAccessControl.getAtt('Id')
        );
    }
}

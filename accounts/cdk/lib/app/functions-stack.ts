import {Construct} from 'constructs';
import { TypescriptFunction } from '@cdk/constructs/typescript-function';
import { join, resolve } from 'path';
import { NestedStack, NestedStackProps, RemovalPolicy } from 'aws-cdk-lib';
import { IFunctionUrl } from 'aws-cdk-lib/aws-lambda';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { S3CloudFrontWebBucket } from '@cdk/constructs/s3-cloudfront-origin';
export interface FunctionsStackProps extends NestedStackProps {}

export class MicroFrontEndFunctionsStack extends NestedStack {
    readonly AccountsFunctionUrl: IFunctionUrl;
    readonly AssetsBucket: IBucket;
    constructor(scope: Construct, id: string, props: FunctionsStackProps) {
        super(scope, id, props);

        const assetsBucket = new S3CloudFrontWebBucket(this, 'AssetsBucket', {
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true
        });

        const accountSigninFunction = new TypescriptFunction(this, `account-mfe-function`, {
            entry: resolve(join(process.cwd(), '/accounts/src/signin', 'index.ts')),
            bundling: {
                banner: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`
            }
        });
        
        this.AccountsFunctionUrl = accountSigninFunction.FunctionUrl;
        this.AssetsBucket = assetsBucket;
    }
}

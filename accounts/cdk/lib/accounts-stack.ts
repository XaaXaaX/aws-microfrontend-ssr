import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { MicroFrontEndFunctionsStack } from './app/functions-stack';
import { CloudFrontStack } from './app/cloudfront-stack';
export class AccountStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const mfeStack = new MicroFrontEndFunctionsStack(this, MicroFrontEndFunctionsStack.name, {});

    new CloudFrontStack(this, CloudFrontStack.name, { 
      DefaultOriginListAccountsFunctionUrl: mfeStack.AccountsFunctionUrl,
      AssetsBucket: mfeStack.AssetsBucket
    })
  }
}

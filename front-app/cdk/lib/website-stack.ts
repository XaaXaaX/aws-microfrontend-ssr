import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CloudFrontStack } from './app/cloudfront-stack';
import { FrontStack } from './app/front-stack';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
export class WebsiteStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const productDomainName = StringParameter.fromStringParameterName(this, 'ProductServiceDomainNameParameter', '/products/distribution/domain/name');
    const bookmarkDomainName = StringParameter.fromStringParameterName(this, 'BookmarkServiceDomainNameParameter', '/bookmarks/distribution/domain/name');
    const accountDomainName = StringParameter.fromStringParameterName(this, 'AccountServiceDomainNameParameter', '/accounts/distribution/domain/name');

    const frontStack = new FrontStack(this, FrontStack.name, {  });
    
    new CloudFrontStack(this, CloudFrontStack.name, { 
      FrontSiteBucket: frontStack.Bucket,
      BookmarkServiceDomainName: bookmarkDomainName.stringValue,
      ProductServiceDomainName: productDomainName.stringValue,
      AccountServiceDomainName: accountDomainName.stringValue,
     });
  }
}
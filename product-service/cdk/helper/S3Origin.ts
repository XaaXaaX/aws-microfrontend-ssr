import {OriginBase} from 'aws-cdk-lib/aws-cloudfront';
import {S3OriginProps} from 'aws-cdk-lib/aws-cloudfront-origins';

export class MySimpleS3Origin extends OriginBase {
    constructor(fullyQualifiedBucketDomain: string, props?: S3OriginProps) {
        super(fullyQualifiedBucketDomain, props);
    }

    // note, intentionally violates the return type to render an object with no OAI properties
    protected renderS3OriginConfig() {
        return {};
    }
}

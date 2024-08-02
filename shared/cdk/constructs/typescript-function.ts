import { Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { FunctionUrlAuthType, HttpMethod, IFunctionUrl, InvokeMode } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import { LambdaConfiguration } from '../helper/lambda';


export interface TypescriptFunctionProps extends NodejsFunctionProps {}
export class TypescriptFunction extends NodejsFunction {
    public readonly FunctionUrl: IFunctionUrl;

    constructor(scope: Construct, id: string, props: TypescriptFunctionProps) {
      const lambdaServiceRole = new ServicePrincipal('lambda.amazonaws.com');
      const lambdaFunctionRole = new Role(scope, `${id}Role`, { 
        assumedBy: lambdaServiceRole,
        managedPolicies: [ ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole') ]
      });

      super(scope, id, {
        entry: props.entry,
        role: lambdaFunctionRole,
        ...LambdaConfiguration,
        ...props,
        bundling: {
          ...LambdaConfiguration.bundling,
          ...props.bundling
        },
        environment: props.environment
      });

      const { account } = Stack.of(this);  

      new LogGroup(scope, `${id}LogGroup`, {
        logGroupName: `/aws/lambda/${this.functionName}`,
        removalPolicy: RemovalPolicy.DESTROY,
        retention: RetentionDays.ONE_DAY
      });

      this.FunctionUrl = this.addFunctionUrl({
          authType: FunctionUrlAuthType.AWS_IAM,
          invokeMode: InvokeMode.BUFFERED,
          cors: {
              allowCredentials: true,
              allowedHeaders: ['*'],
              allowedMethods: [ HttpMethod.ALL ],
              allowedOrigins: [ `*` ],
              maxAge: Duration.days(1),
          },
      });

      this.FunctionUrl.grantInvokeUrl(new ServicePrincipal('cloudfront.amazonaws.com', {
          conditions: {
              ArnLike: {
                  'aws:SourceArn': `arn:aws:cloudfront::${account}:distribution/*`,
              },
              StringEquals: { 'aws:SourceAccount': account},
          }
      }));


    }
} 
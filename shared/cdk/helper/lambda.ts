import { Duration } from 'aws-cdk-lib'
import { Architecture, LoggingFormat, Runtime } from 'aws-cdk-lib/aws-lambda'
import { BundlingOptions, NodejsFunctionProps, OutputFormat, SourceMapMode } from 'aws-cdk-lib/aws-lambda-nodejs'

export const EsbuildNodeBundling: BundlingOptions = {
  platform: 'node',
  format: OutputFormat.ESM,
  mainFields: ['module', 'main'],
  forceDockerBundling: false,
  minify: false,
  sourceMap: true,
  sourcesContent: false,
  sourceMapMode: SourceMapMode.DEFAULT,
  metafile: false,
}

export const LambdaConfiguration: NodejsFunctionProps = {
  runtime: Runtime.NODEJS_20_X,
  architecture: Architecture.ARM_64,
  loggingFormat: LoggingFormat.TEXT,
  handler: 'handler',
  memorySize: 256,
  timeout: Duration.seconds(3),
  awsSdkConnectionReuse: false,
  bundling: EsbuildNodeBundling,
}
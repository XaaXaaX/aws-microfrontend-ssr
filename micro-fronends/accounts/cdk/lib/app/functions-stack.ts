import {Construct} from 'constructs';
import { TypescriptFunction } from '@cdk/constructs/typescript-function';
import { join, resolve } from 'path';
import { NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { IFunctionUrl } from 'aws-cdk-lib/aws-lambda';
export interface FunctionsStackProps extends NestedStackProps {}

export class MicroFrontEndFunctionsStack extends NestedStack {
    readonly AccountsFunctionUrl: IFunctionUrl;
    constructor(scope: Construct, id: string, props: FunctionsStackProps) {
        super(scope, id, props);

        const accountSigninFunction = new TypescriptFunction(this, `account-mfe-function`, {
            entry: resolve(join(process.cwd(), '/micro-fronends/accounts/src/handlers/signin', 'index.ts')),
            bundling: {
                banner: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`
            }
        });
        
        this.AccountsFunctionUrl = accountSigninFunction.FunctionUrl;
    }
}

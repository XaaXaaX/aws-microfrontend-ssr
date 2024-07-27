import {Construct} from 'constructs';
import { TypescriptFunction } from '../../constructs/typescript-function';
import { join, resolve } from 'path';
import { NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { IFunctionUrl } from 'aws-cdk-lib/aws-lambda';
export interface FunctionsStackProps extends NestedStackProps {}

export class MicroFrontEndFunctionsStack extends NestedStack {
    readonly BookMarksFunctionUrl: IFunctionUrl;
    constructor(scope: Construct, id: string, props: FunctionsStackProps) {
        super(scope, id, props);

        const bookMarkFunction = new TypescriptFunction(this, `prodcut-catalog-mfe-function`, {
            entry: resolve(join(process.cwd(), '/bookmark-service/src/bookmarks', 'index.ts')),
            bundling: {
                banner: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`
            }
        });
        
        this.BookMarksFunctionUrl = bookMarkFunction.FunctionUrl;
    }
}

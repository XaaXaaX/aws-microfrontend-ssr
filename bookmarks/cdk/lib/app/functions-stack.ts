import {Construct} from 'constructs';
import { TypescriptFunction } from '@cdk/constructs/typescript-function';
import { join, resolve } from 'path';
import { NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { IFunctionUrl } from 'aws-cdk-lib/aws-lambda';
export interface FunctionsStackProps extends NestedStackProps {}

export class MicroFrontEndFunctionsStack extends NestedStack {
    readonly BookmarksFunctionUrl: IFunctionUrl;
    constructor(scope: Construct, id: string, props: FunctionsStackProps) {
        super(scope, id, props);

        const bookmarkFunction = new TypescriptFunction(this, `bookmarks-mfe-function`, {
            entry: resolve(join(process.cwd(), '/bookmarks/src/bookmarks', 'index.ts')),
            bundling: {
                banner: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`
            }
        });
        
        this.BookmarksFunctionUrl = bookmarkFunction.FunctionUrl;
    }
}

import { globSync } from "glob";
import path, { join } from "path";

export type ConfigSource = { path: string, source: string, handlerFn?: string };
const configs: ConfigSource[] = [
    { path: "accounts/signin/v1/", source: 'accounts/src/signin/index.ts' },
    { path: "bookmarks/v1/", source: 'bookmarks/src/bookmarks/index.ts' },
    { path: "products/catalog/v1/", source: 'products/src/catalog/index.ts' },
];

export const lambdasEntrypoints = globSync(configs.map(src => src.source ?? './')  , { 
    ignore: [
        "**/**/node_modules/**",
        "**/**/*..test.ts",
        "**/**/*..spec.ts",
    ] }).map((entry: string) => {

        const config = configs.find(c => c.source.includes(entry));
        const entryPoint = join(process.cwd(), entry.split(path.sep).join(path.posix.sep)),
              lambdaName = entry
                .split(path.sep)
                .slice(-1)[0]
                .replace(".(ts|js)", ""),
              endpoint = config?.path,
              handlerFn = config?.handlerFn;

        return { entryPoint, lambdaName, endpoint, handlerFn }
    });






import { Response } from "express";
import { globSync } from "glob";
import path, { join } from "path";

export type ConfigSource = { path: string, source: string, handlerFn?: string, action?: (args: any) => void };
const configs: ConfigSource[] = [
    { path: "api/v1/accounts/signin/v1/", source: 'accounts/src/signin/index.ts' },
    { path: "api/v1/bookmarks/v1/", source: 'bookmarks/src/bookmarks/index.ts' },
    { path: "api/v1/products/catalog/v1/", source: 'products/src/catalog/index.ts' },
    { path: "api/v1/products/details/", source: 'products/src/details/index.ts' },
    { path: "api/v1/aaaaa/", source: 'products/src/details/index.ts', action: (res: Response) => res.writeHead(301, {Location: `${window.location.host}/?category=ON_SOLD`}).end() },
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
              handlerFn = config?.handlerFn,
              action = config?.action;

        return { entryPoint, lambdaName, endpoint, handlerFn, action };
    });






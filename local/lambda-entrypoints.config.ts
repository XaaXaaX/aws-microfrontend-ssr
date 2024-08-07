import { Response } from "express";
import { globSync } from "glob";
import path, { join } from "path";

export type ConfigSource = { path: string, source: string, handlerFn?: string, action?: (...args: any) => void };
const configs: ConfigSource[] = [
    { path: "api/v1/bookmarks/", source: 'micro-fronends/bookmarks/src/handlers/list/index.ts' },
    { path: "api/v1/products/catalog/", source: 'micro-fronends/products/src/handlers/catalog/index.ts' },
    { path: "api/v1/products/details/", source: 'micro-fronends/products/src/handlers/details/index.ts', action: (req: Request, res: Response) => { console.log(req); res.writeHead(302, {Location: `/api/v1/products/catalog/v1/?category=ON_SOLD`}).end();} },
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






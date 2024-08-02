# Local development

To run the project locally first run the following command that uses the express to mount a local server from all handlers discovered based on configured paths

> npm run local:start

The service configs are as below 

```typescript
const configs: ConfigSource[] = [
    { path: "accounts/signin/v1/", source: '@account/signin/index.ts' },
    { path: "bookmarks/v1/", source: '@bookmark/bookmarks/index.ts' },
    { path: "products/catalog/v1/", source: 'products/src/catalog/index.ts' },
];
```

The project needs to have the following section as part of tsconfig.json to dynamically import when the alias paths are used

```json
"ts-node": {
    "require": ["tsconfig-paths/register"]
  },
  "require": [
      "ts-node/register/transpile-only"
  ],
```

## Site 
Run by default under the http://localhost:3000 it interacts with remote MFEs via this default but for local testing can be changed

after running local-lambda-invoke.ts a local server will be available server use as an example located in `local` folder.
Go to the root directory and follow the previous section

Change the `App.tsx` to give different urls to each MFE, or use the env var passed via package.json `REACT_APP_LOCAL_URL` 

If need to pass a different endpoint to some MFEs simply change the `App.tsx`, for example to point the CATALOG mfe to `http://localhost:9000/` change the line as below.

```typescript
fetchMfe("PRODUCT_CATALOG", 'http://localhost:9000/'),
````

Otherwise, the `REACT_APP_LOCAL_URL` env variable will be used

run the following command
> npm run local:website

## Others

sudo npx esbuild ./accounts/src/signin/index.ts --outdir=dist/account/v1 --serve=8000 --platform=node --main-fields=module,main

sudo npx esbuild ./accounts/src/signin/index.ts --outdir=dist/account/v1 --bundle --platform=node --main-fields=module,main

curl --header "Content-Type: application/json"  --request POST   --data '{"event":"{}","context":"{}"}'   http://localhost:4242/invoke/index/handler
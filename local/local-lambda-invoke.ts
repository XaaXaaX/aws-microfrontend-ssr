import express, { Request, Response } from 'express';
import { lambdasEntrypoints } from './lambda-entrypoints.config';
import dotenv from "dotenv";
import { createLambdaContextObjectFromContextPayload } from './local-lambda-context';
import cors from 'cors'; 
import { ALBEvent, APIGatewayEvent, LambdaFunctionURLEvent } from 'aws-lambda';

type LambdaEvent = ALBEvent | APIGatewayEvent | LambdaFunctionURLEvent;

const castSingleToMultiValue = (obj: any) => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, (value as string).split(",")])
  );
}

const castToRawQueryString = (obj: any) => {
  return Object.entries(obj).map(([key, value]) => `${key}=${value}`).join("&");
}

const generateEvent = (req: Request): LambdaEvent => {
  return {
    body: JSON.stringify(req.body),
    httpMethod: req.method,
    cookies: req.cookies,
    headers: req.headers as { [key: string]: string | undefined; },
    queryStringParameters: req.query as { [key: string]: string | undefined; },
    multiValueHeaders: castSingleToMultiValue(req.headers) as { [key: string]: string[]; },
    multiValueQueryStringParameters: castSingleToMultiValue(req.query) as { [key: string]: string[]; },
    rawQueryString: castToRawQueryString(req.query),
    path: req.path,
    rawPath: req.path,
    isBase64Encoded: false,
    version: "2.0",
    resource: "/{proxy+}",
    routeKey: "$default",
    pathParameters: req.params,
    requestContext: {
      authorizer: {
        claims: null,
        scopes: null,
        principalId: "local",
        integrationLatency: 1,
      },
      accountId: "123456789012",
      resourceId: "123456",
      resourcePath: "/{proxy+}",
      httpMethod: req.method,
      identity: {
        accessKey: "local-invoke-access-key",
        accountId: "123456789012",
        apiKey: "local-invoke-api-key",
        apiKeyId: "local-invoke-api-key-id",
        caller: "local-invoke-caller",
        cognitoAuthenticationProvider: "local-invoke-cognito-authentication-provider",
        cognitoAuthenticationType: "local-invoke-cognito-authentication-type",
        cognitoIdentityId: "local-invoke-cognito-identity-id",
        cognitoIdentityPoolId: "local-invoke-cognito-identity-pool-id",
        sourceIp: "127.0.0.1",
        user: "local-invoke-user",
        userAgent: "local",
        principalOrgId: "local-invoke-principal-org-id",
        clientCert: null,
        userArn: "arn:aws:iam::123456789012:user/local-invoke-user",
      },
      elb: {
        targetGroupArn: "arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/fake-targets/73e2d6bc24d8a067"
      },
      apiId: "1234567890",
      domainName: "fake-id.execute-api.us-east-1.amazonaws.com",
      routeKey: "$default",
      stage: "default",
      requestId: "JKJaXmPLvHcESHA=",
      time: "09/Apr/2015:12:34:56 +0000",
      timeEpoch: 1428582896000,
      http: {
        method: req.method,
        path: req.path,
        protocol: req.httpVersion,
        sourceIp: "127.0.0.1",
        userAgent: "local"
      },
    },
  };
}

const getExportedFunctionsFromModule = async (lambdaEntryPoint: string) => {
  const module = await import(lambdaEntryPoint);
  return Object.keys(module)
}

dotenv.config({
  path: `${__dirname}/.local.env`
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.text());
app.use(express.raw());
app.use(express.urlencoded({ extended: true }));
const router = express.Router();

const port = process.env.LOCAL_DEBUG_SERVER_PORT;

const handleRoute = async (lambdaEntry: { entryPoint: string, handlerFn?: string, }, req: Request, res: Response ) => {
  if (!lambdaEntry) {
    return res.status(404).json({
      error: "lambda entrypoint not found. An entrypoint should be the path of the lambda you want to invoke. Please make sure that your entrypoint is defined in `lambda-entrypoints.config.ts` file"
    })
      .end();
  }

  const module = await import(lambdaEntry.entryPoint);
  const lambdaFunctionHandler = module[lambdaEntry.handlerFn ?? "handler"];

  if (!lambdaFunctionHandler) {
    return res.status(404).json({
      error: "lambda handler not found. Please make sure that your lambda handler function is exported from your lambda entrypoint."
    }).end();
  }

  try {
        
    const event: LambdaEvent = generateEvent(req);

    const result = await lambdaFunctionHandler(event, createLambdaContextObjectFromContextPayload(req.body.context));
    return res.send(result.body).end();

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "lambda invocation resulted in an exception",
      error
    }).end();
  }
}

const generateRoutes = (lambdaEntry: { entryPoint: string; lambdaName: string; endpoint: string | undefined; handlerFn: string | undefined; }) => {
  router.all(`/${lambdaEntry.endpoint}/`, async (req: Request, res: Response) => {
    return handleRoute(lambdaEntry, req, res);
  });
}

console.log(`[Local λ debugger]: Registering invoke routes for enteries`);
lambdasEntrypoints.forEach((lambdaEntry) => {
  console.log(`  [λ endpoint]: Registering invoke route for ${lambdaEntry.endpoint}`);
  generateRoutes(lambdaEntry);
});

console.log(`[Local λ debugger]: Registering invoke lambda handler generic route`);
console.log(`  [λ invoke note]: To invoke a lambda directly the conjunction of filename and handler must be unique`);
console.log(`    [λ lambdaname (file name)]: Lambda name param must include the file extension. Example: my-lambda.ts`);
console.log(`    [λ handler (functionname)]: Handler param must be name of an exported function. Example: handler`);
router.all("/lambda/:lambda/:handler/", async (req: Request, res: Response) => {
  const lambdaEntry = lambdasEntrypoints.find(lambdaEntry => {
    return lambdaEntry.lambdaName === req.params.lambda; 
  });
  handleRoute(lambdaEntry!, req, res);
});

router.get('*', async (req: Request, res: Response) => {
  console.log(`[Local λ debugger]: Catch All route reached, route not configured for ${req.url}`);
  return res.status(404).json({ error: "route not found" }).end();
});

app.use("/invoke", router);

app.listen(port, async () => {
  console.log(`[Local λ debugger]: Local lambda invoke debug server is running at http://localhost:${port}`);
  console.log(`[Local λ debugger]: Discovered ${lambdasEntrypoints.length} lambdas entrypoints`);
  for (let index = 0; index < lambdasEntrypoints.length; index++) {
    const element = lambdasEntrypoints[index];
    console.log(`  [λ endpoint]: ${element.endpoint}`);
    const exportedFunctions = await getExportedFunctionsFromModule(element.entryPoint);

    exportedFunctions.forEach((f) => {
      console.log(`    [exported functions]: ${f}`);
    })
  }
});



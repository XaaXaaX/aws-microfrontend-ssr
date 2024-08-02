import { 
  APIGatewayProxyEventQueryStringParameters,
  ALBEventQueryStringParameters, 
  LambdaFunctionURLEvent, 
  LambdaFunctionURLEventWithIAMAuthorizer } from "aws-lambda";

export class RequestHelper {
    static DecodeQueryStringParams(
      params?: 
        LambdaFunctionURLEventWithIAMAuthorizer['queryStringParameters'] | 
        LambdaFunctionURLEvent['queryStringParameters'] |
        APIGatewayProxyEventQueryStringParameters |
        ALBEventQueryStringParameters
    ): Record<string, string> {

      const decoded: Record<string, string> = {};
      if (!params) return decoded;
      
      Object.keys(params).forEach((prop) => {
        if (params[prop]) 
          decoded[prop.replace(/^\?/, '')] = decodeURIComponent(params[prop]!);
      });
    
      return decoded;
    };
}
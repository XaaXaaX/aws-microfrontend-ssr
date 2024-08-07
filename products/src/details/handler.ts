
import { inject, injectable } from "tsyringe";
import { ActionResults } from "@helpers/action-results";
import { LambdaFunctionURLEvent, LambdaFunctionURLResult } from "aws-lambda";
import { ProductDetailsMicroFrontEnd } from "./details";
import { RequestHelper } from "@helpers/request-helper";

@injectable()
class ProductDetailsHandler {
    constructor(
        @inject(ProductDetailsMicroFrontEnd) private readonly mfe: ProductDetailsMicroFrontEnd) { }

    Invoke = async (event: LambdaFunctionURLEvent): Promise<LambdaFunctionURLResult> => {
        if( !event ) 
            throw new Error("Invalid request");

        console.debug("DetailPageHandler.Invoke", event);
  
        const { ref } = RequestHelper.DecodeQueryStringParams(event.queryStringParameters);

        if( !ref ) 
            throw new Error("Invalid or undefined product Reference");
        
        try {
            const result = await this.mfe.Render(ref);
            return ActionResults.Success(result);
            
        } catch (exception: any) {
            console.error(exception);
            if(exception instanceof Error)
                return ActionResults.BadRequest({ message: exception.message });
        
            return ActionResults.InternalServerError({});
        }
    }
}

export { ProductDetailsHandler };
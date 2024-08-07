
import { inject, injectable } from "tsyringe";
import { ActionResults } from "@helpers/action-results";
import { RequestHelper } from "@helpers/request-helper";
import { LambdaFunctionURLEvent, LambdaFunctionURLResult } from "aws-lambda";
import { CatalogMicroFrontEnd } from "./catalog";
import { Product } from "../models/model";

@injectable()
class CatalogHandler {
    constructor(
        @inject(CatalogMicroFrontEnd) private readonly mfe: CatalogMicroFrontEnd) { }

    Invoke = async (event: LambdaFunctionURLEvent): Promise<LambdaFunctionURLResult> => {
        console.debug("CatalogHandler.Invoke", event);
        const {
          ref: Ref,
          seller: Seller,
          name: ProductName,
          category: Category,
          price: Price
        } = RequestHelper.DecodeQueryStringParams(event.queryStringParameters);

        if( !event ) 
          throw new Error("Invalid request");

        try {
            const result = await this.mfe.Render({ Ref, Seller, ProductName, Category, Price: parseInt(Price ?? '0') } as Partial<Product>);
            return ActionResults.Success(result);
            
        } catch (exception: any) {
            console.error(exception);
            if(exception instanceof Error)
                return ActionResults.BadRequest({ message: exception.message });
        
            return ActionResults.InternalServerError({});
        }
    }
}

export { CatalogHandler };

import { inject, injectable } from "tsyringe";
import { ActionResults } from "@helpers/action-results";
import { RequestHelper } from "@helpers/request-helper";
import { LambdaFunctionURLEvent, LambdaFunctionURLResult } from "aws-lambda";
import { BookMarksMicroFrontEnd } from "./bookmarks";

@injectable()
class BookMarksHandler {
    constructor(
        @inject(BookMarksMicroFrontEnd) private readonly mfe: BookMarksMicroFrontEnd) { }

    Invoke = async (event: LambdaFunctionURLEvent): Promise<LambdaFunctionURLResult> => {
        const {
          ref: Ref,
          userid: UserId,
          name: ProductName
        } = RequestHelper.DecodeQueryStringParams(event.queryStringParameters);

        if( !event ) 
          throw new Error("Invalid request");

        try {
            const result = await this.mfe.Render({ Ref, UserId, ProductName });
            return ActionResults.Success(result);
            
        } catch (exception: any) {
            console.error(exception);
            if(exception instanceof Error)
                return ActionResults.BadRequest({ message: exception.message });
        
            return ActionResults.InternalServerError({});
        }
    }
}

export { BookMarksHandler };
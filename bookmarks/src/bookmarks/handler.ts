
import { inject, injectable } from "tsyringe";
import { ActionResults } from "@helpers/action-results";
import { RequestHelper } from "@helpers/request-helper";
import { LambdaFunctionURLEvent, LambdaFunctionURLResult } from "aws-lambda";
import { BookmarksMicroFrontEnd } from "./bookmarks";

@injectable()
class BookmarksHandler {
    constructor(
        @inject(BookmarksMicroFrontEnd) private readonly mfe: BookmarksMicroFrontEnd) { }

    Invoke = async (event: LambdaFunctionURLEvent): Promise<LambdaFunctionURLResult> => {
        console.debug("BookmarksHandler.Invoke", event);
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

export { BookmarksHandler };
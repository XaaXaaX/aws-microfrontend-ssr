
import { inject, injectable } from "tsyringe";
import { ActionResults } from "@helpers/action-results";
import { RequestHelper } from "@helpers/request-helper";
import { LambdaFunctionURLEvent, LambdaFunctionURLResult } from "aws-lambda";
import { SignInMicroFrontEnd } from "../../signin/signin";

@injectable()
class AccountsHandler {
    constructor(
        @inject(SignInMicroFrontEnd) private readonly mfe: SignInMicroFrontEnd) { }

    Invoke = async (event: LambdaFunctionURLEvent): Promise<LambdaFunctionURLResult> => {
        console.debug("AccountsHandler.Invoke", event);
        const {
          name: Name,
          userid: UserId,
          email: Email,
          password: Password,
        } = RequestHelper.DecodeQueryStringParams(event.queryStringParameters);

        if( !event ) 
          throw new Error("Invalid request");

        try {
            const result = await this.mfe.Render({ Email, UserId, Name, Password });
            return ActionResults.Success(result);
            
        } catch (exception: any) {
            console.error(exception);
            if(exception instanceof Error)
                return ActionResults.BadRequest({ message: exception.message });
        
            return ActionResults.InternalServerError({});
        }
    }
}

export { AccountsHandler };
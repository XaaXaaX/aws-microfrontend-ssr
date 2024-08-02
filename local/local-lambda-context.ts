import { Context } from "aws-lambda";

export const createLambdaContextObjectFromContextPayload = (context: Context) => {

    return {
        ...context,
        getRemainingTimeInMillis(): number {
            return 999;
        },
        done(): void {
            return;
        },
        fail(): void {
            return;
        },
        succeed(): void {
            return;
        }
    }

}
import "reflect-metadata";
import { container } from "tsyringe";
import { AccountsHandler} from "./handler";
import { AccountsRepository } from "../repository/accounts-repository";
import { SignInMicroFrontEnd } from "./signin";

container.register(AccountsHandler, {useClass: AccountsHandler});
container.register(AccountsRepository, {useClass: AccountsRepository});
container.register(SignInMicroFrontEnd, {useClass: SignInMicroFrontEnd});

const accountHandler = container.resolve(AccountsHandler);
export const handler = accountHandler.Invoke.bind(AccountsHandler);
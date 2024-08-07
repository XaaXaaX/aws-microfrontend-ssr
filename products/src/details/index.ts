import "reflect-metadata";
import { container } from "tsyringe";
import { ProductDetailsHandler} from "./handler";
import { ProductsRepository } from "../repository/catalogs-repository";
import { ProductDetailsMicroFrontEnd } from "./details";

container.register(ProductDetailsHandler, {useClass: ProductDetailsHandler});
container.register(ProductsRepository, {useClass: ProductsRepository});
container.register(ProductDetailsMicroFrontEnd, {useClass: ProductDetailsMicroFrontEnd});

const DetailsHandler = container.resolve(ProductDetailsHandler);
export const handler = DetailsHandler.Invoke.bind(ProductDetailsHandler);
import "reflect-metadata";
import { container } from "tsyringe";
import { CatalogHandler} from "./handler";
import { ProductsRepository } from "../repository/catalogs-repository";
import { CatalogMicroFrontEnd } from "./catalog";

container.register(CatalogHandler, {useClass: CatalogHandler});
container.register(ProductsRepository, {useClass: ProductsRepository});
container.register(CatalogMicroFrontEnd, {useClass: CatalogMicroFrontEnd});

const catalogHandler = container.resolve(CatalogHandler);
export const handler = catalogHandler.Invoke.bind(CatalogHandler);
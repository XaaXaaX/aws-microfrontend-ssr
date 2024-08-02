import "reflect-metadata";
import { container } from "tsyringe";
import { CatalogHandler} from "./handler";
import { CatalogsRepository } from "./repository/catalogs-repository";
import { CatalogMicroFrontEnd } from "./catalog";

container.register(CatalogHandler, {useClass: CatalogHandler});
container.register(CatalogsRepository, {useClass: CatalogsRepository});
container.register(CatalogMicroFrontEnd, {useClass: CatalogMicroFrontEnd});

const catalogHandler = container.resolve(CatalogHandler);
export const handler = catalogHandler.Invoke.bind(CatalogHandler);
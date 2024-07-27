import "reflect-metadata";
import { container } from "tsyringe";
import { BookMarksHandler} from "./handler";
import { BookMarksRepository } from "./repository/bookmarks-repository";
import { BookMarksMicroFrontEnd } from "./bookmarks";

container.register(BookMarksHandler, {useClass: BookMarksHandler});
container.register(BookMarksRepository, {useClass: BookMarksRepository});
container.register(BookMarksMicroFrontEnd, {useClass: BookMarksMicroFrontEnd});

const bookMarkHandler = container.resolve(BookMarksHandler);
export const handler = bookMarkHandler.Invoke.bind(BookMarksHandler);
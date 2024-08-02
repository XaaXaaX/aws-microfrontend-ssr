import "reflect-metadata";
import { container } from "tsyringe";
import { BookmarksHandler} from "./handler";
import { BookmarksRepository } from "./repository/bookmarks-repository";
import { BookmarksMicroFrontEnd } from "./bookmarks";

container.register(BookmarksHandler, {useClass: BookmarksHandler});
container.register(BookmarksRepository, {useClass: BookmarksRepository});
container.register(BookmarksMicroFrontEnd, {useClass: BookmarksMicroFrontEnd});

const bookmarkHandler = container.resolve(BookmarksHandler);
export const handler = bookmarkHandler.Invoke.bind(BookmarksHandler);
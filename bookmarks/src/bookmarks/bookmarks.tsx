import ReactDOMServer from 'react-dom/server';
import { inject, injectable } from 'tsyringe';
import { BookmarksRepository } from './repository/bookmarks-repository';
import { Bookmark } from './models/model';
import List from './components/List';

@injectable()
export class BookmarksMicroFrontEnd {
  constructor(
    @inject(BookmarksRepository) private readonly repository: BookmarksRepository) { }
  Render = async (filters: Partial<Bookmark>): Promise<string> => {

    const results = await this.repository.getBookmarks(filters) || [];

    return `<div id="bookmarks">${ReactDOMServer.renderToString(<List items={results} />)}</div>`;
  }
}

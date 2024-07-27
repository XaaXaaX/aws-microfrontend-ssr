import ReactDOMServer from 'react-dom/server';
import { inject, injectable } from 'tsyringe';
import { BookMarksRepository } from './repository/bookmarks-repository';
import { BookMark } from './models/model';
import List from './components/List';

@injectable()
export class BookMarksMicroFrontEnd {
  constructor(
    @inject(BookMarksRepository) private readonly repository: BookMarksRepository) { }
  Render = async (filters: Partial<BookMark>): Promise<string> => {

    const results = await this.repository.getCatalogs(filters) || [];

    return `<div id="product_catalog">${ReactDOMServer.renderToString(<List items={results} />)}</div>`;
  }
}

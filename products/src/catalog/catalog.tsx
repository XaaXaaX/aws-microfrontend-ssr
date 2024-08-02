import ReactDOMServer from 'react-dom/server';
import { inject, injectable } from 'tsyringe';
import { CatalogsRepository } from './repository/catalogs-repository';
import { Catalog } from './models/model';
import List from './components/List';

@injectable()
export class CatalogMicroFrontEnd {
  constructor(
    @inject(CatalogsRepository) private readonly repository: CatalogsRepository) { }
  Render = async (filters: Partial<Catalog>): Promise<string> => {

    const results = await this.repository.getCatalogs(filters) || [];

    return `<div id="product_catalog">${ReactDOMServer.renderToString(<List items={results} />)}</div>`;
  }
}

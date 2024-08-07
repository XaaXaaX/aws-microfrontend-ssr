import ReactDOMServer from 'react-dom/server';
import { inject, injectable } from 'tsyringe';
import { ProductsRepository } from '../repository/catalogs-repository';
import { Product } from '../models/model';
import List from './components/List';

@injectable()
export class CatalogMicroFrontEnd {
  constructor(
    @inject(ProductsRepository) private readonly repository: ProductsRepository) { }
  Render = async (filters: Partial<Product>): Promise<string> => {

    const results = await this.repository.getCatalog(filters) || [];

    return `<div id="product_catalog">${ReactDOMServer.renderToString(<List items={results} />)}</div>`;
  }
}

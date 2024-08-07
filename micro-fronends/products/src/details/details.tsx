import ReactDOMServer from 'react-dom/server';
import { inject, injectable } from 'tsyringe';
import { ProductsRepository } from '../repository/catalogs-repository';
import Item from '../details/components/item';


@injectable()
export class ProductDetailsMicroFrontEnd {
  constructor(
    @inject(ProductsRepository) private readonly repository: ProductsRepository) { }
  Render = async (ref: string): Promise<string> => {

    const results = await this.repository.getProduct(ref);

    if(results)
      return `<div id="product_catalog">${ReactDOMServer.renderToString(<Item item={results} />)}</div>`;

    return `<div id="product_catalog">Product not found</div>`;
  }
}

import { injectable } from "tsyringe";
import { Catalog } from "../models/model";

const catalogFakeList = [
  { ProductName: 'Product 1', Seller: 'Seller 1', Ref: 'Ref_1' },
  { ProductName: 'Product 2', Seller: 'Seller 2', Ref: 'Ref_2' },
  { ProductName: 'Product 3', Seller: 'Seller 3', Ref: 'Ref_3' },
  { ProductName: 'Product 4', Seller: 'Seller 4', Ref: 'Ref_4' },
  { ProductName: 'Product 5', Seller: 'Seller 5', Ref: 'Ref_5' },
];

@injectable()
export class CatalogsRepository {
    async getCatalogs(filters: Partial<Catalog>): Promise<Catalog[]> {
      if(filters) {
        const { Ref, Seller, ProductName } = filters;
        return await Promise.resolve(catalogFakeList.filter(
          catalog => 
            (!Ref || catalog.Ref.toLowerCase() === Ref.toLowerCase()) &&
            (!Seller || catalog.Seller.toLowerCase() === Seller.toLowerCase()) &&
            (!ProductName || catalog.ProductName.toLowerCase() === ProductName.toLowerCase())
        ));
      }
      return await Promise.resolve(catalogFakeList);
    }
}
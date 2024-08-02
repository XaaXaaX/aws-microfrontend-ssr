import { injectable } from "tsyringe";
import { Catalog } from "../models/model";

const catalogFakeList: Catalog[] = [
  { ProductName: 'Product 1', Seller: 'Seller 1', Ref: 'Ref_1', Category: 'CLASSIC' },
  { ProductName: 'Product 2', Seller: 'Seller 2', Ref: 'Ref_2', Category: 'ON_SOLD' },
  { ProductName: 'Product 3', Seller: 'Seller 3', Ref: 'Ref_3', Category: 'CLASSIC' },
  { ProductName: 'Product 4', Seller: 'Seller 4', Ref: 'Ref_4', Category: 'CLASSIC' },
  { ProductName: 'Product 5', Seller: 'Seller 5', Ref: 'Ref_5', Category: 'ON_SOLD' },
];

@injectable()
export class CatalogsRepository {
    async getCatalogs(filters: Partial<Catalog>): Promise<Catalog[]> {
      if(filters) {
        const { Ref, Seller, ProductName, Category } = filters;
        return await Promise.resolve(catalogFakeList.filter(
          catalog => 
            (!Ref || catalog.Ref.toLowerCase() === Ref.toLowerCase()) &&
            (!Seller || catalog.Seller.toLowerCase() === Seller.toLowerCase()) &&
            (!Category || catalog.Category.toLowerCase() === Category.toLowerCase()) &&
            (!ProductName || catalog.ProductName.toLowerCase() === ProductName.toLowerCase())
        ));
      }
      return await Promise.resolve(catalogFakeList);
    }
}
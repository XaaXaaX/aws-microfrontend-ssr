export interface Product {
  ProductName: string, 
  Ref: string, 
  Seller: string,
  Price: number,
  Category: 'CLASSIC' | 'ON_SOLD'
}

export type Catalog = Product[];
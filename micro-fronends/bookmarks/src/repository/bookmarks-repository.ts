import { injectable } from "tsyringe";
import { Bookmark } from "../models/model";

const bookmarks = [
  { ProductName: 'Product 1', UserId: 'Xu_UhgN_a', Ref: 'Ref_1' },
  { ProductName: 'Product 2', UserId: 'HJ-HnhYul_sm', Ref: 'Ref_2' },
  { ProductName: 'Product 3', UserId: 'Vnmq_azY_Q', Ref: 'Ref_3' },
  { ProductName: 'Product 4', UserId: 'HJ-HnhYul_sm', Ref: 'Ref_4' },
  { ProductName: 'Product 3', UserId: 'mwTgFDsZa_n', Ref: 'Ref_3' },
  { ProductName: 'Product 2', UserId: 'mwTgFDsZa_n', Ref: 'Ref_2' },
  { ProductName: 'Product 1', UserId: 'HJ-HnhYul_sm', Ref: 'Ref_1' },
];

@injectable()
export class BookmarksRepository {
    async getBookmarks(filters: Partial<Bookmark>): Promise<Bookmark[]> {
      if(filters) {
        const { Ref, UserId, ProductName } = filters;
        return await Promise.resolve(bookmarks.filter(
          bookmark => 
            (!Ref || bookmark.Ref.toLowerCase() === Ref.toLowerCase()) &&
            (!UserId || bookmark.UserId.toLowerCase() === UserId.toLowerCase()) &&
            (!ProductName || bookmark.ProductName.toLowerCase() === ProductName.toLowerCase())
        ));
      }
      return await Promise.resolve(bookmarks);
    }
}
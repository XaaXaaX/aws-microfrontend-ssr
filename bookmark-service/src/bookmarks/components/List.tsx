import { BookMark } from "../models/model";
import Item from "./item";

const List: React.FC<{ items: BookMark[] }> = ({ items }) => {
  return (
      <div>
        {items.map((item, index) => (
            <Item
                key={`catalog_product_${index}`}
                item={item}
            />
        ))}
      </div>
  );
};


export default List;

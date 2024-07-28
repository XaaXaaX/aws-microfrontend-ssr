import { BookMark } from "../models/model";
import Item from "./item";

const List: React.FC<{ items: BookMark[] }> = ({ items }) => {
  return (
      <div>
        <h3>Your Bookmarks</h3>
        {items.map((item, index) => (
            <Item
                key={`bookmark_${index}`}
                item={item}
            />
        ))}
      </div>
  );
};


export default List;

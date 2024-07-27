import { BookMark } from "../models/model";

const Item: React.FC<{ item: BookMark }> = ({ item }) => {
  return (
      <div>
        <h3>{item.ProductName}</h3>
        <h4>{item.Ref}</h4>
        <p>{item.Seller}</p>
      </div>
  );
};


export default Item;

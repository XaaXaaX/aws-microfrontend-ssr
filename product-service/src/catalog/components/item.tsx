import { Catalog } from "../models/model";

const Item: React.FC<{ item: Catalog }> = ({ item }) => {
  return (
      <div style={{"width" : "30%"}}>
        <h3>{item.ProductName}</h3>
        <h4>{item.Ref}</h4>
        <p>{item.Seller}</p>
      </div>
  );
};


export default Item;

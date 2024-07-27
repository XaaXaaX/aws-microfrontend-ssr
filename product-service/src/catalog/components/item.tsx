import { Catalog } from "../models/model";

const Item: React.FC<{ item: Catalog }> = ({ item }) => {
  return (
    <div style={{"width" : "26%"}}>
      <div style={{"display": "flex", "alignItems" : "stretch"}}>
        <h4>{item.ProductName} </h4><h6>{`(${item.Ref})`}</h6>
      </div>
      <p>👤: {item.Seller}</p>
    </div>
  );
};


export default Item;

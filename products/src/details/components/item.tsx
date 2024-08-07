import React from "react";
import { Product } from "../../models/model";

const Item: React.FC<{ item: Product }> = ({ item }) => {
  return (
    <>
      <div style={{"display": "flex", "alignItems" : "stretch"}}>
        <h5>{item.ProductName} </h5><h6>{`(${item.Ref})`}</h6>
      </div>
      <p>{item.Category === 'ON_SOLD' ? '🔥' : '💰'} {item.Price}</p>
      <p>👤: {item.Seller}</p>
    </>
  );
};


export default Item;

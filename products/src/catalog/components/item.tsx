import { Product } from "../../models/model";

const isOnSold = (item: Product) => {
  return item.Category === 'ON_SOLD';
}
const Item: React.FC<{ item: Product }> = ({ item }) => {
  return (
    <>
      <div style={{"display": "flex", "alignItems" : "stretch"}}>
        <h5>{item.ProductName} </h5><h6>{`(${item.Ref})`}</h6>
      </div>
      <a href={ isOnSold(item) ? `/${item.Ref}?ref=${item.Ref}` :`/products/?ref=${item.Ref}`}>🔍</a>
      <p>{ isOnSold(item) ? '🔥' : '💰'} {item.Price}</p>
      <p>👤: {item.Seller}</p>
    </>
  );
};


export default Item;

import { Product } from "../../models/model";

const isOnSold = (item: Product) => {
  return item.Category === 'ON_SOLD';
}
const Item: React.FC<{ item: Product }> = ({ item }) => {
  return (
    <>
      <div style={{"display": "flex", "alignItems" : "stretch"}}>
      <a style={{"color":"white", "textDecoration":"solid"}} href={ isOnSold(item) ? `/${item.Ref}?ref=${item.Ref}` :`/products/?ref=${item.Ref}`}>
          <h5>{item.ProductName} </h5><h6>{`(${item.Ref})`}</h6>
      </a>
      </div>
      <p>{ isOnSold(item) ? '🔥' : '💰'} {item.Price}</p>
      <p>👤: {item.Seller}</p>
    </>
  );
};


export default Item;

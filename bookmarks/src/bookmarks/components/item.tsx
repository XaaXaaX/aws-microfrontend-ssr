import { Bookmark } from "../models/model";

const Item: React.FC<{ item: Bookmark }> = ({ item }) => {
  return (
      <div style={{"display": "flex", "alignItems" : "stretch"}}>
        <h5>{item.ProductName} ♥ </h5><h6>{`(${item.Ref})`}</h6>
      </div>
  );
};


export default Item;

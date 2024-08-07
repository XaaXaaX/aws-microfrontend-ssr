import { Catalog } from "../../models/model";
import Item from "./item";

const List: React.FC<{ items: Catalog }> = ({ items }) => {
  return (
      <div style={{"display": "flex", "flexFlow": "row wrap", "overflow": "visible", "gap": "5%"}}>
        {items.map((item, index) => (
          <div key={`catalog_product_${index}_container`} style={{"width": `${100 / (items.length ?? 1)}%`}}>
            <Item
                key={`catalog_product_${index}`}
                item={item}
            />
          </div>
        ))}
      </div>
  );
};


export default List;

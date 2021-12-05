import { getAllItemNamesAndBlank } from "../data.js";
import * as dungeonUtils from "../dungeonUtils.js";
import Dropdown from './Dropdown.js';

function ItemDropdown(props) {
  const itemNames = getAllItemNamesAndBlank();
  const itemTiers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div>
      <Dropdown
        selectedOption={props.item.name}
        onChange={(event) => props.onItemChanged(event.target.value, props.item.tier)}
        options={itemNames}
      />
      <Dropdown
        selectedOption={props.item.tier}
        onChange={(event) => props.onItemChanged(props.item.name, event.target.value)}
        options={itemTiers}
      />
      &nbsp;{dungeonUtils.getDescriptionOfItem(props.item)}
    </div>
  )
}

export default ItemDropdown;

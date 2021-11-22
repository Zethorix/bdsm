import ItemDropdown from './ItemDropdown.js';
import { useState } from 'react';

function PlayerForm(props) {
  const [items, setItems] = useState(props.player.items);

  return (
    <div>
      Username:
      <input onChange={(event) => {
        props.onPlayerChanged(event.target.value, items);
      }} />
      {items.map((item, index) =>
        <ItemDropdown
          key={index}
          item={item}
          onItemChanged={(name, tier) => {
            let newItems = [...items];
            newItems[index] = {name: name, tier: parseInt(tier)};
            setItems(newItems);
            props.onPlayerChanged(props.player.username, newItems);
          }}
        />
      )}
      <br/>
    </div>
  );
}

export default PlayerForm;

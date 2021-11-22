import ItemDropdown from './ItemDropdown.js';
import { useState } from 'react';

function PlayerForm(props) {
  const [items, setItems] = useState(props.player.items);
  const [monuments, setMonuments] = useState(props.player.monuments);

  return (
    <div>
      Username:
      <input onChange={(event) => {
        props.onPlayerChanged(event.target.value, props.player.items, props.player.monuments);
      }} />
      {items.map((item, index) =>
        <ItemDropdown
          key={index}
          item={item}
          onItemChanged={(name, tier) => {
            let newItems = [...items];
            newItems[index] = {name: name, tier: parseInt(tier)};
            setItems(newItems);
            props.onPlayerChanged(props.player.username, newItems, props.players.monuments);
          }}
        />
      )}
      Monuments:
      <br/>
      Health:
      <input type="number" min={0} value={props.player.Health} onChange={(event) => {
        let newMonuments = {...monuments};
        newMonuments.Health = event.target.value;
        setMonuments(newMonuments);
        props.onPlayerChanged(
            props.player.username,
            props.player.items,
            newMonuments);
      }} />
      &nbsp;
      Power:
      <input type="number" min={0} value={props.player.Power} onChange={(event) => {
        let newMonuments = {...monuments};
        newMonuments.Power = event.target.value;
        setMonuments(newMonuments);
        props.onPlayerChanged(
            props.player.username,
            props.player.items,
            newMonuments);
      }} />
      &nbsp;
      Speed:
      <input type="number" min={0} value={props.player.Speed} onChange={(event) => {
        let newMonuments = {...monuments};
        newMonuments.Speed = event.target.value;
        setMonuments(newMonuments);
        props.onPlayerChanged(
            props.player.username,
            props.player.items,
            newMonuments);
      }} />
      <br/>
      <br/>
    </div>
  );
}

export default PlayerForm;

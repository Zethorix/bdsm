import ItemDropdown from './ItemDropdown.js';
import MonumentsSection from './MonumentsSection.js';
import { parseInventory, parseMonuments } from '../dungeonUtils.js';
import { useState } from 'react';
import './PlayerForm.css';

function PlayerForm(props) {
  const [items, setItems] = useState(props.player.items);
  const [rawInput, setRawInput] = useState('');

  return (
    <div className="playerForm">
      Load from !api e or !appr:&nbsp;
      <textarea value={rawInput} onChange={(event) => {
        var newPlayer = parseInventory(event.target.value);
        if (newPlayer === null) {
          newPlayer = props.player;
        }
        var newMonuments = parseMonuments(event.target.value);
        if (newMonuments === null) {
          newMonuments = props.player.monuments;
        }
        props.onPlayerChanged(newPlayer.username, newPlayer.items, newMonuments)
        setItems(newPlayer.items);
        setRawInput('');
      }} />
      <br />
      Username:
      <input value={props.player.username} onChange={(event) => {
        props.onPlayerChanged(event.target.value, props.player.items, props.player.monuments);
      }} />
      {items.map((item, index) =>
        <ItemDropdown
          key={index}
          item={item}
          onItemChanged={(name, tier) => {
            let newItems = [...items];
            newItems[index] = { name: name, tier: parseInt(tier) };
            setItems(newItems);
            props.onPlayerChanged(props.player.username, newItems, props.player.monuments);
          }}
        />
      )}
      <MonumentsSection
        monuments={props.player.monuments}
        onMonumentsChanged={
          (newMonuments) =>
            props.onPlayerChanged(props.player.username, props.player.items, newMonuments)
        }
      />
    </div>
  );
}

export default PlayerForm;

import ItemDropdown from './ItemDropdown.js';
import MonumentInput from './MonumentInput.js';
import { parseInventory, parseMonuments } from '../dungeonUtils.js';
import { useState } from 'react';

function PlayerForm(props) {
  const [items, setItems] = useState(props.player.items);
  const [monuments, setMonuments] = useState(props.player.monuments);
  const [rawInput, setRawInput] = useState('');

  return (
    <div>
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
        setMonuments(newMonuments);
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
      Monuments:
      <br />
      Health:
      <MonumentInput
        value={props.player.monuments.Health}
        onValueChanged={(newHealth) => {
          let newMonuments = { ...monuments };
          newMonuments.Health = newHealth;
          setMonuments(newMonuments);
          props.onPlayerChanged(
            props.player.username,
            props.player.items,
            newMonuments);
        }} />
      &nbsp;
      Power:
      <MonumentInput
        value={props.player.monuments.Power}
        onValueChanged={(newPower) => {
        let newMonuments = { ...monuments };
        newMonuments.Power = newPower;
        setMonuments(newMonuments);
        props.onPlayerChanged(
          props.player.username,
          props.player.items,
          newMonuments);
      }} />
      &nbsp;
      Speed:
      <MonumentInput
        value={props.player.monuments.Speed}
        onValueChanged={(newSpeed) => {
        let newMonuments = { ...monuments };
        newMonuments.Speed = newSpeed;
        setMonuments(newMonuments);
        props.onPlayerChanged(
          props.player.username,
          props.player.items,
          newMonuments);
      }} />
      &nbsp;
      Angel:
      <input type="checkbox" checked={props.player.monuments.Angel} onChange={(event) => {
        let newMonuments = { ...monuments };
        newMonuments.Angel = event.target.checked;
        setMonuments(newMonuments);
        props.onPlayerChanged(
          props.player.username,
          props.player.items,
          newMonuments);
      }} />
      <br />
      <br />
    </div>
  );
}

export default PlayerForm;

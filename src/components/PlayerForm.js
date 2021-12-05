import ItemDropdown from './ItemDropdown.js';
import * as dungeonUtils from '../dungeonUtils.js';
import { useState } from 'react';

function PlayerForm(props) {
  const [rawInput, setRawInput] = useState('');

  return (
    <div>
      Load from !api e, !appr, or BDSM profile:&nbsp;
      <textarea value={rawInput} onChange={(event) => {
        var newPlayer = dungeonUtils.parseInventory(event.target.value);
        if (newPlayer === null) {
          newPlayer = props.player;
        }
        var newMonuments = dungeonUtils.parseMonuments(event.target.value);
        props.onPlayerChanged(newPlayer.username, newPlayer.items, newMonuments)
        setRawInput('');
      }} />
      <br />
      <button onClick={() => {
        navigator.clipboard.writeText(dungeonUtils.serializePlayer(props.player))
      }}> Copy BDSM profile </button>
      <br />
      Username:
      <input value={props.player.username} onChange={(event) => {
        props.onPlayerChanged(event.target.value, props.player.items, props.player.monuments);
      }} />
      {props.player.items.map((item, index) =>
        <ItemDropdown
          key={index}
          item={item}
          onItemChanged={(name, tier) => {
            let newItems = [...props.player.items];
            newItems[index] = {name: name, tier: parseInt(tier)};
            props.onPlayerChanged(props.player.username, newItems, props.player.monuments);
          }}
        />
      )}
      Monuments:
      <br/>
      Health:
      <input type="number" min={0} value={props.player.monuments.Health} onChange={(event) => {
        let newMonuments = {...props.player.monuments};
        newMonuments.Health = event.target.value >>> 0;
        props.onPlayerChanged(
            props.player.username,
            props.player.items,
            newMonuments);
      }} />
      &nbsp;
      Power:
      <input type="number" min={0} value={props.player.monuments.Power} onChange={(event) => {
        let newMonuments = {...props.player.monuments};
        newMonuments.Power = event.target.value >>> 0;
        props.onPlayerChanged(
            props.player.username,
            props.player.items,
            newMonuments);
      }} />
      &nbsp;
      Speed:
      <input type="number" min={0} value={props.player.monuments.Speed} onChange={(event) => {
        let newMonuments = {...props.player.monuments};
        newMonuments.Speed = event.target.value >>> 0;
        props.onPlayerChanged(
            props.player.username,
            props.player.items,
            newMonuments);
      }} />
      &nbsp;
      Angel:
      <input type="checkbox" checked={props.player.monuments.Angel} onChange={(event) => {
        let newMonuments = {...props.player.monuments};
        newMonuments.Angel = event.target.checked;
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

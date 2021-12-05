import ItemDropdown from './ItemDropdown.js';
import MonumentsSection from './MonumentsSection.js';
import * as dungeonUtils from '../dungeonUtils.js';
import { useState } from 'react';
import './PlayerForm.css';

function PlayerForm(props) {
  const [rawInput, setRawInput] = useState('');

  return (
    <div className="playerForm">
      Load from !api e, !appr, or BDSM profile:&nbsp;
      <textarea value={rawInput} onChange={(event) => {
        var newPlayer = dungeonUtils.parseInventory(event.target.value);
        if (newPlayer === null) {
          newPlayer = props.player;
        }
        const newMonuments = { ...props.player.monuments };
        Object.assign(newMonuments, dungeonUtils.parseMonuments(event.target.value));
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
            newItems[index] = { name: name, tier: parseInt(tier) };
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
      {props.player.items.map((item) =>
        <div className="itemDescription">{dungeonUtils.getDescriptionOfItem(item)}</div>)}
    </div>
  );
}

export default PlayerForm;

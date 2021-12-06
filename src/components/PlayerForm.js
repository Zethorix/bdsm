import ItemDropdown from './ItemDropdown.js';
import LoadPlayerSection from './LoadPlayerSection.js';
import MonumentsSection from './MonumentsSection.js';
import PlayerSummary from './PlayerSummary.js';
import { useState } from 'react';
import './PlayerForm.css';

function PlayerForm(props) {
  return (
    <div className="playerForm">
      <LoadPlayerSection
        player={props.player}
        onPlayerChanged={props.onPlayerChanged}
      />
      <hr className="divider"></hr>
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
      <PlayerSummary player={props.player}></PlayerSummary>
    </div>
  );
}

export default PlayerForm;

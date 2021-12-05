import * as dungeonUtils from '../dungeonUtils.js';
import { useState } from 'react';

function LoadPlayerSection(props) {
  const [rawInput, setRawInput] = useState('');

  return (
    <div>
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
    </div>
  );
}

export default LoadPlayerSection;
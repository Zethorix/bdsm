import * as data from '../data.js';
import Dropdown from './Dropdown.js';
import { outputTest } from '../test.js';
import PlayerForm from './PlayerForm.js';
import { useState } from 'react';

function Simulator() {
  const dungeonList = data.getDungeonList();
  const [numRuns, setNumRuns] = useState(100);
  const [selectedDungeon, setSelectedDungeon] = useState('[3,0]');
  const [outputText, setOutputText] = useState("Select your items with the dropdowns.\nClick the button to start a test run!");
  const [players, setPlayers] = useState([
      getInitialPlayer(),
      getInitialPlayer(),
      getInitialPlayer(),
      getInitialPlayer(),
      getInitialPlayer()
  ]);

  function getInitialPlayer() {
    return {
      username: "",
      items: [
        getInitialItem(),
        getInitialItem(),
        getInitialItem(),
        getInitialItem()
      ],
      monuments: {
        Health: 0,
        Power: 0,
        Speed: 0,
        Angel: false
      }
    };
  }
  
  function getInitialItem() {
    return { name: "", tier: 1 };
  }

  function onRunTest() {
    const output = outputTest(players, selectedDungeon, numRuns);
    setOutputText(output);
  }

  return (
    <div>
      {players.map((player, index) =>
        <PlayerForm
          key={index}
          player={player}
          onPlayerChanged={(username, items, monuments) => {
            let newPlayers = [...players];
            newPlayers[index] = {
              username: username,
              items: items,
              monuments: monuments
            };
            setPlayers(newPlayers);
          }}
        />
      )}
      Dungeon:
      <Dropdown
        selectedOption={selectedDungeon}
        onChange={(event) => {setSelectedDungeon(event.target.value);}}
        options={dungeonList}
      />
      <br/>
      Number of runs:
      <input type="number" value={numRuns} onChange={(event) => {
        setNumRuns(event.target.value);
      }} />
      <br/>
      <button onClick={onRunTest}>
        Run Test
      </button>
      <div style={{whiteSpace: 'pre-line'}}>{outputText}</div>
    </div>
  );
}

export default Simulator;

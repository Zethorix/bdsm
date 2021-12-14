import * as data from '../data.js';
import Dropdown from './Dropdown.js';
import * as dungeonUtils from '../dungeonUtils.js';
import * as localStorageUtils from '../localStorageUtils.js';
import { outputManyRuns, outputSingleRun } from '../test.js';
import OutputLogs from './OutputLogs.js';
import PlayerForm from './PlayerForm.js';
import { useState } from 'react';
import * as utils from '../utils.js';
import './Simulator.css';

function Simulator() {
  const dungeonList = data.getDungeonList();
  const [numRuns, setNumRuns] = localStorageUtils.useStateWithLocalStorage("numRuns", 100);
  const [selectedDungeon, setSelectedDungeon] = localStorageUtils.useStateWithLocalStorage(
    "selectedDungeon",
    dungeonList[0]);
  const [outputText, setOutputText] = useState("Select your items with the dropdowns.\nClick the button to start a test run!");
  const [rawInput, setRawInput] = useState('');

  const [players, setPlayers] = localStorageUtils.useStateWithLocalStorage("players", [
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

  function parsePlayers(input) {
    if (!input.startsWith('BDSM.partyStart')) {
      return null;
    }
    const players = []
    for (const rawPlayer of input.split('BDSM.playerDivider')) {
      const newPlayer = getInitialPlayer();
      Object.assign(newPlayer, dungeonUtils.parseInventory(rawPlayer));
      Object.assign(newPlayer.monuments, dungeonUtils.parseMonuments(rawPlayer));
      players.push(newPlayer);
    }
    while (players.length < 5) {
      players.push(getInitialPlayer());
    }
    return players;
  }

  function getInitialItem() {
    return { name: "", tier: 1 };
  }

  function onRunSingle() {
    try {
      const output = outputSingleRun(players, selectedDungeon);
      setOutputText(output);
    } catch(err) {
      setOutputText(utils.format('An error has occurred: {0}', err.message));
    }
  }

  function onRunMany() {
    try {
      const output = outputManyRuns(players, selectedDungeon, numRuns);
      setOutputText(output);
    } catch(err) {
      setOutputText(utils.format('An error has occurred: {0}', err.message));
    }
  }

  return (
    <div className="simulator">
      <button onClick={() => {
        localStorageUtils.clear();
        window.location.reload();
      }}>Clear Cache</button>
      <br />
      Load BDSM party profile:&nbsp;
      <textarea value={rawInput} onChange={(event) => {
        const newParty = parsePlayers(event.target.value);
        if (newParty !== null) {
          setPlayers(newParty);
        }
        setRawInput('');
      }} />
      <br />
      <button onClick={() => {
        navigator.clipboard.writeText(dungeonUtils.serializePlayers(players))
      }}> Copy BDSM party profile </button>
      <br />
      <div className="party">
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
      </div>
      [Season, Dungeon]:
      <Dropdown
        selectedOption={selectedDungeon}
        onChange={(event) => { setSelectedDungeon(event.target.value); }}
        options={dungeonList}
      />
      <br />
      Number of runs:
      <input type="number" min={0} value={numRuns} onChange={(event) => {
        setNumRuns(parseInt(event.target.value));
      }} />
      <br />
      <button onClick={onRunMany}>
        Run Simulations
      </button>
      <br />
      <button onClick={onRunSingle}>
        Example Run
      </button>
      <OutputLogs value={outputText}/>
    </div>
  );
}

export default Simulator;

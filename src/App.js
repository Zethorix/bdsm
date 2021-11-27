import Simulator from "./components/Simulator.js";

function App() {
  return (
    <div style={{backgroundColor: 'dimgrey', color:'white'}}>
      <h1>Boxbox Dungeon SiMulator (BDSM)</h1>
      <div><i>Created by Zethorix#1064 and Oof#4389 (qaisklyi)</i></div>
      <h3>(The pity system is currently not implemented)</h3>
      <br />
      <p>Enter your party's items and monuments.</p>
      <Simulator />
    </div>
  );
}

export default App;

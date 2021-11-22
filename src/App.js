import Simulator from "./components/Simulator.js";

function App() {
  return (
    <div>
      <h1>Boxbox Dungeon SiMulator (BDSM)</h1>
      <h3>The simulator has been updated with known information from Season 3!</h3>
      <h3>(The pity system is currently not implemented)</h3>
      <p>Enter your party's items and monuments.</p>
      <br />
      <Simulator />
    </div>
  );
}

export default App;

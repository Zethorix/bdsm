import Simulator from "./components/Simulator.js";
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Boxbox Dungeon SiMulator (BDSM)</h1>
      <div><i>Created by Zethorix#1064 and Oof#4389 (qaisklyi)</i></div>
      <div><i><strong>(The pity system is currently not implemented)</strong></i></div>
      <br />
      <div>Boxbox Discord Feud is looking for 5 contestants to form a team and go against Seorin's team in the game show!</div>
      <div>The show is completely similar to Family Feud and the questions are from the survey that you might have completed before!</div>
      <div>Tag FQVBSina in Discord for more details, if you have questions, etc.</div>
      <a target="_blank" href="https://docs.google.com/forms/d/1uAlkovIQo0IOmZO0Hc6zrpeFkfP5s7odUgriO2J8DfY">https://docs.google.com/forms/d/1uAlkovIQo0IOmZO0Hc6zrpeFkfP5s7odUgriO2J8DfY</a>
      <p>Enter your party's items and monuments.</p>
      <Simulator />
    </div>
  );
}

export default App;

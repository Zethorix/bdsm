import { outputTest } from '../test.js';
import { getAllItemNames } from "../data.js";
import Dropdown from './Dropdown.js';
import { useState } from 'react';

function Simulator() {
  const energyItems = getAllItemNames(2);

  const [text, setText] = useState("Click the button to start a test run!");
  const [item, setItem] = useState(energyItems[0]);

  function onRunTest() {
    const output = outputTest(item);
    setText(output);
  }

  return (
    <div>
      <Dropdown
        selectedOption={item}
        onChange={(event) => setItem(event.target.value)}
        options={energyItems}
      />
      <br />
      <button onClick={onRunTest}>
        Run Test
      </button>
      <div>{text}</div>
    </div>
  );
}

export default Simulator;

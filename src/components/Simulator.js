import { outputTest } from '../test.js';
import { getAllItemNamesAndBlank } from "../data.js";
import Dropdown from './Dropdown.js';
import { useState } from 'react';

function Simulator() {
  const itemNames = getAllItemNamesAndBlank(2);

  const [text, setText] = useState("Click the button to start a test run!");
  const [item, setItem] = useState('');

  function onRunTest() {
    const output = outputTest(item);
    setText(output);
  }

  return (
    <div>
      <Dropdown
        selectedOption={item}
        onChange={(event) => setItem(event.target.value)}
        options={itemNames}
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

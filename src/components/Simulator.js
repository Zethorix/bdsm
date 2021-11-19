import { outputTest } from '../test.js';
import { getAllItemNames } from "../data.js";
import Dropdown from './Dropdown.js';
import { useState } from 'react';

function Simulator() {
  const [text, setText] = useState("Click the button to start a test run!");

  function onRunTest() {
    const output = outputTest();
    setText(output);
  }

  return (
    <div>
      <Dropdown options={getAllItemNames(2)}/>
      <br />
      <button onClick={onRunTest}>
        Run Test
      </button>
      <div>{text}</div>
    </div>
  );
}

export default Simulator;

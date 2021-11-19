import { outputTest } from '../test.js';
import { useState } from 'react';

function Simulator() {
  const [text, setText] = useState("Click the button to start a test run!");

  const onRunTest = () => {
    const output = outputTest();
    setText(output);
  }

  return (
    <div>
      <button onClick={onRunTest}>
        Run Test
      </button>
      <div>{text}</div>
    </div>
  );
}

export default Simulator;
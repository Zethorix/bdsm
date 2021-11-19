import { outputTest } from '../test.js';
import ItemDropdown from './ItemDropdown.js';
import { useState } from 'react';

function Simulator() {
  const [text, setText] = useState("Click the button to start a test run!");
  const [item, setItem] = useState({ name: "", tier: 1 });

  function onRunTest() {
    const output = outputTest(item);
    setText(output);
  }

  return (
    <div>
      <ItemDropdown
        item={item}
        onItemChanged={(name, tier) => setItem({ name: name, tier: tier })}
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

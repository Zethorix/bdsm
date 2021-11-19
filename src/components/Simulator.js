import { outputTest } from '../test.js';
import ItemDropdown from './ItemDropdown.js';
import { useState } from 'react';

function Simulator() {
  const [outputText, setOutputText] = useState("Select your items with the dropdowns.\nClick the button to start a test run!");
  const [items, setItems] = useState([getInitialItem(), getInitialItem(), getInitialItem(), getInitialItem()]);

  function getInitialItem() {
    return { name: "", tier: 1 };
  }

  function onRunTest() {
    const output = outputTest(items);
    setOutputText(output);
  }

  return (
    <div>
      {items.map((item, index) =>
        <ItemDropdown
          key={index}
          item={item}
          onItemChanged={(name, tier) => {
            let newItems = [...items];
            newItems[index] = {name: name, tier: tier};
            setItems(newItems);
          }}
        />
      )}
      <br />
      <button onClick={onRunTest}>
        Run Test
      </button>
      <div style={{whiteSpace: 'pre-line'}}>{outputText}</div>
    </div>
  );
}

export default Simulator;

import { outputTest } from '../test.js';
import ItemDropdown from './ItemDropdown.js';
import { useState } from 'react';

function Simulator() {
  const [text, setText] = useState("Click the button to start a test run!");
  const [items, setItems] = useState([getInitialItem(), getInitialItem(), getInitialItem(), getInitialItem()]);

  function getInitialItem() {
    return { name: "", tier: 1 };
  }

  function onRunTest() {
    const output = outputTest(items);
    setText(output);
  }

  return (
    <div>
      {items.map((item, index) =>
        <ItemDropdown
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
      <div>{text}</div>
    </div>
  );
}

export default Simulator;

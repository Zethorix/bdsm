function Dropdown(props) {
  return (
    <select>
      {props.options.map((option) => <option>{option}</option>)}
    </select>
  );
}

export default Dropdown;
function Dropdown(props) {
  return (
    <select value={props.selectedOption} onChange={props.onChange}>
      {props.options.map((option) => <option key={option}>{option}</option>)}
    </select>
  );
}

export default Dropdown;
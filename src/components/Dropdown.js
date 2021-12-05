function Dropdown(props) {
  return (
    <select value={props.selectedOption} onChange={props.onChange}>
      {props.options.map((option, index) => <option key={index}>{option}</option>)}
    </select>
  );
}

export default Dropdown;

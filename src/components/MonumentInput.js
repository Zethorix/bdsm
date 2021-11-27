import './Monuments.css';

function MonumentInput(props) {
  return (
    <input
      className="monumentInput"
      type="number"
      min={0}
      value={props.value}
      onChange={(event) => { props.onValueChanged(event.target.value) }}
    />
  )
}

export default MonumentInput;
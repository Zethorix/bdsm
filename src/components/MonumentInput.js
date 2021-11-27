function MonumentInput(props) {
  return (
    <input
      type="number"
      min={0}
      value={props.value}
      onChange={(event) => { props.onValueChanged(event.target.value) }}
    />
  )
}

export default MonumentInput;
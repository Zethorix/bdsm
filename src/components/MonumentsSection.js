import MonumentInput from './MonumentInput.js';
import './Monuments.css';

function MonumentsSection(props) {
  return <>
    Monuments:
    <div className="monumentsSection">
      <div className="statMonuments">
        <div>
          Health:
          <MonumentInput
            value={props.monuments.Health}
            onValueChanged={(newHealth) => {
              let newMonuments = { ...props.monuments };
              newMonuments.Health = newHealth;
              props.onMonumentsChanged(newMonuments);
            }} />
        </div>
        <div>
          Power:
          <MonumentInput
            value={props.monuments.Power}
            onValueChanged={(newPower) => {
              let newMonuments = { ...props.monuments };
              newMonuments.Power = newPower;
              props.onMonumentsChanged(newMonuments);
            }} />
        </div>
        <div>
          Speed:
          <MonumentInput
            value={props.monuments.Speed}
            onValueChanged={(newSpeed) => {
              let newMonuments = { ...props.monuments };
              newMonuments.Speed = newSpeed;
              props.onMonumentsChanged(newMonuments);
            }} />
        </div>
      </div>
      <div>
        Angel:
        <input type="checkbox" checked={props.monuments.Angel}
          onChange={(event) => {
            let newMonuments = { ...props.monuments };
            newMonuments.Angel = event.target.checked;
            props.onMonumentsChanged(newMonuments);
          }} />
      </div>
    </div>
  </>;
}

export default MonumentsSection;
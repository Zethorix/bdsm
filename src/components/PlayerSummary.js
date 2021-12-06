import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import * as character from '../character.js';
import * as dungeonUtils from '../dungeonUtils.js';
import { useState } from 'react';

function PlayerSummary(props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="playerSummary">
      <button className="button" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? <FontAwesomeIcon icon={faCaretUp} /> : <FontAwesomeIcon icon={faCaretDown} />}
        {isExpanded ? " Collapse" : " Expand"} player info
      </button>
      {isExpanded ?
        <div className="content">
          <Stats player={props.player} />
          {props.player.items.map((item) => {
            if (item.name === '') {
              return null;
            }
            return <div className="itemDescription">
              <span className="itemName">{item.name} {item.tier}</span>{": "}
              {dungeonUtils.getDescriptionOfItem(item)}
            </div>
          })}
        </div>
        : null}
    </div>
  );
}

function Stats(props) {
  const stats = character.getBaseStats(props.player)

  return (
    <div className="statsSection">
      <div className="stat"><b>HP:</b> {stats.hpMax}</div>
      <div className="stat"><b>Speed: </b>{stats.speed}</div>
      <div className="stat"><b>Attack: </b>{stats.attackLow}-{stats.attackHigh}</div>
    </div>
  )
}

export default PlayerSummary;

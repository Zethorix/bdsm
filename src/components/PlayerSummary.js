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
          <div>{JSON.stringify(character.getBaseStats(props.player))}</div>
          {props.player.items.map((item) => {
            if (item.name === '') {
              return;
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

export default PlayerSummary;

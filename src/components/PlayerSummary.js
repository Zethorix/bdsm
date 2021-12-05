import * as dungeonUtils from '../dungeonUtils.js';
import { useState } from 'react';

function PlayerSummary(props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="playerSummary">
      <button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? "Collapse" : "Expand"} player info
      </button>
      {isExpanded ?
        <div className="content">
          {props.player.items.map((item) => {
            if (item.name === '') {
              return;
            }
            return <div className="itemDescription">
              <strong>{item.name} {item.tier}</strong>:&nbsp;
              {dungeonUtils.getDescriptionOfItem(item)}
            </div>
          })}
        </div>
        : null}
    </div>
  );
}

export default PlayerSummary;

'use strict';

const e = React.createElement;

class TestButton extends React.Component {

  render() {
    return e(
      'button',
      { onClick: () => buttontest() },
      'Click'
    );
  }
}

const domContainer = document.querySelector('#test_button');
ReactDOM.render(e(TestButton), domContainer);
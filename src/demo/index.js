import 'classlist-polyfill';

import React, {Component} from 'react';
import ReactDOM, {findDOMNode} from 'react-dom';
import classNames from 'classnames';

import './index.less';
import {TagInput} from '../main/TagInput';

class Demo extends Component {

  state = {
    value: ''
  };

  render() {
    return (
      <div className="container">
        <h1><span className="light">React</span> Tag Input <span className="light">0.0.1</span></h1>
        <div className="row">
          <div className="col-md-4">

            <TagInput className="form-control" tags={['foooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo', 'bar1', 'bar2', 'bar3', 'bar4', 'bar5', 'bar6', 'bar7', 'bar8', 'bar9', 'bar0', 'bar11']}/>

          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo/>, document.getElementById('demo'));

import 'classlist-polyfill';

import React, {Component} from 'react';
import ReactDOM, {findDOMNode} from 'react-dom';
import classNames from 'classnames';

import './index.less';
import {TagListEditor} from '../main/TagListEditor';

class Demo extends Component {

  state = {
    tags: ['foooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo', 'bar1', 'bar2', 'bar3', 'bar4', 'bar5', 'bar6', 'bar7', 'bar8', 'bar9', 'bar0', 'bar11']
  };

  render() {
    return (
      <div className="container">
        <h1><span className="light">React</span> Tag List Editor <span className="light">0.0.2</span></h1>
        <div className="row">
          <div className="col-md-4">

            <TagListEditor className="form-control" tags={this.state.tags}
                      placeholder="Fooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo"
                      onTagsChange={tags => this.setState({tags})}/>

          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo/>, document.getElementById('demo'));

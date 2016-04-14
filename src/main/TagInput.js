import React from 'react';
import {findDOMNode} from 'react-dom';
import {Input} from 'react-text-input';

const {any, arrayOf, string, bool, oneOfType, instanceOf, func} = React.PropTypes;

const
  HIGHLIGHT_CLASS = 'tag-highlight',
  NO_TRANSITION_CLASS = 'no-transition';

export class TagInput extends React.Component {

  static propTypes = {
    tags: arrayOf(string),
    name: string,
    disabled: bool,
    delimiter: oneOfType([instanceOf(RegExp), string]),
    className: any,
    onInputChange: func,
    onTagsChange: func
  };
  static defaultProps = {
    tags: [],
    disabled: false,
    delimiter: /\s+/,
    onInputChange: tag => {},
    onTagsChange: tags => {}
  };

  state = {
    enteredTag: '',
    focused: false
  };

  onInputChange = e => {
    let value = e.target.value;
    this.setEnteredTag(value);
    this.props.onInputChange(value);
  };

  onInputFocus = e => this.setState({focused: true});

  onInputBlur = e => this.setState({focused: false});

  /**
   * Get current value of text input.
   *
   * @method
   * @name TagInput#getEnteredTag
   * @return {String}
   */
  getEnteredTag () {
    return this.state.enteredTag;
  }

  /**
   * Set user-entered tag.
   *
   * Tag parsing rules are applied here: if given value matches multi-tag
   * string it is splitted and all result tags except last are added to
   * backing value via accessor. Last tag is set as `enteredTag`, so user
   * can proceed editing it.
   *
   * @method
   * @name TagInput#setEnteredTag
   * @param {String} tag user-typed value.
   */
  setEnteredTag (tag) {
    let tags;
    if (this.props.delimiter == null) {
      // No delimiter = no splitting.
      tags = [tag];
    } else {
      tags = tag.split(this.props.delimiter);
    }
    if (tags.length > 1) {
      tag = tags.pop();
      this.saveTags(...tags);
    }
    this.setState({enteredTag: tag});
  }

  /**
   * Add new tags to list of tags.
   *
   * Tags added only if they are unique.
   *
   * @method
   * @name TagInput#saveTags
   * @param {...String} tags Tags to add.
   */
  saveTags (...tags) {
    //let state = compact(this.props.tags);
    let state = this.props.tags;

    // Separate tags that exist and already rendered.
    let part0 = [],
        part1 = [];

    for (let tag of tags) {
      if (state.indexOf(tag) < 0) {
        part0.push(tag);
      } else {
        part1.push(tag);
      }
    }
    this.highlight(...part0);
    if (part1.length) {
      this.props.onTagsChange(state.concat(part1));
    }
  }

  /**
   * Temporarily highlights tags if rendered.
   *
   * @method
   * @name TagInput#highlight
   * @param {...String} tags Tags to highlight.
   */
  highlight (...tags) {
    tags.forEach(tag => {
      let el = this.refs[tag];
      if (el.classList.contains(HIGHLIGHT_CLASS)) {
        return; // Tag is already highlighted.
      }
      el.classList.add(HIGHLIGHT_CLASS);
      setTimeout(() => el.classList.remove(HIGHLIGHT_CLASS), 600);
    });
  }

  /**
   * Remove tags from tag input.
   *
   * @method
   * @name TagInput#removeTags
   * @param {...String} tags Tags to remove.
   */
  removeTags (...tags) {
    let update = this.props.tags.filter(tag => tags.indexOf(tag) < 0);
    equality: if (update.length == tags.length) {
      for (let i = 0; i < tags.length; ++i) {
        if (update[i] != tags[i]) {
          break equality;
        }
      }
    }
    this.props.onTagsChange(update);
  }

  onTagDeleteClick (e, tag) {
    if (this.props.disabled) {
      return;
    }
    this.removeTags(tag);
  }

  onInputKeyDown (e, tags) {
    if (this.props.disabled) {
      return;
    }
    switch (e.keyCode) {
      case 33: // PgUp
        // Prevent page scrolling.
        e.preventDefault();
        if (tags.length) {
          this.refs[tags[0]].focus();
        }
        break;
      case 8 : // Backspace
      case 37: // Left
        // Only if cursor is in the most leftward position.
        if (tags.length && e.target.selectionEnd == 0) {
          // Prevent `Return to Previous Page` action in IE.
          e.preventDefault();
          this.refs[tags[tags.length - 1]].focus();
        }
        break;
      case 13: // Enter
        e.preventDefault();
        var tag = this.state.enteredTag;
        this.setState({enteredTag: ''}, () => this.saveTags(tag));
        break;
    }
  }

  onTagKeyDown (e, tags, i) {
    if (this.props.disabled) {
      return;
    }
    if (/3[7945368]|8|4[06]/.test(e.keyCode)) {
      // Prevent page scrolling.
      e.preventDefault();
    }
    let input = findDOMNode(this.refs.input);
    switch (e.keyCode) {
      case 37: // Left
        if (i > 0) {
          this.refs[tags[i - 1]].focus();
        }
        break;
      case 39: // Right
        if (i < tags.length - 1) {
          this.refs[tags[i + 1]].focus();
        } else {
          input.focus();
        }
        break;
      case 34: // PgDn
      case 35: // End
      case 40: // Down
        input.focus();
        break;
      case 33: // PgUp
      case 36: // Home
      case 38: // Up
        this.refs[tags[0]].focus();
        break;
      case 8: // Backspace
        if (i > 0) {
          this.removeTags(tags[i - 1]);
        }
        break;
      case 46: // Delete
        if (i < tags.length - 1) {
          this.refs[tags[i + 1]].focus();
        } else {
          input.focus();
        }
        this.removeTags(tags[i]);
        break;
    }
  }

  componentDidMount() {
    let el = findDOMNode(this),
        input = findDOMNode(this.refs.input);
    el.addEventListener('focus', e => input.focus());
    //el.addEventListener('focus', e => {
    //  let tag = e.target;
    //  if (values(this.refs).includes(tag)) {
    //    tag.classList.add(NO_TRANSITION_CLASS);
    //  }
    //}, true);
    //el.addEventListener('blur', e => {
    //  let tag = e.target;
    //  if (values(this.refs).includes(tag)) {
    //    setTimeout(() => tag.classList.remove(NO_TRANSITION_CLASS), 0);
    //  }
    //}, true);
  }

  onControlMouseDown = e => {
    // In IE user can accidentally focus placeholder.
    if (!/input/i.test(e.target.tagName)) {
      e.preventDefault();
      findDOMNode(this.refs.input).focus();
    }
  };

  render() {
    let {tags, name, placeholder, disabled, className, children, delimiter, ...props} = this.props;

    let distinctTags = [];
    for (let tag of tags) {
      if (distinctTags.indexOf(tag) < 0) {
        distinctTags.push(tag);
      }
    }
    if (tags.length) {
      // Use placeholder only if no tags were added yet.
      placeholder = '';
    }
    let classNames = ['tag-input'];
    if (className) {
      classNames = classNames.concat(className);
    }
    if (disabled) {
      classNames.push('disabled');
    }
    if (this.state.focused) {
      classNames.push('focused');
    }
    return (
      <div {...props}
           className={classNames.join(' ')}
           onMouseDown={this.onControlMouseDown}
           tabIndex="-1">
        <div className="tags">
          {tags.map((tag, i) => {
            if (name) {
              var hiddenPost = <input type="hidden" name={name} value={tag}/>;
            }
            return (
              <div key={tag}
                   ref={tag}
                   className="tag"
                   tabIndex="-1"
                   onKeyDown={e => this.onTagKeyDown(e, tags, i)}>
                {hiddenPost}
                <div className="tag-content">{tag}</div>
                <span className="action-group qux">
                  <a className="action">
                    <i className="fa fa-times-circle"/>
                  </a>
                </span>
                <span className="action-group">
                  <a className="action"
                     onMouseDown={this.preventDefault}
                     onClick={e => this.onTagDeleteClick(e, tag)}>
                    <i className="fa fa-times-circle"/>
                  </a>
                </span>
              </div>
            );
          })}
          <Input ref="input"
                 value={this.getEnteredTag()}
                 disabled={disabled}
                 className="inner-input"
                 fitLineLength={true}
                 placeholder={placeholder}
                 onFocus={this.onInputFocus}
                 onBlur={this.onInputBlur}
                 onKeyDown={e => this.onInputKeyDown(e, tags)}
                 onChange={this.onInputChange}/>
        </div>
      </div>
    );
  }
}
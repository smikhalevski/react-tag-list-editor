import React from 'react';
import {findDOMNode} from 'react-dom';
import {Input} from 'react-text-input/src/main/Input';

const {any, array, string, bool, oneOfType, instanceOf, func} = React.PropTypes;

export class TagListEditor extends React.Component {

  static propTypes = {
    tags: array,
    disabled: bool,
    delimiter: oneOfType([instanceOf(RegExp), string]),
    renderTag: func,
    className: any,
    onInputChange: func,
    onTagAdd: func,
    onTagDelete: func
  };
  static defaultProps = {
    tags: [],
    disabled: false,
    delimiter: /\s+/,
    renderTag: tag => tag,
    onInputChange: (value, tagListEditor) => {},
    onTagAdd: (value, tagListEditor) => {},
    onTagDelete: (tag, tagListEditor) => {}
  };

  state = {
    value: '',
    focused: false
  };

  _tagElements = [];

  /**
   * Get current value of text input.
   *
   * @method
   * @name TagListEditor#getValue
   * @return {String}
   */
  getValue() {
    return this.state.value;
  }

  /**
   * Set value edited in tag input.
   *
   * Tag parsing rules are applied here: if given value matches multi-tag
   * string it is splitted and all result tags except last are added to
   * backing value via accessor. Last tag is set as `value`, so user
   * can proceed editing it.
   *
   * @method
   * @name TagListEditor#setValue
   * @param {String} value user-typed value.
   */
  setValue(value) {
    const {delimiter, onTagAdd} = this.props;
    if (delimiter) {
      const values = value.split(delimiter);
      if (values.length > 1) {
        value = values.pop();
        for (const value of values) {
          onTagAdd(value, this);
        }
      }
    }
    this.setState({value});
  }

  /**
   * Get tag element by tag object.
   * @param {*} tag
   * @returns {HTMLDivElement}
   */
  getTagElement(tag) {
    return this._tagElements[this.props.tags.indexOf(tag)];
  }

  _handleInputChange = e => {
    const {value} = e.target;
    if (this.props.onInputChange(value, this) === false) {
      return; // Input change prevented.
    }
    this.setValue(value);
  };

  _handleInputFocus = e => this.setState({focused: true});

  _handleInputBlur = e => this.setState({focused: false});

  _handleInputKeyDown = e => {
    const {tags, disabled, onTagAdd} = this.props;

    if (disabled) {
      return;
    }
    switch (e.keyCode) {
      case 33: // PgUp
        // Prevent page scrolling.
        e.preventDefault();
        if (tags.length) {
          this._tagElements[0].focus();
        }
        break;
      case 8 : // Backspace
      case 37: // Left
        // Only if cursor is in the most leftward position.
        if (tags.length && e.target.selectionEnd == 0) {
          // Prevent return to previous page action in IE.
          e.preventDefault();
          this._tagElements[tags.length - 1].focus();
        }
        break;
      case 13: // Enter
        e.preventDefault();
        const {value} = this.state;
        if (onTagAdd(value, this) === false) {
          break; // Tag addition was rejected.
        }
        this.setState({value: ''});
        break;
    }
  };

  _handleTagKeyDown(e, i) {
    const {tags, disabled, onTagDelete} = this.props;

    if (disabled) {
      return;
    }
    const input = findDOMNode(this.refs.input);
    switch (e.keyCode) {
      case 37: // Left
        e.preventDefault();
        if (i > 0) {
          this._tagElements[i - 1].focus();
        }
        break;
      case 39: // Right
        e.preventDefault();
        if (i < tags.length - 1) {
          this._tagElements[i + 1].focus();
        } else {
          input.focus();
        }
        break;
      case 34: // PgDn
      case 35: // End
      case 40: // Down
        e.preventDefault();
        input.focus();
        break;
      case 33: // PgUp
      case 36: // Home
      case 38: // Up
        e.preventDefault();
        this._tagElements[0].focus();
        break;
      case 8: // Backspace
        e.preventDefault();
        if (i > 0) {
          if (onTagDelete(tags[i - 1], this) === false) {
            break;
          }
          this._tagElements[i - 1].focus();
        }
        break;
      case 46: // Delete
        e.preventDefault();
        if (onTagDelete(tags[i], this) === false) {
          break; // Tag delete was rejected.
        }
        if (i < tags.length - 1) {
          this._tagElements[i + 1].focus();
        } else {
          input.focus();
        }
        break;
    }
  }

  componentDidMount() {
    let el = findDOMNode(this),
        input = findDOMNode(this.refs.input);
    el.addEventListener('focus', e => input.focus());
    el.addEventListener('focus', e => {
      if (this._tagElements.indexOf(e.target) > -1) {
        e.target.classList.add('tag-list__item--focus');
      }
    }, true);
    el.addEventListener('blur', e => {
      if (this._tagElements.indexOf(e.target) > -1) {
        setTimeout(() => e.target.classList.remove('tag-list__item--focus'), 5);
      }
    }, true);
  }

  render() {
    const {tags, renderTag, placeholder, disabled, className} = this.props;

    this._tagElements.length = tags.length;

    let classNames = ['tag-list-editor'];
    if (className) {
      classNames = classNames.concat(className);
    }
    if (disabled) {
      classNames.push('tag-list-editor--disabled');
    }
    if (this.state.focused) {
      classNames.push('tag-list-editor--focus');
    }
    return (
      <div className={classNames.join(' ')}
           tabIndex="-1">
        <div className="tag-list">
          {tags.map((tag, i) =>
            <div key={i}
                 ref={ref => this._tagElements[i] = findDOMNode(ref)}
                 className="tag-list__item"
                 tabIndex="-1"
                 onKeyDown={e => this._handleTagKeyDown(e, i)}>
              {renderTag(tag)}
            </div>
          )}
          <Input ref="input"
                 value={this.state.value}
                 disabled={disabled}
                 className="tag-list-editor__input"
                 fitLineLength={true}
                 placeholder={tags.length ? '' : placeholder}
                 onFocus={this._handleInputFocus}
                 onBlur={this._handleInputBlur}
                 onKeyDown={this._handleInputKeyDown}
                 onChange={this._handleInputChange}/>
        </div>
      </div>
    );
  }
}

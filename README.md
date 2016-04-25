# React Tag List Editor

[![npm version](https://badge.fury.io/js/react-tag-list-editor.svg)](https://www.npmjs.com/package/react-tag-list-editor)

[**Live Demo**](http://smikhalevski.github.io/react-tag-list-editor/)

## Usage

```jsx
var TagListEditor = require('react-tag-list-editor').TagListEditor; // ES5

import {TagListEditor} from 'react-tag-list-editor'; // ES6

<TagListEditor tags={['foo', 'bar']}
               onInputChange={editedTag => console.log(editedTag)}
               onTagsChange={tags => console.log(tags)}/>
```

## License

The code is available under [MIT licence](LICENSE.txt).

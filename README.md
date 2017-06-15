# react-input-completion

[![Greenkeeper badge](https://badges.greenkeeper.io/ianmcnally/react-input-completion.svg)](https://greenkeeper.io/)
A cross-browser autocomplete component for React.

`<InputCompletion>` defaults to the native HTML5 `<datalist>` (unless you prefer it didn't) and polyfills any unsupported browsers, with no external dependencies.

[![Build Status](https://travis-ci.org/ianmcnally/react-input-completion.svg?branch=master)](https://travis-ci.org/imcnally/react-input-completion)

## Usage

`<InputCompletion>` wraps an input, and connects it to a list of `options`.

### Installation

`npm install --save react-input-completion`

### Example

```jsx
  // in your component's render function
  var browsers = ['Chrome', 'Firefox', 'IE', 'Safari'];
  var onChange = this.onChange.bind(this);

  <InputCompletion options={browsers} name="browsers" onValueChange={onChange}>
    <input placeholder="Enter your browser name" />
  </InputCompletion>
```

### Props
  `onValueChange` - Callback function for when input value changes. Arguments: DOMEvent, value.

  `options` - Array of suggestions to present to the user. They can be updated at any time.

  `name` -  Unique identifier for the list

  `useNative` - Boolean (optional) to use native HTML5 `<datalist>` if possible. Default: `true`.

### Styles
Default styles (for fallback to match native
) are available in react-input-completion.css.

## Development

### Installation

1. `npm i` - Installs dependencies

### Developing

1. `npm start` - Compiles code, starts web server and demo page at [localhost:3000](http://localhost:3000).

### Testing

1. `npm run test` - Runs tests, and re-runs on file changes.

## Deployment

1. `npm publish` - Compiles code and publishes to npm.

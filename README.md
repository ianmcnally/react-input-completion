# react-input-completion
A cross-browser autocomplete component for React. `<InputCompletion>` defaults to the native `<datalist>` and polyfills any unsupported browsers.

## Usage:

`<InputCompletion>` wraps an input, and connects it to a list of `options`.

Props:
  `onValueChange` - Callback function for when input value changes. Arguments: DOMEvent, value.
  `options` - Array of suggestions to present to the user
  `name` -  Unique identifier for the list

```jsx
  <InputCompletion options={} name=''>
    <input />
  </InputCompletion>
```

## Development

### Installation

1. `npm i` - Installs dependencies

### Developing

1. `npm start` - Compiles code, starts web server at localhost:3000.

### Testing

1. `npm run test` - Runs tests, and re-runs on file changes.

## Deployment

1. `npm publish` - Compiles code and publishes to npm.

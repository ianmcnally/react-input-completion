# react-input-completion
A cross-browser autocomplete component for React.

`<InputCompletion>` defaults to the native `<datalist>` and polyfills any unsupported browsers, with no external dependencies.

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

import {
  addons,
  Children,
  cloneElement,
  Component,
  findDOMNode,
  render,
  PropTypes
} from 'react'
import cx from 'classnames'

const keys = {
  down: 'ArrowDown',
  enter: 'Enter',
  up: 'ArrowUp'
}

export default class InputCompletion extends Component {

  constructor (props) {
    super(props)

    this.state = {
      inputWidth: null, // fallback only
      selectedSuggestion: 0, // fallback only
      showSuggestions: false, // fallback only
      shownOptions: [], // fallback only
      nativeSupport: this._supportsNative(),
      options: props.options, // options can be updated
      value: ''
    }
  }

  componentDidMount () {
    if (this.state.nativeSupport) { return }

    let inputWidth = findDOMNode(this.refs.input).offsetWidth + 'px'

    this.setState({inputWidth})
  }

  _supportsNative () {
    let feature = document.createElement('datalist')

    return Boolean(feature && feature.options)
  }

  _isOptionShown (input, option) {
    let optionRegex = new RegExp(input, 'gi')
    let optionMatchesInput = input && option.match(optionRegex)

    return this.state.showSuggestions && optionMatchesInput
  }

  _renderFallbackOptions () {
    let options = this.state.shownOptions.map((option, index) => {
      let isSelected = index === this.state.selectedSuggestion
      let classNames = cx({
        'lookahead__option': true,
        'lookahead__option--selected': isSelected
      })
      let onClick = this.onFallbackOptionClick.bind(this, option)

      return (
        <li className={classNames} aria-selected={isSelected} key={index} onMouseDown={onClick} role='option'>
          {option}
        </li>
      )
    })

    let classNames = cx({
      'lookahead__fallback-options': true,
      'lookahead__fallback-options--shown': this.state.showSuggestions && this.state.value
    })

    return (
      <ul aria-multiselectable='false' className={classNames} role='listbox' style={{width: this.state.inputWidth}}>
        {options}
      </ul>
    )
  }

  _renderOptions () {
    if (!this.state.nativeSupport) {
      return this._renderFallbackOptions()
    }

    let options = this.state.options.map((option, index) => {
      return <option key={index} value={option} />
    })

    return (
      <datalist id={this.props.name}>
        {options}
      </datalist>
    )
  }

  _renderChildren () {
    let child = Children.only(this.props.children)
    let props = {
      list: this.props.name,
      onBlur: this.onBlur.bind(this),
      onChange: this.onChange.bind(this),
      ref: 'input',
      value: this.state.value
    }

    if (!this.state.nativeSupport) {
      props.onKeyDown = this.onKeyDown.bind(this)
    }

    return cloneElement(child, props)
  }

  onKeyDown (event) {
    const { key } = event
    const { selectedSuggestion, shownOptions } = this.state;
    let nextIndex = selectedSuggestion;

    switch (key) {
      case keys.down:
        let maxIndex = shownOptions.length - 1
        nextIndex = (selectedSuggestion === maxIndex) ? maxIndex : selectedSuggestion + 1
        break;
      case keys.up:
        nextIndex = (selectedSuggestion <= 0) ? 0 : selectedSuggestion - 1
        break;
      case keys.enter:
        this.onFallbackOptionClick(shownOptions[selectedSuggestion])
        break;
      default:
        return;
    }

    this.setState({selectedSuggestion: nextIndex})

  }

  onFallbackOptionClick (option) {
    this.setState({showSuggestions: false, value: option})
  }

  onBlur () {
    this.setState({showSuggestions: false})
  }

  onChange (event) {
    let { value } = event.target
    let newState = {selectedSuggestion: 0, value}

    if (!this.state.nativeSupport) {
      newState.showSuggestions = true
      newState.shownOptions = this.state.options.filter((option) => this._isOptionShown(value, option))
    }

    this.setState(newState)
  }

  render () {
    return (
      <section className='lookahead'>
        {this._renderChildren()}
        {this._renderOptions()}
      </section>
    )
  }

}

InputCompletion.propTypes = {
  name: PropTypes.string.isRequired
}

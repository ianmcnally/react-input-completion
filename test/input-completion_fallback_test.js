import InputCompletion from '../src/input-completion.jsx'
import React, { addons } from 'react/addons'
const {
  findRenderedDOMComponentWithTag,
  renderIntoDocument,
  scryRenderedDOMComponentsWithTag,
  Simulate
} = addons.TestUtils
const { match, stub } = sinon

describe('InputCompletion with fallback', () => {
  let props, component

  beforeEach(() => {
    props = {
      onValueChange: stub(),
      options : ['First', 'Second', 'Chrome', 'Bill Murray'],
      name : 'numbers'
    }

    stub(InputCompletion.prototype, '_supportsNative').returns(false)

    component = renderIntoDocument(
      <InputCompletion {...props}>
        <input />
      </InputCompletion>
    )
  })

  afterEach(() => {
    InputCompletion.prototype._supportsNative.restore()
  })

  it('does not render a <datalist> or <option>', () => {
    const datalist = scryRenderedDOMComponentsWithTag(component, 'datalist')
    const options = scryRenderedDOMComponentsWithTag(component, 'option')

    expect(datalist).to.be.empty
    expect(options).to.be.empty
  })

  context('initialization', () => {
    let component, inputWidth

    beforeEach(() => {
      inputWidth = 150
      stub(React, 'findDOMNode').returns({offsetWidth: inputWidth})

      component = renderIntoDocument(
        <InputCompletion {...props}>
          <input />
        </InputCompletion>
      )
    })

    afterEach(() => {
      React.findDOMNode.restore()
    })

    it('initializes state variables for the fallback', () => {
      expect(component.state).to.include({
        inputWidth: `${inputWidth}px`,
        selectedSuggestion: 0,
        showSuggestions: false
      })
      // strict equality doesn't work for arrays
      expect(component.state).to.have.property('shownOptions').that.is.an('array')
    })

  })

  context('rendering', () => {
    it('renders a <ul> to hold the options', () => {
      const ul = findRenderedDOMComponentWithTag(component, 'ul')

      expect(ul).to.be.ok
    })

    it('sets a inline style of state.inputWidth on the container', () => {
      const ul = findRenderedDOMComponentWithTag(component, 'ul')

      expect(ul.props.style).to.include({width: component.state.inputWidth})
    })

    it('sets aria attributes on the container', () => {
      const ul = findRenderedDOMComponentWithTag(component, 'ul')

      expect(ul.props['aria-multiselectable']).to.equal('false')
      expect(ul.props.role).to.equal('listbox')
    })

  })

  context('on input', () => {
    let input

    beforeEach(() => {
      input = findRenderedDOMComponentWithTag(component, 'input')
    })

    it('updates the input value on input change', () => {
      const value = '40 Thoughts We All Had The Night Before The First Day Of School'

      Simulate.change(input, {target: {value}})

      expect(component.state.value).to.equal(value)
    })

    it('calls props.onValueChange on input change', () => {
      const value = 'sup victor'
      const input = findRenderedDOMComponentWithTag(component, 'input')

      Simulate.change(input, { target: {value} })

      expect(props.onValueChange).to.have.been.calledWith(match.object, value)
    })

    it('resets the selected option on input change', () => {
      component.state.selectedSuggestion = 1

      Simulate.change(input)

      expect(component.state.selectedSuggestion).to.equal(0)
    })

    it('shows options based on matching the input text', () => {
      const value = 'bill'

      Simulate.change(input, {target: {value}})
      const optionsContainer = findRenderedDOMComponentWithTag(component, 'ul')
      const options = scryRenderedDOMComponentsWithTag(component, 'li')

      expect(optionsContainer.props.style).to.include({display: 'block'})
      expect(options).to.be.ok
      expect(options).to.have.length(1)
      expect(options).to.have.deep.property('[0].props.children', 'Bill Murray')
    })

    it('doesnt show any options if value does not match any option', () => {
      const value = ''

      Simulate.change(input, {target: {value}})
      const optionsContainer = findRenderedDOMComponentWithTag(component, 'ul')
      const options = scryRenderedDOMComponentsWithTag(component, 'li')

      expect(optionsContainer.props.style).to.include({display: 'none'})
      expect(options).to.be.empty
    })
  })

  context('options', () => {
    let input, option, optionValue

    beforeEach(() => {
      const value = 'i' // will match First & Bill Murray

      input = findRenderedDOMComponentWithTag(component, 'input')
      Simulate.change(input, {target: {value}})

      option = scryRenderedDOMComponentsWithTag(component, 'li')[1]
      optionValue = 'Bill Murray'
    })

    afterEach(() => {
      component.setState({selectedSuggestion: 0})
    })

    it('sets aria attributes on an option', () => {
      expect(option.props.role).to.equal('option')
    })

    it('updates the input value to option.value on option mouseDown', () => {
      expect(input.props.value).not.to.equal(optionValue)

      Simulate.mouseDown(option)

      expect(input.props.value).to.equal(optionValue)
    })

    it('updates the input value to option.value on option Enter press', () => {
      expect(input.props.value).not.to.equal(optionValue)

      Simulate.keyDown(input, {key: 'ArrowDown'})
      Simulate.keyDown(input, {key: 'Enter'})

      expect(input.props.value).to.equal(optionValue)
    })

    it('hides options on option click', () => {
      const optionsContainer = findRenderedDOMComponentWithTag(component, 'ul')

      expect(optionsContainer.props.style).to.include({display: 'block'})

      Simulate.keyDown(input, {key: 'ArrowDown'})
      Simulate.mouseDown(option)

      expect(optionsContainer.props.style).to.include({display: 'none'})
    })

    it('hides options on input blur', () => {
      const optionsContainer = findRenderedDOMComponentWithTag(component, 'ul')

      expect(optionsContainer.props.style).to.include({display: 'block'})

      Simulate.blur(input)

      expect(optionsContainer.props.style).to.include({display: 'none'})
    })

    it('sets a selected attribute when the option is selected', () => {
      expect(option.props['aria-selected']).to.be.false

      Simulate.keyDown(input, {key: 'ArrowDown'})

      expect(option.props['aria-selected']).to.be.true
    })

    it('increases the selected option on down arrow press', () => {
      const currentSelection = component.state.selectedSuggestion

      Simulate.keyDown(input, {key: 'ArrowDown'})

      expect(component.state.selectedSuggestion).to.equal(currentSelection + 1)
    })

    it('stops increasing if down arrow is pressed but it is at the end of the options', () => {
      Simulate.keyDown(input, {key: 'ArrowDown'})
      Simulate.keyDown(input, {key: 'ArrowDown'})
      Simulate.keyDown(input, {key: 'ArrowDown'})
      Simulate.keyDown(input, {key: 'ArrowDown'})

      expect(component.state.selectedSuggestion).to.equal(1)
    })

    it('decreases the selected option on up arrow press', () => {
      Simulate.keyDown(input, {key: 'ArrowDown'})
      expect(component.state.selectedSuggestion).to.equal(1)

      Simulate.keyDown(input, {key: 'ArrowUp'})

      expect(component.state.selectedSuggestion).to.equal(0)
    })

    it('stops decreasing if up arrow is pressed but it is at the beginning of the options', () => {
      Simulate.keyDown(input, {key: 'ArrowDown'})
      expect(component.state.selectedSuggestion).to.equal(1)

      Simulate.keyDown(input, {key: 'ArrowUp'})
      Simulate.keyDown(input, {key: 'ArrowUp'})
      Simulate.keyDown(input, {key: 'ArrowUp'})
      Simulate.keyDown(input, {key: 'ArrowUp'})

      expect(component.state.selectedSuggestion).to.equal(0)
    })

  })

})
import InputCompletion from '../src/input-completion.jsx'
import React, { addons } from 'react/addons'
const {
  findRenderedDOMComponentWithTag,
  renderIntoDocument,
  scryRenderedDOMComponentsWithTag,
  Simulate
} = addons.TestUtils
const { stub } = sinon

describe('InputCompletion with fallback', () => {
  let props, component

  beforeEach(() => {
    props = {
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
    let datalist = scryRenderedDOMComponentsWithTag(component, 'datalist')
    let options = scryRenderedDOMComponentsWithTag(component, 'option')

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
      let ul = findRenderedDOMComponentWithTag(component, 'ul')

      expect(ul).to.be.ok
    })

    it('sets a inline style of state.inputWidth on the container', () => {
      let ul = findRenderedDOMComponentWithTag(component, 'ul')

      expect(ul.props.style).to.include({width: component.state.inputWidth})
    })

    it('sets aria attributes on the container', () => {
      let ul = findRenderedDOMComponentWithTag(component, 'ul')

      expect(ul.props['aria-multiselectable']).to.equal('false')
      expect(ul.props.role).to.equal('listbox')
    })

  })

  context('on input', () => {
    let input, options

    beforeEach(() => {
      input = findRenderedDOMComponentWithTag(component, 'input')
    })

    it('updates the input value on input change', () => {
      let value = '40 Thoughts We All Had The Night Before The First Day Of School'

      Simulate.change(input, {target: {value}})

      expect(component.state.value).to.equal(value)
    })

    it('resets the selected option on input change', () => {
      component.state.selectedSuggestion = 1

      Simulate.change(input)

      expect(component.state.selectedSuggestion).to.equal(0)
    })

    it('shows options based on matching the input text', () => {
      let value = 'bill'

      Simulate.change(input, {target: {value}})
      let options = scryRenderedDOMComponentsWithTag(component, 'li')

      expect(options).to.be.ok
      expect(options).to.have.length(1)
      expect(options).to.have.deep.property('[0].props.children', 'Bill Murray')
    })

    it('doesnt show any options if value does not match any option', () => {
      let value = 'TDK'

      Simulate.change(input, {target: {value}})
      let options = scryRenderedDOMComponentsWithTag(component, 'li')

      expect(options).to.be.empty
    })
  })

  context('options', () => {
    it('updates the input value to option.value on option click')
    it('hides options on option click')

    it('hides options on input blur')

    it('sets a selected class when the option is selected')

    it('increases the selected option on down arrow press')

    it('stops increasing if down arrow is pressed but it is at the end of the options')

    it('decreases the selected option on up arrow press')

    it('stops decreasing if up arrow is pressed but it is at the beginning of the options')
    it('sets aria attributes on an option')
  })

})
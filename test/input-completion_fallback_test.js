import InputCompletion from '../src/input-completion.jsx'
import React, { addons } from 'react/addons'
const {
  renderIntoDocument,
  scryRenderedDOMComponentsWithTag
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
    it('renders a <ul> to hold the options')

    it('renders an <li> for each option')

    it('sets a inline style of state.inputWidth on the container')

    it('sets aria attributes on the container')

    it('sets aria attributes on an option')
  })

  context('on input', () => {
    it('updates the input value to option.value on option click')
    it('sets options based on matching the input text')
    it('updates the input value on input change')
    it('resets the selected option on input change')
    it('shows options on input change')
    it('doesnt show any options if value does not match any option')
  })

  context('options', () => {
    it('hides options on option click')

    it('hides options on input blur')

    it('sets a selected class when the option is selected')

    it('increases the selected option on down arrow press')

    it('stops increasing if down arrow is pressed but it is at the end of the options')

    it('decreases the selected option on up arrow press')

    it('stops decreasing if up arrow is pressed but it is at the beginning of the options')
  })

})
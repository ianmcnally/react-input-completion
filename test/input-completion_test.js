import InputCompletion from '../src/input-completion.jsx'
import React, { addons } from 'react/addons'
const {
  findRenderedDOMComponentWithTag,
  Simulate,
  renderIntoDocument
} = addons.TestUtils
const { stub } = sinon

describe('InputCompletion', () => {

  it('sets the correct default props', () => {
    expect(InputCompletion.defaultProps).to.include({
      useNative: true
    })
  })

  context('browser support', () => {

    beforeEach(() => {
      stub(document, 'createElement')
    })

    afterEach(() => {
      document.createElement.restore()
    })

    it('returns true if the browser creates a <datalist> with `options`', () => {
      document.createElement.returns({options : []})

      expect(InputCompletion.prototype._supportsNative()).to.be.true
    })

    it('returns false if the browser creates a <datalist> without `options`', () => {
      document.createElement.returns({options : undefined})

      expect(InputCompletion.prototype._supportsNative()).to.be.false
    })

    it('returns false if the browser returns a falsy created element', () => {
      document.createElement.returns(undefined)

      expect(InputCompletion.prototype._supportsNative()).to.be.false
    })

  })

  context('rendered component', () => {
    let component, props

    beforeEach(() => {
      props = {
        options : ['First', 'Second', 'Chrome', 'Bill Murray'],
        name : 'numbers'
      }
      component = renderIntoDocument(
        <InputCompletion {...props}>
          <input />
        </InputCompletion>
      )
    })

    it('renders the input passed in as a child', () => {
      let input = findRenderedDOMComponentWithTag(component, 'input')

      expect(input).to.be.ok
    })

    it('adds the correct properties to the child', () => {
      let input = findRenderedDOMComponentWithTag(component, 'input')

      const { list, onBlur, onChange, value } = input.props

      expect(list).to.equal(props.name)
      expect(onChange).to.be.a('function')
      expect(value).to.equal(component.state.value)
      expect(component.refs.input).to.equal(input)
    })

    it('updates the state on input change', () => {
      let value = 'sup victor'
      let input = findRenderedDOMComponentWithTag(component, 'input')

      Simulate.change(input, { target: {value} })

      expect(component.state.value).to.equal(value)
    })

  })

})

import InputCompletion from '../src/input-completion.jsx'
import React, { addons } from 'react/addons'
const {
  findRenderedDOMComponentWithTag,
  renderIntoDocument,
  scryRenderedDOMComponentsWithTag,
  Simulate
} = addons.TestUtils
const { stub } = sinon

describe('InputCompletion', () => {

  context('determining native support', () => {

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

  context('native', () => {
    let component, props

    beforeEach(() => {
      props = {
        options : ['First', 'Second', 'Chrome', 'Bill Murray'],
        name : 'numbers'
      }

      stub(InputCompletion.prototype, '_supportsNative').returns(true)

      component = renderIntoDocument(
        <InputCompletion {...props}>
          <input />
        </InputCompletion>
      )
    })

    afterEach(() => {
      InputCompletion.prototype._supportsNative.restore()
    })

    it('sets props.options on state', () => {
      expect(component.state.options).to.equal(props.options)
    }) 

    it('renders the input passed in as a child', () => {
      let input = findRenderedDOMComponentWithTag(component, 'input')

      expect(input).to.be.ok
    })

    it('adds the correct properties to the child', () => {
      let input = findRenderedDOMComponentWithTag(component, 'input')

      const { list, onBlur, onChange, value } = input.props

      expect(list).to.equal(props.name)
      expect(onBlur).to.be.a('function')
      expect(onChange).to.be.a('function')
      expect(value).to.equal(component.state.value)
      expect(component.refs.input).to.equal(input)
    })

    it('creates a datalist with an id of props.name', () => {
      let datalist = findRenderedDOMComponentWithTag(component, 'datalist')

      expect(datalist).to.be.ok
      expect(datalist.props.id).to.equal(props.name)
    })

    it('creates an <option> for each prop.options', () => {
      let optionElements = scryRenderedDOMComponentsWithTag(component, 'option')

      expect(optionElements).to.have.length(props.options.length)
    })

    it('sets a value for each option', () => {
      let index = 0
      let optionElements = scryRenderedDOMComponentsWithTag(component, 'option')
      let optionElement = optionElements[index]

      expect(optionElement.props.value).to.equal(props.options[index])
    })

    it('updates the state on input change', () => {
      let value = 'sup victor'
      let input = findRenderedDOMComponentWithTag(component, 'input')

      Simulate.change(input, { target: {value} })

      expect(component.state.value).to.equal(value)
    })

  })

})

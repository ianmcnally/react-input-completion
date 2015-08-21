import InputCompletion from '../src/input-completion.jsx'
import { addons } from 'react/addons'
const {
  findRenderedDOMComponentWithTag,
  renderIntoDocument,
  scryRenderedDOMComponentsWithTag,
  Simulate
} = addons.TestUtils
const { expect } = chai
const { match, stub } = sinon

describe('InputCompletion with native support', () => {
  let component, props

  beforeEach(() => {
    props = {
      onValueChange: stub(),
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

  it('creates a datalist with an id of props.name', () => {
    const datalist = findRenderedDOMComponentWithTag(component, 'datalist')

    expect(datalist).to.be.ok
    expect(datalist.props.id).to.equal(props.name)
  })

  it('creates an <option> for each prop.options', () => {
    const optionElements = scryRenderedDOMComponentsWithTag(component, 'option')

    expect(optionElements).to.have.length(props.options.length)
  })

  it('sets a value for each option', () => {
    const index = 0
    const optionElements = scryRenderedDOMComponentsWithTag(component, 'option')
    const optionElement = optionElements[index]

    expect(optionElement.props.value).to.equal(props.options[index])
  })

  it('does not render the native datalist is props.useNative is false', () => {
    const component = renderIntoDocument(
      <InputCompletion {...props} useNative={false}>
        <input />
      </InputCompletion>
    )

    const datalist = scryRenderedDOMComponentsWithTag(component, 'datalist')
    const fallback = findRenderedDOMComponentWithTag(component, 'ul')

    expect(datalist).to.be.empty
    expect(fallback).to.be.ok
  })

  context('on input', () => {

    it('calls props.onValueChange on input change', () => {
      const value = 'sup victor'
      const input = findRenderedDOMComponentWithTag(component, 'input')

      Simulate.change(input, { target: {value} })

      expect(props.onValueChange).to.have.been.calledWith(match.object, value)
    })

  })


})

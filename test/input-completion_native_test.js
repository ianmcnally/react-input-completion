import InputCompletion from '../src/input-completion.jsx'
import React, { addons } from 'react/addons'
const {
  findRenderedDOMComponentWithTag,
  renderIntoDocument,
  scryRenderedDOMComponentsWithTag
} = addons.TestUtils
const { stub } = sinon

describe('InputCompletion with native support', () => {
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


})

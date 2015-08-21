import React, { Component, render } from 'react'
import InputCompletion from './input-completion.jsx'

class Demo extends Component {

  render () {
    return (
      <InputCompletion name='browsers' options={['Chrome', 'Firefox', 'Internet Explorer']}>
        <input />
      </InputCompletion>
    )
  }

}

render(<Demo />, document.body)
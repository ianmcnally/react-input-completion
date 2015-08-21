import React, { Component, render } from 'react'
import InputCompletion from './input-completion.jsx'

class Demo extends Component {

  constructor (props) {
    super(props)

    this.state = {
      browsers: ['Chrome', 'Firefox', 'Internet Explorer']
    }
  }

  componentDidMount () {
    setTimeout(() => this.setState({browsers: this.state.browsers.concat('Safari')}), 3000)
  }

  render () {
    return (
      <InputCompletion name='browsers' options={this.state.browsers}>
        <input />
      </InputCompletion>
    )
  }

}

render(<Demo />, document.body)
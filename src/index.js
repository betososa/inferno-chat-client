import Inferno, {linkEvent, render} from 'inferno'
import Component from 'inferno-component'
import { connect } from 'inferno-mobx'

import {Socket} from "phoenix"

class Messages extends Component {
  constructor() {
    super();
    this.state = {
      messages: []
    };
    this.socket = new Socket("ws://localhost:4000/socket", {params: {user: 'user'}})
    this.socket.connect()
    // console.log(this.socket)
    this.channel = this.socket.channel('room:lobby', {})
    this.channel.join()
      .receive('ok', resp => { console.log('Joined successfully', resp) })
      .receive('error', resp => { console.log(':(', resp) })
    this.channel.on('new_msg', this.onNewMsg.bind(this))
    this.sendMessage = this.sendMessage.bind(this)
  }

  sendMessage(event) {
    // event.preventDefault()
    if (event.keyCode === 13) {
      this.channel.push('new_msg', { body: event.target.value })
      event.target.value = ''
    }
  }

  onNewMsg(payload) {
    console.log(this.state.messages)
    console.log(payload)
    let newSomething = this.state.messages.concat(payload.body)
    console.log('((((((', newSomething)
    this.setState({
      messages: newSomething
    })
  }

  render() {
    // console.log('--->', this.state.messages)
    return (
      <div>
        <div id="messages">
          {this.state.messages.map((msg, idx) => {
            return (<li key={idx}>{msg}</li>)
          })}
        </div>
        <input id="chat-input" onKeyPress={this.sendMessage} type="text" />
      </div>
    )
  }
}

render(<Messages />, document.getElementById('app'));

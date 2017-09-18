import {action} from 'mobx'

export default class Messages {

  constructor(request, state) {
    this.request = request
    this.state = state
  }

  @action async add(text) {
    this.state.messages.push(text)
  }
}

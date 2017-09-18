import { extendObservable, toJS } from 'mobx'

export default class State {
  constructor(state) {
    extendObservable(this, {
      todos: []
    }, state)
  }
}

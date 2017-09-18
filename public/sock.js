import {Socket, Presence} from "phoenix"

let user = document.getElementById('user').innerText
let socket = new Socket("localhost:4000/socket", {params: {user: user}})

socket.connect()

let presences = {}

let formattedTimestamp = (Ts) => {
  let date = new Date(Ts)
  return date.toLocaleString()
}

let listBy = (user, {metas: metas}) => {
  return {
    user: user,
    onlineAt: formattedTimestamp(metas[0].online_at)
  }
}

let userList = document.getElementById("userList")

let render = (presences) => {
  userList.innerHTML = Presence.list(presences, listBy)
    .map(presence => `
      <li>
        ${presence.user}
        <br />
        <small>Online since ${presence.onlineAt}</small>
      </li>
    `)
    .join("")
}

let room = socket.channel("room:lobby", {})

room.on("presence_state", state => {
  presences = Presence.syncState(presences, state)
  render(presences)
})

room.on("presence_diff", diff => {
  presences = Presence.syncDiff(presences, diff)
  render(presences)
})

room.join()

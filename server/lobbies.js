import { lobby } from "./lobby.js";

  export class InMemoryLobbyStore {
    constructor() {
      this.lobbies = new Map();
    }
  
    joinLobby(id, userId){
        this.lobbies.get(id).users.push(userId)
    }
    createLobby(id, userId) {
      this.lobbies.set(id, new lobby(userId, id) )
    }
  }
  
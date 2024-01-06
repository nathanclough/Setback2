import { StateManager } from "./stateManager.js"
export class lobby {

    users = []
    userMap = {
        "a" : 0,
        "b": 1,
        "c": 2,
        "d": 3
    }
    lobbyId;
    constructor(user, id){
        this.users.push(user)
        this.lobbyId = id
    }

    startGame(){
        this.stateManager = new StateManager()
    }
}
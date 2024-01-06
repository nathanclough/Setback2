import { createServer } from "node:http";
import { Server } from "socket.io";
import { InMemorySessionStore } from "./sessionStore.js";
import * as crypto from "crypto"
import { InMemoryLobbyStore } from "./lobbies.js";

const randomId = () => crypto.randomBytes(8).toString("hex")
const lobbyStore = new InMemoryLobbyStore()
const sessionStore = new InMemorySessionStore()
const buildSubscriptions = (socket, io) => {
    socket.onAny((event, ...args) => { console.log("SERVER:", event, args) })

    socket.on("startLobby", () => {
        // check for 4 people 
        console.log(socket.rooms)
        var lobby = lobbyStore.getLobby(socket)
        // assign teams

        // build game and throw start game event 

    })
    // Subscriptions 
    socket.on("createLobby", (cb) => {
        var lobbyId = `lobby:${randomId()}`
        socket.lobbyId = lobbyId
        lobbyStore.createLobby(lobbyId, socket.userID)
        socket.join(lobbyId)
        io.to(lobbyId).emit("joined")
        cb(lobbyId)
    });

    socket.on("joinLobby", (lobbyId) => {
        if (lobbyId) {
            lobbyStore.joinLobby(lobbyId, socket.userID)
            socket.join(lobbyId)
            console.log(socket.rooms, lobbyId, socket.sessionID, socket.userID,"hello")

            io.to(lobbyId).emit("joined")
        }
    })

    socket.on("disconnect", async () => {
        const matchingSockets = await io.in(socket.userID).allSockets();
        const isDisconnected = matchingSockets.size === 0;
        if (isDisconnected) {
            // notify other users
            socket.broadcast.emit("user disconnected", socket.userID);
            // update the connection status of the session
            sessionStore.saveSession(socket.sessionID, {
                userID: socket.userID,
                username: socket.username,
                connected: false,
            });
        }
    })
}

export const buildIo = (server, setSocket) => {
    const io = new Server(server,
        {
            cors: {
                origin: "http://localhost:5173"
            }
        })
    io.use(async (socket, next) => {
        const sessionID = socket.handshake.auth.sessionID;
        if (sessionID) {
            const session = sessionStore.findSession(sessionID)
            if (session) {
                socket.sessionID = sessionID
                socket.userID = session.userID
                socket.username = session.username
                return next()
            }
        }

        const username = socket.handshake.auth.username;
        if (!username) {
            return next(new Error("invalid username"));
        }
        socket.sessionID = randomId()
        socket.userID = randomId()
        socket.username = username;
        next();
    });

    io.on("connection", (socket) => {
        // Set subscriptions 
        buildSubscriptions(socket, io)

        // Session Management 
        const users = []
        // join the "userID" room - this helps manage same user joining in multiple tabs
        socket.join(socket.userID);
        sessionStore.saveSession(socket.sessionID, {
            userID: socket.userID,
            username: socket.username,
            connected: true,
        });
        sessionStore.findAllSessions().forEach((session) => {
            users.push({
                userID: session.userID,
                username: session.username,
                connected: true,
            })
        })

        // Notifiy others of connection 
        socket.emit("session", {
            sessionID: socket.sessionID,
            userID: socket.userID,
        });
        socket.emit("users", users)
        socket.broadcast.emit("user connected", {
            userID: socket.userID,
            username: socket.username,
            connected: true
        })

        if (setSocket) setSocket(socket)
    })

    return io
}



const httpServer = createServer()
buildIo(httpServer)
httpServer.listen(8080)
console.log("listening on ", httpServer.address())
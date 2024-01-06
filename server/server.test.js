import { createServer } from "node:http";
import { io as ioc } from "socket.io-client";
import { buildIo } from "./index"


function waitFor(socket, event) {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}

describe("Server tests", () => {
  let io, serverSocket, clientSocket,
    clientSocket2, clientSocket3, clientSocket4, port;

  beforeAll((done) => {
    const httpServer = createServer();
    io = buildIo(httpServer, (socket) => {
      serverSocket = socket
    })

    httpServer.listen(() => {
      port = httpServer.address().port;

      var createSocket = (username, cb) => {
        var socket = ioc(`http://localhost:${port}`);
        socket.auth = { username }
        socket.onAny((event, ...args) => { console.log(`CLIENT:${username} `, event, args) })
        socket.on("connect", () => {
          cb(socket)
        })

        socket.on("session", ({sessionID, userID}) => {
          socket.auth = {username, sessionID}
          socket.userID = userID
        })
      }

      createSocket("user1", (socket) => {
        clientSocket = socket
        createSocket("user2", (socket2) => {
          clientSocket2 = socket2
          createSocket("user3", (socket3) => {
            clientSocket3 = socket3
            createSocket("user4", (socket4) => {
              clientSocket4 = socket4
              done()
            })
          })
        })
      })
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.disconnect();
    clientSocket2.disconnect();
    clientSocket3.disconnect();
    clientSocket4.disconnect();
  });

  test("joinLobby", async () => {
    clientSocket2.emit("createLobby", (id) => {
      console.log(id)
      clientSocket.emit("joinLobby", id)
      clientSocket3.emit("joinLobby", id)
      clientSocket4.emit("joinLobby", id)
      
    })
    await waitFor(clientSocket4,"joined")

    // try startLobby
    
  });

});
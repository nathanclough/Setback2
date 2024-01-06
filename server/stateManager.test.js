import { StateManager } from "./stateManager"

test("On init there is a round number and turn number ", () => {
    const manager = new StateManager()
    expect(manager.gameState.roundNumber).toBe(0)
    expect(manager.gameState.turnNumber).toBe(0)
})

test("On init each player has correct amount of cards and deck has correct remaining", () => {
    const manager = new StateManager()
    expect(manager.gameState.currentHands.a.length).toBe(6)
    expect(manager.gameState.currentHands.c.length).toBe(6)
    expect(manager.gameState.currentHands.b.length).toBe(6)
    expect(manager.gameState.currentHands.d.length).toBe(6)
    expect(manager.gameState.kitty.length).toBe(6)
    expect(manager.gameState.deck.length).toBe(24)
}
)
test("On init dealer is selected", () => {
    const manager = new StateManager()
    expect(manager.gameState.firstBidder).not.toBe(-1)
}
)


test("bid is updated if new bid is greater", () => {
    const manager = new StateManager()
    manager.gameState.firstBidder = 1
    manager.gameState.turnNumber = 4
    manager.gameState.roundNumber = 6


    manager.bid("d", 1)
    expect(manager.gameState.bidState.amount).toBe(1)
    expect(manager.gameState.bidState.player).toBe("d")

    manager.bid("a", 4)
    expect(manager.gameState.bidState.amount).toBe(4)
    expect(manager.gameState.bidState.player).toBe("a")

    manager.bid("b", 5)
    expect(manager.gameState.bidState.amount).toBe(5)
    expect(manager.gameState.bidState.player).toBe("b")

    manager.bid("c", 6)
    expect(manager.gameState.bidState.amount).toBe(6)
    expect(manager.gameState.bidState.player).toBe("c")

    manager.setTrump("c", "H")
    expect(manager.gameState.trump).toBe("H")
})

test("discard works correctly", () => {
    const manager = new StateManager()
    var discards = manager.gameState.currentHands.a.slice(0,4)

    manager.discard("a", discards)
    expect(manager.gameState.currentHands.a.length).toBe(6)
    discards.forEach((c) => {
        expect(manager.gameState.currentHands.a
            .find(card => card.suit === c.suit && card.value === c.value))
            .toBeFalsy()
    })
})

test("discard with 0 cards works correctly", () => {
    const manager = new StateManager()
    var discards = []

    const before = JSON.stringify(manager.gameState.currentHands.a)
    manager.discard("a", discards)
    expect(manager.gameState.currentHands.a.length).toBe(6)
    
    expect(JSON.stringify(manager.gameState.currentHands.a)).toBe(before)
})

test("Able to play cards correctly", () => {
    const manager = new StateManager()
    /** @type {import("./stateManager").GameState} */
    var gameState = {
        bidState : {player: "b", totalBids: 4, amount: 3},
        firstBidder: 1,
        turnNumber: 1,
        roundNumber: 6,
        trump : "S",
        playState : [],
        currentHands: {
            a: [{suit: "", value:"jo"},{suit: "D", value:"9"},{suit: "D", value:"8"},{suit: "D", value:"7"},{suit: "D", value:"6"},{suit: "D", value:"5"}],
            b: [{suit: "", value:"JO"},{suit: "S", value:"9"},{suit: "S", value:"8"},{suit: "S", value:"7"},{suit: "S", value:"6"},{suit: "S", value:"5"}],
            c: [{suit: "S", value:"J"},{suit: "C", value:"4"},{suit: "C", value:"5"},{suit: "C", value:"6"},{suit: "C", value:"7"},{suit: "C", value:"8"}],
            d: [{suit: "C", value:"A"},{suit: "C", value:"K"},{suit: "C", value:"Q"},{suit: "C", value:"J"},{suit: "C", value:"10"},{suit: "C", value:"9"}],
        }
    }
    
    manager.gameState = {...manager.gameState, ...gameState}
    manager.playCard("c",manager.gameState.currentHands.c[0])
    manager.playCard("d",manager.gameState.currentHands.d[0])
    manager.playCard("a",manager.gameState.currentHands.a[0])
    manager.playCard("b",manager.gameState.currentHands.b[0])

    expect(manager.gameState.roundScore.A).toBe(3)
    expect(manager.gameState.roundScore.B).toBe(0)

    
    for(var i = 0; i<5;i++){
        manager.playCard("c",manager.gameState.currentHands.c[0])
        manager.playCard("d",manager.gameState.currentHands.d[0])
        manager.playCard("a",manager.gameState.currentHands.a[0])
        manager.playCard("b",manager.gameState.currentHands.b[0])
    }

    expect(manager.gameState.gameScore.A).toBe(3)
    expect(manager.gameState.gameScore.B).toBe(-3)

    expect(manager.gameState.currentStage).toBe("pre-round")

    manager.bid("d", 3)
    manager.bid("a", 4)
    manager.bid("b", 0)
    manager.bid("c", 0)

    expect(manager.gameState.currentHands["a"].length).toBe(12)
    manager.setTrump("a", "C")

    manager.discard("a", manager.gameState.currentHands.a.slice(6,12))
    expect(manager.gameState.currentHands["a"].length).toBe(6)
    expect(manager.gameState.currentStage).toBe("round")

    
    for(var i = 0; i<6;i++){
        manager.playCard("a",manager.gameState.currentHands.a[0])
        manager.playCard("b",manager.gameState.currentHands.b[0])
        manager.playCard("c",manager.gameState.currentHands.c[0])
        manager.playCard("d",manager.gameState.currentHands.d[0])
    }
})
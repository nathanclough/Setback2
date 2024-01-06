import * as Types from "./types"
import { evaluateHand } from "./handEvaluator"
test("Hand with all trump", () => {

    /**
     * @type {Types.Play []}
     */
    const plays = [{card: {suit: "S", value: "2"}, player : "a"}, {card: {suit:"S", value: "4"}, player : "b"},
     {card: {suit:"S",value:"Q"}, player : "c"},{card: {suit:"S", value:"J"}, player : "d"}]
    const trump = "S"

    /**
     * @type {Types.HandResult}
     */    
    const handResult = evaluateHand(plays,trump)
    
    expect(handResult.winningPlay.player).toBe("c")
    expect(handResult.pointsScored.A).toBe(2)
    expect(handResult.pointsScored.B).toBe(0)
})

test("Hand with mixed trump", () => {

    /**
     * @type {Types.Play []}
     */
    const plays = [{card: {suit: "D", value: "A"}, player : "a"}, {card: {suit:"S", value: "4"}, player : "b"},
     {card: {suit:"S",value:"Q"}, player : "c"},{card: {suit:"S", value:"J"}, player : "d"}]
    const trump = "S"

    /**
     * @type {Types.HandResult}
     */    
    const handResult = evaluateHand(plays,trump)
    
    expect(handResult.winningPlay.player).toBe("c")
    expect(handResult.pointsScored.A).toBe(1)
    expect(handResult.pointsScored.B).toBe(0)
})

test("Hand with no trump", () => {

    /**
     * @type {Types.Play []}
     */
    const plays = [{card: {suit: "S", value: "A"}, player : "a"}, {card: {suit:"S", value: "4"}, player : "b"},
     {card: {suit:"S",value:"Q"}, player : "c"},{card: {suit:"S", value:"J"}, player : "d"}]
    const trump = "D"

    /**
     * @type {Types.HandResult}
     */    
    const handResult = evaluateHand(plays,trump)
    
    expect(handResult.winningPlay.player).toBe("a")
    expect(handResult.pointsScored.A).toBe(0)
    expect(handResult.pointsScored.B).toBe(0)
})

test("Hand with jick", () => {

    /**
     * @type {Types.Play []}
     */
    const plays = [{card: {suit: "D", value: "J"}, player : "a"}, {card: {suit:"H", value: "J"}, player : "b"},
     {card: {suit:"H",value:"5"}, player : "c"},{card: {suit:"H", value:"8"}, player : "d"}]
    const trump = "H"

    /**
     * @type {Types.HandResult}
     */    
    const handResult = evaluateHand(plays,trump)
    
    expect(handResult.winningPlay.player).toBe("b")
    expect(handResult.pointsScored.A).toBe(0)
    expect(handResult.pointsScored.B).toBe(2)
})

test("Hand with no trump, multi suit", () => {

    /**
     * @type {Types.Play []}
     */
    const plays = [
     {card: {suit: "S", value: "3"},player : "a"}, 
     {card: {suit:"H", value: "4"}, player : "b"},
     {card: {suit:"C",value:"Q"}, player : "c"},
     {card: {suit:"C", value:"J"}, player : "d"}
    ]
    const trump = "D"

    /**
     * @type {Types.HandResult}
     */    
    const handResult = evaluateHand(plays,trump)
    
    expect(handResult.winningPlay.player).toBe("a")
    expect(handResult.pointsScored.A).toBe(0)
    expect(handResult.pointsScored.B).toBe(0)
})

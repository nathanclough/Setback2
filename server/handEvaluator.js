import * as Types from "./types.js"

const suitCompliments = {
    "S": "C",
    "C":"S",
    "D":"H",
    "H":"D"
}

/**
 * 
 * @param {Types.Card} c1 
 * @param {Types.Card} c2 
 * @param {Types.string} trump
 * @returns {number}
 * 
 */
export const compareCards = (c1, c2, trump, startingSuit) => {

    valueMap = {}

}

/**
 * 
 * @param {Types.Card} c 
 * @param {string} trump
 */
const isTrump = (c, trump) => {

    const jokers = {
        "jo": true,
        "JO": true,
    }
    // basic check
    if (c.suit === trump)
        return true

    // handle jockers 
    if (jokers[c.value])
        return true

    // handle jick 
    if (c.value === "J" && suitCompliments[c.suit] === trump)
        return true
    
    return false
}

/**
 * @param {Types.Play[]}  hand List of cards in the order played 
 * @param {string} trump the current trump suit 
 */
export const evaluateHand = (hand, trump) => {
    const priority = hand[0].card.suit
    var currentWinningPlay = undefined

    const teamMap = {
        "a": "A",
        "c": "A",
        "b": "B",
        "d": "B"
    }

    const isPoint = {
        "2": true,
        "jo": true,
        "JO": true,
        "j": true,
        "J": true,
        "A": true,
    }

    const valueMap = {
        "2": 2,
        "3": 3,
        "4": 4,
        "5": 5,
        "6": 6,
        "7": 7,
        "8": 8,
        "9": 9,
        "10": 10,
        "jo": 11,
        "JO": 12,
        "J": 13,
        "Q": 14,
        "K": 15,
        "A": 16,
    }

    /**
     * @type {Types.Score}
     */
    const scoredPoints = { A: 0, B: 0 }

    var pot = 0
    for (var i = 0; i < hand.length; i++) {
        const newCardIsTrump = isTrump(hand[i].card, trump)
        const currentWinnerIsTrump = currentWinningPlay ? isTrump(currentWinningPlay.card, trump) : false

        // if point add to pot 
        if (isPoint[hand[i].card.value] && newCardIsTrump)

            if (hand[i].card.value === "2" && newCardIsTrump)
                scoredPoints[teamMap[hand[i].player]] += 1
            else
                pot += 1


        // check if new card is current winner 
        if (currentWinnerIsTrump === false && (newCardIsTrump || i === 0))
            currentWinningPlay = hand[i]
        else {
            if(valueMap[currentWinningPlay.card.value] < valueMap[hand[i].card.value] && (hand[i].card.suit === priority || newCardIsTrump))
                currentWinningPlay = hand[i]
            if(valueMap[currentWinningPlay.card.value] === valueMap[hand[i].card.value] && hand[i].card.suit === trump){
                 currentWinningPlay = hand[i]
            }
        }
    }
    scoredPoints[teamMap[currentWinningPlay.player]] += pot
    return { winningPlay: currentWinningPlay, pointsScored: scoredPoints }

}
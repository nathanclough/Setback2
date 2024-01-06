/**
 * @typedef Card
 * @property {string} suit C S H D               11 12 13 14 15 16 17 
 * @property {string} value 1 2 3 4 5 6 7 8 9 10 jo JO j  J  Q  K  A 
 
*/

/**
 * @typedef CurrentHands
 * @property {Card []} a
 * @property {Card []} b
 * @property {Card []} c
 * @property {Card []} d
 */

/**
 * @typedef BidState
 * @property {string} player
 * @property {int} amount
 * @property {int} totalBids
 */

/**
 * @typedef Play
 * @property {Card} card
 * @property {string} player
 */

/**
 * @typedef Score
 * @property {int} A
 * @property {int} B
 */

/**
 * Current state of the game 
 * @typedef {Object} GameState
 * @property {string[]} team1 
 * @property {string[]} team2
 * @property {CurrentHands}currentHands
 * @property {BidState} bidState
 * @property {Card []} deck
 * @property {string} currentStage
 * @property {int} firstBidder
 * @property {int} roundNumber
 * @property {int} turnNumber
 * @property {int} handCount
 * @property {Card[]} playedCards 
 * @property {Card[]} kitty
 * @property {Score } gameScore
 * @property {Score } roundScore
 * @property {string} trump
 * @property {Play []} playState
 */

/**
 * @typedef {Object} HandResult
 * @property {Play} winningPlay
 * @property {Score} pointsScored
 */

export const types = {}

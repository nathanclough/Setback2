import { buildDeck } from "./utilities.js"
import * as Types from "./types.js"
import { evaluateHand } from "./handEvaluator.js"
export class StateManager {
    /**
     * @type {Types.GameState}
     */
    gameState

    playerList = ["a", "b", "c", "d"]

    teamMap = { "a": "A", "b": "B", "c": "A", "d": "B" }
    otherMap = { "B": "A", "A": "B" }

    constructor() {
        this.gameState = {}
        this.gameState.bidState = { player: "", amount: 0, totalBids: 0 }
        this.gameState.team1 = ["a", "c"]
        this.gameState.team2 = ["b", "d"]
        this.gameState.currentHands = {}
        this.gameState.roundNumber = 0
        this.gameState.handCount = 0
        this.gameState.currentStage = "pre-round"
        this.gameState.gameScore = { A: 0, B: 0 }
        this.gameState.roundScore = { A: 0, B: 0 }
        // randomly select first bidder 
        this.gameState.firstBidder = Math.floor(Math.random() * 4)

        this.preroundSetup()
    }
    nextTurn() {
        this.gameState.turnNumber = (this.gameState.turnNumber + 1) % 4
    }
    nextRound() {
        this.gameState.roundNumber = (this.gameState.roundNumber + 1) % 4
    }

    preroundSetup() {
        // add deck 
        this.gameState.deck = buildDeck()

        // Give each player 6 cards
        this.gameState.currentHands.a = this.gameState.deck.splice(0, 6)
        this.gameState.currentHands.b = this.gameState.deck.splice(0, 6)
        this.gameState.currentHands.c = this.gameState.deck.splice(0, 6)
        this.gameState.currentHands.d = this.gameState.deck.splice(0, 6)
        this.gameState.kitty = this.gameState.deck.splice(0, 6)
        this.gameState.turnNumber = 0
        this.gameState.bidState.totalBids = 0
        this.gameState.handCount = 0

        // ping first bidder 
    }

    /**
     * Checks that it is the attempted bidders turn and saves bid if possible
     * @param {string} player
     * @param {int} bid
     */
    bid(player, bid) {
        var currentPlayerBid = this.playerList.at((this.gameState.firstBidder + this.gameState.turnNumber + this.gameState.roundNumber) % 4)


        if (currentPlayerBid !== player) {
            throw new Error(`Current player bid is ${currentPlayerBid} not ${player}`)
        }

        if (this.gameState.bidState.amount < bid) {
            this.gameState.bidState.player = player
            this.gameState.bidState.amount = bid
        }
        this.gameState.bidState.totalBids += 1

        if (this.gameState.bidState.totalBids === 4) {
            this.gameState.kitty.forEach(c => {
                this.gameState.currentHands[this.gameState.bidState.player].push(c)
            })
        }
        this.nextTurn()
    }

    /**
     * Checks that it is the attempted bidders turn and saves bid if possible
     * @param {string} player
     * @param {int} bid
     */
    setTrump(player, trump) {
        if (!player === this.gameState.bidState.player && this.gameState.bidState.totalBids === 4) {
            throw new Error(`Only ${this.gameState.bidState.totalBids} have been collected. Current leader is ${this.gameState.bidState.player}`)
        }
        this.gameState.trump = trump
        this.gameState.currentStage = "round"
    }

    /**
     * Removes cards from players hand and replaces them with new from deck
     * @param {string} player this a, b, c, d
     * @param {Card[]} count cards they player would like to discard
     */
    discard(player, cards) {
        const countGiveBack = 6 - this.gameState.currentHands[player].length + cards.length
        this.gameState.currentHands[player] = this.gameState.currentHands[player].filter(card => cards.find(c => c.value === card.value && card.suit === c.suit) === undefined).concat(this.gameState.deck.splice(0, countGiveBack))
    }

    /**
     * @param {string} player 
     * @param {Types.Card} card
     */
    playCard(player, card) {
        // Validate it is players turn 
        const bidWinner = this.playerList.indexOf(this.gameState.bidState.player)
        var currentPlayTurn = this.playerList.at((bidWinner + this.gameState.turnNumber) % 4)

        if (!(player === currentPlayTurn))
            throw new Error(`Player ${player} is attempting to play out of turn. Current turn is ${currentPlayTurn}`)

        //TODO: Validate they can play the selected card based on what was played first and trump
        if (!this.gameState.currentHands[player].find(c => c.value === card.value && c.suit === card.suit)) {
            throw new Error(`Player does not have card ${card.suit} ${card.value}`)
        }
        // update the state 
        /** @type {Types.Play} */
        var play = { player: player, card: card }
        this.gameState.playState.push(play)
        this.discard(player, [card])

        // increment turn 
        this.nextTurn()


        if (this.gameState.playState.length === 4) {
            // find team that played highest value card 
            const handResult = evaluateHand(this.gameState.playState, this.gameState.trump)

            // update GAME points for who gets the 10 card 

            // Update round score  
            this.gameState.roundScore.A += handResult.pointsScored.A
            this.gameState.roundScore.B += handResult.pointsScored.B
            this.gameState.playState = []
            this.gameState.handCount++
        }

        // Once all cards have been played 
        if (this.gameState.handCount === 6) {
            // compare with bids 
            var bidTeam = this.teamMap[this.gameState.bidState.player]
            var otherTeam = this.otherMap[bidTeam]
            // handle mis bid 
            if (this.gameState.roundScore[bidTeam] < this.gameState.bidState.amount) {
                this.gameState.gameScore[bidTeam] -= this.gameState.bidState.amount
                this.gameState.gameScore[otherTeam] += this.gameState.roundScore[otherTeam]
            }
            // handle made bid
            else {
                this.gameState.gameScore.A += this.gameState.roundScore.A
                this.gameState.gameScore.B += this.gameState.roundScore.B
            }

            this.gameState.currentStage === "pre-round"
            this.preroundSetup()
        }
    }
}
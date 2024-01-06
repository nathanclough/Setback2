import * as types from "./types.js"

const suitCompliments = {
    "H": "D",
    "D": "H",
    "S": "C",
    "C": "S",
}
const jokers = {
    "jo": true,
    "JO": true,
}

/**
 * @returns {types.Card []}
 */
const shuffle = (array) => {
        let oldElement;
        for (let i = array.length - 1; i > 0; i--) {
          let rand = Math.floor(Math.random() * (i + 1));
          oldElement = array[i];
          array[i] = array[rand];
          array[rand] = oldElement;
        }
        return array;
}

export const buildDeck = () => {
    const suits = ["H", "D", "S", "C" ]
    const values = ["2", "3" ,"4" ,"5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
    /**
     * @type {types.Card[]} 
     */
    var deck = [{suit:"", value:"JO"}, {suit:"",value:"jo"}] 
    
    suits.forEach(suit => {
        deck = deck.concat(values.map(value => {
            return {suit: suit, value: value}
        }))
    })

    return shuffle(deck)
}

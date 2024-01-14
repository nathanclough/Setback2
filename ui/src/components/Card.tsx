import "./Card.css"
import {motion} from "framer-motion"

type Value = "2" | "3" | "5" | "6" | "7" | "8" | "9" | "10" | "jo" | "JO" | "J" | "Q" | "K" | "A"
type Suit = "spades" | "diamonds" | "clubs" | "hearts"
type Card = {
    suit: Suit
    value: Value
}

const spadesCardMap = new Map<Value, string>([["A", "🂡"], ["K", "🂮"]])

const suitMap = new Map<Suit, Map<Value, string>>([["spades", spadesCardMap]])

export const Card = ({ card }: { card: Card }) => {
    return <div className="card">{suitMap.get(card.suit)?.get(card.value)}</div>
}
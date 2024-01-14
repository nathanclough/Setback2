import { useRef } from 'react'
import './App.css'
import { Card } from "./components/Card"
import { motion } from "framer-motion"
import { Dragable } from './components/Dragable'
function App() {
  const constraintRef = useRef(null)
  return (<div>
    <motion.div className="container" ref={constraintRef}>
      <div className="table-top">    <Card card={{ suit: "spades", value: "K" }}></Card>
      <div className='player-display'></div>
      <div className='player-display'></div>
      <div className='player-display'></div>
      <div className='player-display'></div>
      </div>
      <div className="hand-display">
        <Dragable constraintRef={constraintRef}><Card card={{
          suit: 'spades',
          value: 'A'
        }}></Card></Dragable>
        <Dragable constraintRef={constraintRef}><Card card={{
          suit: 'spades',
          value: 'K'
        }}></Card></Dragable>
      </div>
      <div
        className="info-container"></div>

    </motion.div></div>

  )
}

export default App

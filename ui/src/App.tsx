import { useRef } from 'react'
import './App.css'
import {Card} from "./components/Card"
import {motion} from "framer-motion"
function App() {
  const constraintRef = useRef(null)
  return (
    <motion.div className="container" ref={constraintRef}>
     <Card card={{
        suit: 'spades',
        value: 'A'
      }}
      constraintRef={constraintRef}/>
           <Card card={{
        suit: 'spades',
        value: 'K'
      }}
      constraintRef={constraintRef}/>
    </motion.div>
  )
}

export default App

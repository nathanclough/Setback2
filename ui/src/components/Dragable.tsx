import { motion } from "framer-motion"

export const Dragable = ({constraintRef,children}: {constraintRef: any, children: any}) => {
    return       <motion.div
    drag
    dragMomentum={false}
    dragConstraints={constraintRef}
  >
{children}
  </motion.div>

}
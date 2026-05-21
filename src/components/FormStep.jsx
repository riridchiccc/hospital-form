import { motion } from "framer-motion";

export const FormStep = ({ children, stepKey }) => (
  <motion.div
    key={stepKey}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-4"
  >
    {children}
  </motion.div>
);
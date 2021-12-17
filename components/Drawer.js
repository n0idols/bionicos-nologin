import { motion } from "framer-motion";

export default function Drawer({ children, closeDrawer }) {
  const variants = {
    hidden: {
      x: "100vw",
      opacity: 0,
    },
    visible: {
      x: "66.67vw",
      opacity: 1,
      transition: {
        duration: 0.2,
        damping: 15,
        stiffness: 300,
      },
    },
    exit: {
      x: "100vw",
      opacity: 0,
    },
  };
  return (
    <motion.div
      onClick={(e) => e.stopPropagation()}
      className="z-50 h-screen fixed w-4/12 p-4 bg-white"
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <button onClick={closeDrawer} className="absolute top-0 left-0 ml-2 mt-2">
        Close
      </button>
      <div className="ml-2 pt-24">{children}</div>
    </motion.div>
  );
}

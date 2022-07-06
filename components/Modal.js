import { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import { motion, AnimatePresence } from "framer-motion";
import Overlay from "./Overlay";

const container = `m-auto w-[500px] px-2`;
const modalstyle = `h-auto flex flex-col shadow-2xl`;
const modalheader = `shadow-lg bg-gray-200 flex justify-between items-center rounded-t p-4`;
const modalbody = `bg-white h-full rounded-b-md p-2`;
const closebtn = `btn btn-circle btn-sm text-xl text-white"`;

export default function Modal({ show, onClose, children, title }) {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleClose = (e) => {
    e.preventDefault();
    onClose();
  };

  const dropIn = {
    hidden: {
      y: "20%",
      opacity: 0,
    },
    visible: {
      y: "0",
      opacity: 1,
      transition: {
        duration: 0.1,
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
    exit: {
      y: "20%",
      opacity: 0,
    },
  };

  const modalContent = show ? (
    <Overlay onClick={onClose}>
      <motion.div
        className={container}
        onClick={(e) => e.stopPropagation()}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className={modalstyle}>
          <div className={modalheader}>
            <div>{title && <h1>{title}</h1>}</div>
            <div>
              <button onClick={handleClose} className={closebtn}>
                &times;
              </button>
            </div>
          </div>

          <div className={modalbody}>{children}</div>
        </div>
      </motion.div>
    </Overlay>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      <AnimatePresence
        exitBeforeEnter={true}
        initial={false}
        onExitComplete={() => null}
      >
        {modalContent}
      </AnimatePresence>,
      document.getElementById("modal-root")
    );
  } else {
    return null;
  }
}

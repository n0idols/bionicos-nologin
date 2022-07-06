import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FaTimes } from "react-icons/fa";
import Overlay from "./Overlay";
import { motion, AnimatePresence } from "framer-motion";

const overlay = `h-screen w-screen bg-black bg-opacity-90 overflow-x-hidden overflow-y-auto fixed inset-0 z-50 flex`;
const container = `m-auto w-[500px] px-2`;
const modalstyle = `h-auto flex flex-col shadow-2xl`;
const modalheader = `shadow-lg bg-gray-200 flex justify-between items-center rounded-t p-4 text-center`;
const modalbody = `bg-white h-full rounded-b-md`;

export default function CardsModal({ show, onClose, children, title }) {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => setIsBrowser(true), []);

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
            <div className="w-full">
              {title && <h1 className="text-center">{title}</h1>}
            </div>
            <div>
              <button
                onClick={handleClose}
                className="btn btn-circle btn-sm text-xl text-white"
              >
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

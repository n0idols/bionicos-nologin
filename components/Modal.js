import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FaTimes } from "react-icons/fa";

const overlay = `h-screen w-screen bg-black overflow-x-hidden overflow-y-auto fixed inset-0 z-50 bg-opacity-60 flex`;
const container = `m-auto w-[500px] px-2`;
const modalstyle = `h-auto flex flex-col shadow-2xl`;
const modalheader = `shadow-lg bg-gray-200 flex justify-between items-center rounded-t p-4`;
const modalbody = `bg-white h-full rounded-b-md`;

export default function Modal({ show, onClose, children, title }) {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleClose = (e) => {
    e.preventDefault();
    onClose();
  };

  const modalContent = show ? (
    <div className={overlay}>
      <div className={container}>
        <div className={modalstyle}>
          <div className={modalheader}>
            <div>{title && <h1>{title}</h1>}</div>
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
      </div>
    </div>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root")
    );
  } else {
    return null;
  }
}

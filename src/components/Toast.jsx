import React from 'react'

const Toast = ({ message, show, onClose }) => {

  if(show){ 
    setTimeout(() => {
      onClose()    
    }, 5000)
  }

  return (
    <div
      className={`fixed top-5 right-5 flex items-center w-full max-w-xs p-4 text-green-100 bg-green-600 rounded-lg shadow transition-transform transform ${
        show ? 'translate-y-0' : 'hidden'
      }`}
      role="alert"
    >
      <div className="ml-3 text-sm font-normal">{message}</div>
      <button
        onClick={onClose}
        className="ml-auto text-green-100 hover:text-gray-800"
      >
        ✖
      </button>
    </div>
  );
};

export default Toast;

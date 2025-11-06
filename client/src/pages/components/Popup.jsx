import React from "react";

const Popup = ({ message, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 min-w-[250px] flex flex-col items-center">
      <p className="mb-4 text-center">{message}</p>
      <button
        onClick={onClose}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        OK
      </button>
    </div>
  </div>
);

export default Popup;
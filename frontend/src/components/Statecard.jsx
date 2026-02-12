import React from "react";

const Card = ({ title, value, color }) => {
  return (
    <div className={`bg-white shadow-lg rounded-xl p-6 border-l-8 ${color}`}>
      <p className="text-gray-500 text-l  mb-2">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
  );
};

export default Card;


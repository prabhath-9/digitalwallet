import React from 'react';
import { motion } from 'framer-motion';

const BalanceCard = ({ balance }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-lg bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 text-white shadow-2xl"
    >
      <div className="p-6">
        <h2 className="text-lg font-semibold opacity-90 mb-2">Total Balance</h2>
        <motion.p
          key={balance}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-5xl font-bold"
        >
          ₹{balance ? Number(balance).toFixed(2) : '0.00'}
        </motion.p>
        <div className="flex justify-end mt-4">
          <div className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm">Available</div>
        </div>
      </div>
    </motion.div>
  );
};

export default BalanceCard;

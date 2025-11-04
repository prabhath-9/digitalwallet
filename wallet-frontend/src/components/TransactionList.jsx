import React from 'react';
import { motion } from 'framer-motion';

const TransactionList = ({ transactions }) => {
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'ADD':
        return '💰';
      case 'SEND':
        return '📤';
      case 'RECEIVE':
        return '📥';
      default:
        return '💳';
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'ADD':
      case 'RECEIVE':
        return 'text-green-600';
      case 'SEND':
        return 'text-red-600';
      default:
        return 'text-gray-900';
    }
  };

  const getTransactionSign = (type) => {
    return type === 'SEND' ? '-' : '+';
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No transactions yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((transaction, index) => (
        <motion.div
          key={transaction.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl">{getTransactionIcon(transaction.type)}</div>
                <div>
                  <p className="font-semibold">
                    {transaction.type === 'ADD' && 'Added Money'}
                    {transaction.type === 'SEND' && `Sent to ${transaction.toEmail}`}
                    {transaction.type === 'RECEIVE' && `Received from ${transaction.fromEmail}`}
                  </p>
                  <p className="text-sm text-gray-500">{formatDate(transaction.timestamp)}</p>
                </div>
              </div>
              <div className={`text-xl font-bold ${getTransactionColor(transaction.type)}`}>
                {getTransactionSign(transaction.type)}₹{Number(transaction.amount).toFixed(2)}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TransactionList;

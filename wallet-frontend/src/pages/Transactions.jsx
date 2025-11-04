import React, { useState, useEffect } from 'react';
import { walletService } from '../services/walletService';
import Navbar from '../components/Navbar';
import TransactionList from '../components/TransactionList';
import { motion } from 'framer-motion';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    loadTransactions();
  }, [page]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const data = await walletService.getTransactions(page, 20);
      setTransactions(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-2">Transaction History</h1>
          <p className="text-gray-600 mb-8">View all your transactions</p>

          <div className="rounded-lg bg-white shadow-xl">
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
              ) : (
                <>
                  <TransactionList transactions={transactions} />
                  
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-6 gap-2">
                      <button
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-1 px-3 text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 0}
                      >
                        Previous
                      </button>
                      <span className="bg-transparent text-gray-700 font-semibold py-1 px-3 text-sm">
                        Page {page + 1} of {totalPages}
                      </span>
                      <button
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-1 px-3 text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages - 1}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Transactions;

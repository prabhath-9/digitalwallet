import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { walletService } from '../services/walletService';
import Navbar from '../components/Navbar';
import BalanceCard from '../components/BalanceCard';
import TransactionList from '../components/TransactionList';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await walletService.getTransactions(0, 5);
      setTransactions(data.content);
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
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">Manage your digital wallet</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <BalanceCard balance={user?.balance} />
            
            <div className="mt-6 space-y-3">
              <Link to="/add-money" className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors">
                💰 Add Money
              </Link>
              <Link to="/transfer" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors">
                📤 Transfer Money
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white shadow-xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Recent Transactions</h2>
                  <Link to="/transactions" className="text-purple-600 hover:text-purple-800 font-semibold">
                    View All
                  </Link>
                </div>
                
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  </div>
                ) : (
                  <TransactionList transactions={transactions} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

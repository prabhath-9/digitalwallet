import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { walletService } from '../services/walletService';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Transfer = () => {
  const [toEmail, setToEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const amountNum = parseFloat(amount);
    if (amountNum <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    if (amountNum > user.balance) {
      toast.error('Insufficient balance');
      return;
    }

    if (toEmail === user.email) {
      toast.error('Cannot transfer to yourself');
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    setShowConfirm(false);

    try {
      const amountNum = parseFloat(amount);
      await walletService.transferMoney(toEmail, amountNum);
      toast.success(`Successfully transferred ₹${amountNum.toFixed(2)}!`);
      await refreshUser();
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-2">Transfer Money</h1>
            <p className="text-gray-600 mb-8">Send money to another user</p>

            <div className="rounded-lg bg-white shadow-xl">
              <div className="p-6">
                <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Available Balance: ₹{user?.balance ? Number(user.balance).toFixed(2) : '0.00'}</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      <span>Recipient Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="recipient@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={toEmail}
                      onChange={(e) => setToEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mt-4 mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      <span>Amount (INR)</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      className="w-full px-4 py-3 text-2xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      step="0.01"
                      min="0.01"
                      max={user?.balance || 0}
                      required
                    />
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg text-lg transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Transfer'}
                    </button>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="w-full bg-transparent hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
                      onClick={() => navigate('/dashboard')}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="font-bold text-lg mb-4">Confirm Transfer</h3>
            <p className="py-4">
              Are you sure you want to transfer <strong>₹{parseFloat(amount).toFixed(2)}</strong> to{' '}
              <strong>{toEmail}</strong>?
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <button className="bg-transparent hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors" onClick={handleConfirm}>
                Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transfer;

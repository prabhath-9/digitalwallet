import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { walletService } from '../services/walletService';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AddMoney = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const amountNum = parseFloat(amount);
    if (amountNum <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    setLoading(true);

    try {
      const response = await walletService.addMoney(amountNum);
      toast.success(`Successfully added ₹${amountNum.toFixed(2)}!`);
      await refreshUser();
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add money');
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
            <h1 className="text-4xl font-bold mb-2">Add Money</h1>
            <p className="text-gray-600 mb-8">Add funds to your wallet</p>

            <div className="rounded-lg bg-white shadow-xl">
              <div className="p-6">
                <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-4 rounded">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>This is a mock payment. No real money will be charged.</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
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
                      required
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {[10, 25, 50, 100].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold py-2 px-4 rounded-lg transition-colors"
                        onClick={() => setAmount(preset.toString())}
                      >
                        ₹{preset}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg text-lg transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Add Money'}
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
    </div>
  );
};

export default AddMoney;

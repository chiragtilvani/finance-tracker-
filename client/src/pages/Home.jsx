

import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaChartLine, FaBell, FaWallet, FaPiggyBank, FaCreditCard } from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import { BsGraphUp, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function HomePage() {
  const navigate = useNavigate();
  const [transactionData, setTransactionData] = useState([]);

  useEffect(() => {
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const dummyData = months.map(month => ({
      month,
      income: Math.floor(Math.random() * 5000) + 2000,
      expenses: Math.floor(Math.random() * 3000) + 1000
    }));
    setTransactionData(dummyData);
  }, []);

  const totalIncome = transactionData.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = transactionData.reduce((sum, item) => sum + item.expenses, 0);
  const netSavings = totalIncome - totalExpenses;

  const chartData = {
    labels: transactionData.map(item => item.month),
    datasets: [
      {
        label: 'Income',
        data: transactionData.map(item => item.income),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'Expenses',
        data: transactionData.map(item => item.expenses),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Income vs Expenses',
        font: {
          size: 16
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-indigo-50">
    
      <nav className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center mr-3">
            <FaWallet className="text-white text-xl" />
          </div>
          <span className="text-xl font-bold text-gray-800">FinanceFlow</span>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/signup')}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Sign Up
          </button>
        </div>
      </nav>

     
      <div className="py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Take Control of Your Finances</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          FinanceFlow helps you track expenses, analyze spending patterns, and achieve your financial goals with ease.
        </p>
        
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-indigo-600 mb-2">10K+</div>
            <div className="text-gray-500">Active Users</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-indigo-600 mb-2">500K+</div>
            <div className="text-gray-500">Transactions Tracked</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-indigo-600 mb-2">99.9%</div>
            <div className="text-gray-500">Uptime</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-indigo-600 mb-2">4.8</div>
            <div className="flex justify-center items-center text-yellow-400">
              <BsStarFill className="mx-0.5" />
              <BsStarFill className="mx-0.5" />
              <BsStarFill className="mx-0.5" />
              <BsStarFill className="mx-0.5" />
              <BsStarHalf className="mx-0.5" />
            </div>
          </div>
        </div>
      </div>

      
      <div className="bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Financial Overview</h2>
            
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Total Income</p>
                <p className="text-2xl font-bold">${totalIncome.toLocaleString()}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-600">Total Expenses</p>
                <p className="text-2xl font-bold">${totalExpenses.toLocaleString()}</p>
              </div>
              <div className={`p-4 rounded-lg ${netSavings >= 0 ? 'bg-blue-50 text-blue-600' : 'bg-yellow-50 text-yellow-600'}`}>
                <p className="text-sm">Net Savings</p>
                <p className="text-2xl font-bold">${netSavings.toLocaleString()}</p>
              </div>
            </div>

           
            <div className="h-80">
              <Bar data={chartData} options={chartOptions} />
            </div>

            
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
              <div className="space-y-3">
                {[
                  { id: 1, name: 'Grocery Store', amount: -85.32, date: 'Today', category: 'Food' },
                  { id: 2, name: 'Paycheck', amount: 2450.00, date: 'Yesterday', category: 'Income' },
                  { id: 3, name: 'Electric Bill', amount: -120.75, date: '2 days ago', category: 'Utilities' },
                  { id: 4, name: 'Freelance Work', amount: 800.00, date: '3 days ago', category: 'Income' }
                ].map(transaction => (
                  <div key={transaction.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        transaction.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {transaction.amount > 0 ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.name}</p>
                        <p className="text-sm text-gray-500">{transaction.date} • {transaction.category}</p>
                      </div>
                    </div>
                    <p className={`font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      
      
      <div className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Powerful Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <FaChartLine className="text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expense Tracking</h3>
              <p className="text-gray-600">
                Automatically categorize and track all your expenses in one place with our intuitive interface.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <FaPiggyBank className="text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Savings Goals</h3>
              <p className="text-gray-600">
                Set and track savings goals with visual progress indicators to help you stay motivated.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <BsGraphUp className="text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Financial Insights</h3>
              <p className="text-gray-600">
                Get personalized insights into your spending habits with beautiful charts and analytics.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <FaCreditCard className="text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bill Reminders</h3>
              <p className="text-gray-600">
                Never miss a payment with our customizable bill reminders and due date notifications.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <FaUserShield className="text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Data</h3>
              <p className="text-gray-600">
                Bank-level security to keep your financial data safe with end-to-end encryption.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <IoMdTime className="text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Time-Saving</h3>
              <p className="text-gray-600">
                Automatically sync with your bank accounts to save hours of manual entry.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 px-6 bg-indigo-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Account</h3>
              <p className="text-gray-600">
                Sign up in less than a minute and connect your financial accounts.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Your Spending</h3>
              <p className="text-gray-600">
                Our system automatically categorizes and tracks all your transactions.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Insights</h3>
              <p className="text-gray-600">
                Receive personalized recommendations to improve your financial health.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What Our Users Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <BsStarFill key={i} className="text-yellow-400 mx-0.5" />
                ))}
              </div>
              <p className="text-gray-600 italic mb-4">
                FinanceFlow completely transformed how I manage my money. The insights helped me save $500 in the first month!
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <span className="font-medium text-indigo-600">SR</span>
                </div>
                <div>
                  <h4 className="font-medium">Rohit Kukreja</h4>
                  <p className="text-sm text-gray-500">Marketing Manager</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <BsStarFill key={i} className="text-yellow-400 mx-0.5" />
                ))}
              </div>
              <p className="text-gray-600 italic mb-4">
                As a freelancer, keeping track of income and expenses was chaotic. FinanceFlow made it simple and stress-free.
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <span className="font-medium text-indigo-600">MK</span>
                </div>
                <div>
                  <h4 className="font-medium">Michael johnson</h4>
                  <p className="text-sm text-gray-500">Freelance Designer</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex mb-4">
                {[...Array(4)].map((_, i) => (
                  <BsStarFill key={i} className="text-yellow-400 mx-0.5" />
                ))}
                <BsStarHalf className="text-yellow-400 mx-0.5" />
              </div>
              <p className="text-gray-600 italic mb-4">
                The budgeting tools helped my family get out of debt faster than we thought possible. Highly recommended!
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <span className="font-medium text-indigo-600">AD</span>
                </div>
                <div>
                  <h4 className="font-medium">Anurag Patel</h4>
                  <p className="text-sm text-gray-500">Teacher</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 px-6 bg-indigo-600 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">Ready to Take Control of Your Finances?</h2>
        <button 
          onClick={() => navigate('/signup')}
          className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
        >
          Get Started - It's Free
        </button>
      </div>

      <footer className="bg-gray-800 text-white py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center mr-3">
              <FaWallet className="text-white" />
            </div>
            <span className="text-xl font-bold">FinanceFlow</span>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <p className="text-gray-400 mb-2">Created by Chirag Tilvani</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>

      

    </div>
  );
}

export default HomePage;
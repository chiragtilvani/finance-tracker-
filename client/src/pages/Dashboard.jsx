

import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { FiDollarSign, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';

// Register chart components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_BACKEND_URL+'/api/auth/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await res.json();

        if (data.success) {
          setUsername(data.user.username);

          // Fetch incomes
          const incomeRes = await fetch(import.meta.env.VITE_BACKEND_URL+'/api/auth/income', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          const incomeData = await incomeRes.json();
          setIncomes(incomeData.incomes || []);

          // Fetch expenses
          const expenseRes = await fetch(import.meta.env.VITE_BACKEND_URL+'/api/auth/expense', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          const expenseData = await expenseRes.json();
          setExpenses(expenseData.expenses || []);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  // Filter current month data
  const currentMonthIncomes = incomes.filter(
    (income) => new Date(income.date).getMonth() === currentMonth && 
              new Date(income.date).getFullYear() === currentYear
  );
  
  const currentMonthExpenses = expenses.filter(
    (expense) => new Date(expense.date).getMonth() === currentMonth && 
                new Date(expense.date).getFullYear() === currentYear
  );

  //recent transactions 
  const recentIncomes = [...incomes]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  //  pie chart
  const incomeBySource = currentMonthIncomes.reduce((acc, curr) => {
    acc[curr.source] = (acc[curr.source] || 0) + curr.amount;
    return acc;
  }, {});

  const incomePieChartData = {
    labels: Object.keys(incomeBySource),
    datasets: [
      {
        label: '₹ Amount',
        data: Object.values(incomeBySource),
        backgroundColor: [
          '#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#6366F1', '#14B8A6'
        ],
        borderColor: '#fff',
        borderWidth: 2
      }
    ]
  };

  // Prepare bar chart data for expense categories
  const expensesByCategory = currentMonthExpenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const expenseBarChartData = {
    labels: Object.keys(expensesByCategory),
    datasets: [
      {
        label: 'Expenses by Category',
        data: Object.values(expensesByCategory),
        backgroundColor: '#EF4444',
        borderRadius: 4
      }
    ]
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar username={username} />

      <div className="ml-64 flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Balance */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Total Balance</p>
                <h2 className="text-2xl font-bold mt-1">
                  ₹{(currentMonthIncomes.reduce((sum, i) => sum + i.amount, 0) - 
                     currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0)).toLocaleString()}
                </h2>
              </div>
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <FiDollarSign size={20} />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">Current month balance</p>
            </div>
          </div>

          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Total Income</p>
                <h2 className="text-2xl font-bold mt-1 text-green-600">
                  ₹{currentMonthIncomes.reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
                </h2>
              </div>
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                <FiTrendingUp size={20} />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">This month</p>
            </div>
          </div>

          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Total Expenses</p>
                <h2 className="text-2xl font-bold mt-1 text-red-600">
                  ₹{currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
                </h2>
              </div>
              <div className="p-2 rounded-lg bg-red-50 text-red-600">
                <FiTrendingDown size={20} />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">This month</p>
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left Column - Income Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Income Sources</h2>
            {Object.keys(incomeBySource).length > 0 ? (
              <div className="flex-1">
                <Pie
                  data={incomePieChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          padding: 20
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            return `${context.label}: ₹${context.raw.toLocaleString()}`;
                          }
                        }
                      }
                    }
                  }}
                  height={300}
                />
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <p>No income to visualize</p>
              </div>
            )}
          </div>

          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Recent Incomes</h2>
              <button
                onClick={() => navigate('/income')}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                See All
              </button>
            </div>
            {recentIncomes.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {recentIncomes.map((income) => (
                  <li key={income._id} className="py-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-700">{income.source}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(income.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-green-600">
                      ₹{income.amount.toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No income transactions found</p>
              </div>
            )}
          </div>
        </div>

       
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Expense Categories</h2>
            {Object.keys(expensesByCategory).length > 0 ? (
              <div className="flex-1">
                <Bar
                  data={expenseBarChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `₹${context.raw.toLocaleString()}`;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return `₹${value.toLocaleString()}`;
                          }
                        }
                      }
                    }
                  }}
                  height={300}
                />
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <p>No expenses to visualize</p>
              </div>
            )}
          </div>

         
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Recent Expenses</h2>
              <button
                onClick={() => navigate('/expenses')}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                See All
              </button>
            </div>
            {recentExpenses.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {recentExpenses.map((expense) => (
                  <li key={expense._id} className="py-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-700">{expense.category}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(expense.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-red-600">
                      ₹{expense.amount.toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No expense transactions found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
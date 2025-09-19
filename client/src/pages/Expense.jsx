import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { FiPlus, FiX, FiDollarSign, FiCalendar, FiUser, FiSearch, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight, FiDownload } from 'react-icons/fi';
import EmojiPicker from 'emoji-picker-react';
import { Bar, Line } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const expenseIcons = {
  'food': '🍔',
  'transport': '🚗',
  'shopping': '🛍️',
  'entertainment': '🎬',
  'bills': '🧾',
  'health': '🏥',
  'education': '📚',
  'other': '📌'
};

const paymentMethodColors = {
  'cash': 'bg-gray-100 text-gray-800',
  'credit card': 'bg-blue-100 text-blue-800',
  'debit card': 'bg-purple-100 text-purple-800',
  'upi': 'bg-green-100 text-green-800',
  'bank transfer': 'bg-indigo-100 text-indigo-800',
  'other': 'bg-yellow-100 text-yellow-800'
};

const Expense = () => {
  const [username, setUsername] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingExpense, setEditingExpense] = useState(null);
  const [chartType, setChartType] = useState('bar');
  const [form, setForm] = useState({ 
    category: '', 
    icon: '🧾', 
    amount: '', 
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash'
  });

  const ITEMS_PER_PAGE = 5;

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch(import.meta.env.VITE_BACKEND_URL+'/api/auth/user', {
          headers: { 
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        });
        const userData = await userRes.json();
        
        if (userData.user) {
          setUsername(userData.user.username);
          
          const expensesRes = await fetch(import.meta.env.VITE_BACKEND_URL+'/api/auth/expense', {
            headers: { 
              "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
          });
          const expensesData = await expensesRes.json();
          setExpenses(expensesData.expenses || []);
          setFilteredExpenses(expensesData.expenses || []);
        }
      } catch(err) {
        console.error(`Error while fetching data: ${err}`);
      }
    };
    fetchData();
  }, []);

  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredExpenses(expenses);
      setCurrentPage(1);
    } else {
      const filtered = expenses.filter(expense =>
        expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredExpenses(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, expenses]);

  
  const prepareChartData = () => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toLocaleString('default', { month: 'short' });
    }).reverse();

    const monthlyData = last6Months.map(month => {
      const monthExpenses = filteredExpenses.filter(expense => {
        const expenseMonth = new Date(expense.date).toLocaleString('default', { month: 'short' });
        return expenseMonth === month;
      });
      return monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    });

    return {
      labels: last6Months,
      datasets: [
        {
          label: 'Expenses',
          data: monthlyData,
          backgroundColor: '#EF4444',
          borderColor: '#EF4444',
          tension: 0.1
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
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
  };

  const exportToExcel = () => {
    const exportData = filteredExpenses.map(expense => ({
      'Category': expense.category,
      'Amount (₹)': expense.amount,
      'Date': new Date(expense.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      'Payment Method': expense.paymentMethod,
      'Icon': expense.icon
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");
    const fileName = `Expense_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const url = editingExpense 
      ? import.meta.env.VITE_BACKEND_URL+`/api/auth/expense/${editingExpense._id}`
      : import.meta.env.VITE_BACKEND_URL+'/api/auth/expense';
    const method = editingExpense ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...form,
          username,
          amount: Number(form.amount),
          date: new Date(form.date).toISOString()
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to save expense');
      }

      if (editingExpense) {
        setExpenses(expenses.map(e => e._id === result.expense._id ? result.expense : e));
        setFilteredExpenses(filteredExpenses.map(e => e._id === result.expense._id ? result.expense : e));
      } else {
        setExpenses([result.expense, ...expenses]);
        setFilteredExpenses([result.expense, ...filteredExpenses]);
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving expense:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense record?')) return;
    
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL+`/api/auth/expense/${id}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete expense');

      setExpenses(expenses.filter(e => e._id !== id));
      setFilteredExpenses(filteredExpenses.filter(e => e._id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setForm({
      category: expense.category,
      icon: expense.icon,
      amount: expense.amount.toString(),
      date: new Date(expense.date).toISOString().split('T')[0],
      paymentMethod: expense.paymentMethod
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({ 
      category: '', 
      icon: '🧾', 
      amount: '', 
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash'
    });
    setEditingExpense(null);
    setShowModal(false);
  };

  const getExpenseIcon = (category) => {
    const lowerCategory = category.toLowerCase();
    for (const key in expenseIcons) {
      if (lowerCategory.includes(key)) {
        return expenseIcons[key];
      }
    }
    return expenseIcons['other'];
  };

  
  const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedExpenses = filteredExpenses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar username={username} />
      
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-6 transition-all duration-300">
      
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Expenses</h1>
            <p className="text-gray-500 text-sm">Track your spending</p>
          </div>
          <div className="flex space-x-2 mt-3 md:mt-0">
            <button
              onClick={exportToExcel}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm"
            >
              <FiDownload className="mr-1" size={16} />
              <span>Export</span>
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
            >
              <FiPlus className="mr-1" size={16} />
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search expense categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <FiX className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-medium text-gray-700">Expense Visualization</h2>
            <div className="relative">
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-1 px-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              >
                <option value="bar">Bar Chart</option>
                <option value="line">Line Graph</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="h-64">
            {chartType === 'bar' ? (
              <Bar data={prepareChartData()} options={chartOptions} />
            ) : (
              <Line data={prepareChartData()} options={chartOptions} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-medium text-gray-700">
                {searchTerm ? 'Search Results' : 'Expense History'}
              </h2>
              {filteredExpenses.length > ITEMS_PER_PAGE && (
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    <FiChevronLeft size={18} />
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    <FiChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
            
            {paginatedExpenses.length > 0 ? (
              <div className="space-y-3">
                {paginatedExpenses.map(expense => (
                  <div key={expense._id} className="group flex items-center justify-between p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">
                        {getExpenseIcon(expense.category)}
                      </span>
                      <div>
                        <p className="font-medium text-sm">{expense.category}</p>
                        <div className="flex items-center space-x-2">
                          <p className="text-xs text-gray-500">
                            {new Date(expense.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${paymentMethodColors[expense.paymentMethod]}`}>
                            {expense.paymentMethod}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="text-red-600 font-medium">₹{expense.amount.toLocaleString()}</p>
                      <button 
                        onClick={() => handleEdit(expense)}
                        className="p-1 text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(expense._id)}
                        className="p-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                {searchTerm ? (
                  <p>No matching transactions found</p>
                ) : (
                  <p>No transactions yet</p>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="font-medium text-gray-700 mb-4">Summary</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Total Expenses</p>
                <p className="font-bold text-lg text-red-600">
                  ₹{filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Transactions</p>
                <p className="font-bold text-lg">{filteredExpenses.length}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">Expense Categories</p>
              <div className="flex flex-wrap gap-2">
                {[...new Set(filteredExpenses.map(e => e.category))].slice(0, 6).map(category => (
                  <div key={category} className="flex items-center bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs">
                    <span className="mr-1">{getExpenseIcon(category)}</span>
                    {category}
                  </div>
                ))}
                {[...new Set(filteredExpenses.map(e => e.category))].length > 6 && (
                  <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                    +{[...new Set(filteredExpenses.map(e => e.category))].length - 6} more
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">Payment Methods</p>
              <div className="flex flex-wrap gap-2">
                {[...new Set(filteredExpenses.map(e => e.paymentMethod))].map(method => (
                  <div key={method} className={`px-3 py-1 rounded-full text-xs ${paymentMethodColors[method]}`}>
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-sm w-full max-w-sm">
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-bold text-gray-800">
                    {editingExpense ? 'Edit Expense' : 'Add Expense'}
                  </h2>
                  <button 
                    onClick={resetForm}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                <form onSubmit={handleAddExpense} className="space-y-3">
                  {/* Category Field */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                    <input
                      type="text"
                      placeholder="Food, Transport, etc."
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>

                  {/* Amount Field */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={form.amount}
                        onChange={e => setForm({ ...form, amount: e.target.value })}
                        className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* Date Field */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      <input
                        type="date"
                        value={form.date}
                        onChange={e => setForm({ ...form, date: e.target.value })}
                        className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Payment Method Field */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Payment Method</label>
                    <select
                      value={form.paymentMethod}
                      onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="cash">Cash</option>
                      <option value="credit card">Credit Card</option>
                      <option value="debit card">Debit Card</option>
                      <option value="upi">UPI</option>
                      <option value="bank transfer">Bank Transfer</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Icon Picker */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Icon</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="flex items-center justify-center w-10 h-10 text-xl bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        {form.icon}
                      </button>
                      {showEmojiPicker && (
                        <div className="absolute z-50 mt-1">
                          <EmojiPicker 
                            onEmojiClick={(emojiData) => {
                              setForm({ ...form, icon: emojiData.emoji });
                              setShowEmojiPicker(false);
                            }}
                            width={280}
                            height={350}
                            theme="light"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Preview Icon */}
                  <div className="pt-2">
                    <p className="text-xs text-gray-500 mb-1">Preview:</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getExpenseIcon(form.category) || form.icon}</span>
                      <span className="text-sm font-medium">{form.category || 'Expense'}</span>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-2 pt-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 flex items-center"
                    >
                      {isSubmitting ? (
                        <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></span>
                      ) : null}
                      {editingExpense ? 'Update' : 'Add'} Expense
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Expense;
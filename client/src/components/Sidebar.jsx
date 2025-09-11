// src/components/Sidebar.jsx
import { FiHome, FiDollarSign, FiPieChart, FiLogOut, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ username }) => {
  const navigate = useNavigate();

  const navItems = [
    { icon: <FiHome size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FiDollarSign size={20} />, label: 'Income', path: '/income' },
    { icon: <FiPieChart size={20}/>, label: 'Expenses', path: '/expenses' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed">
      {/* Logo */}
      <div className="p-5 border-b border-gray-100">
        <h1 className="text-xl font-bold text-indigo-600 flex items-center">
          <span className="bg-indigo-100 p-2 rounded-lg mr-2">
            <FiDollarSign className="text-indigo-600" />
          </span>
          Finance Tracker
        </h1>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-gray-100 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
          <FiUser className="text-indigo-600" />
        </div>
        <div>
          <p className="font-medium text-gray-800">{username || 'User'}</p>
          <p className="text-xs text-gray-500">Premium Member</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center p-3 rounded-lg transition-all ${
              window.location.pathname === item.path
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center p-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <FiLogOut className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
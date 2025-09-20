// src/components/Sidebar.jsx
import { FiHome, FiDollarSign, FiPieChart, FiLogOut, FiUser, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ username, isOpen, onClose }) => {
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

  const handleNavigation = (path) => {
    navigate(path);
    // Close sidebar on mobile after navigation
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:fixed lg:top-0 lg:left-0 lg:h-screen lg:z-auto
      `}>
        {/* Mobile Close Button */}
        <div className="lg:hidden absolute top-4 right-4">
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Logo */}
        <div className="p-5 border-b border-gray-100">
          <h1 className="text-xl font-bold text-indigo-600 flex items-center">
            <span className="bg-indigo-100 p-2 rounded-lg mr-2">
              <FiDollarSign className="text-indigo-600" />
            </span>
            <span className="hidden sm:inline">Finance Tracker</span>
            <span className="sm:hidden">FT</span>
          </h1>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-100 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <FiUser className="text-indigo-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-gray-800 truncate">{username || 'User'}</p>
            <p className="text-xs text-gray-500">Premium Member</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 flex-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center p-3 rounded-lg transition-all ${
                window.location.pathname === item.path
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              <span className="mr-3 flex-shrink-0">{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <FiLogOut className="mr-3 flex-shrink-0" />
            <span className="truncate">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
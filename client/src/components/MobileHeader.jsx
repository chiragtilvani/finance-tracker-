// src/components/MobileHeader.jsx
import { FiMenu, FiDollarSign } from 'react-icons/fi';

const MobileHeader = ({ onMenuToggle, title = "Dashboard" }) => {
  return (
    <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
      {/* Menu Button */}
      <button
        onClick={onMenuToggle}
        className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
      >
        <FiMenu size={24} />
      </button>

      {/* Logo/Title */}
      <div className="flex items-center">
        <span className="bg-indigo-100 p-1.5 rounded-lg mr-2">
          <FiDollarSign className="text-indigo-600" size={16} />
        </span>
        <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
      </div>

      {/* Placeholder for balance or other info */}
      <div className="w-10"></div>
    </div>
  );
};

export default MobileHeader;

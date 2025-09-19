

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();

  
  useEffect(() => {
    document.body.classList.add('bg-gradient-animate');
    return () => document.body.classList.remove('bg-gradient-animate');
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch( import.meta.env.VITE_BACKEND_URL+'/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      const data = await res.json();
      
      if (data.success) {
        navigate('/login');
      } else {
        setShake(true);
        setTimeout(() => setShake(false), 500);
        throw new Error(data.message || 'Signup failed');
      }
    } catch (err) {
      const errorEl = document.createElement('div');
      errorEl.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg transform translate-x-full opacity-0 animate-slide-in';
      errorEl.textContent = err.message;
      document.body.appendChild(errorEl);
      
      setTimeout(() => {
        errorEl.classList.replace('animate-slide-in', 'animate-fade-out');
        setTimeout(() => errorEl.remove(), 500);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      
      <div className="fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-100 opacity-10 animate-float-1"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-purple-100 opacity-10 animate-float-2"></div>
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full bg-blue-100 opacity-10 animate-float-3"></div>
      </div>

      <div 
        className={`relative z-10 w-full max-w-md md:max-w-lg bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 transition-all duration-500 ${shake ? 'animate-shake' : ''}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
       
        <div className={`absolute inset-0 rounded-2xl border-2 pointer-events-none transition-all duration-700 ease-in-out ${isHovering ? 'border-indigo-200 opacity-100' : 'border-transparent opacity-0'}`}></div>
        
       
        <div className={`transition-transform duration-500 ease-out ${isHovering ? 'transform -translate-y-1' : ''}`}>
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-indigo-50 flex items-center justify-center transition-all duration-300 hover:bg-indigo-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 md:h-8 md:w-8 text-indigo-600 transition-transform duration-300 hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 transition-colors duration-300 hover:text-indigo-600">
              Create Account
            </h1>
            <p className="text-gray-500 text-sm md:text-base">Join Finance Tracker to manage your money</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 transition-colors duration-300 hover:text-indigo-600">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-gray-700 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-300 hover:border-indigo-200 hover:shadow-sm"
                placeholder="Choose a username"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 transition-colors duration-300 hover:text-indigo-600">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-gray-700 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-300 hover:border-indigo-200 hover:shadow-sm"
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 transition-colors duration-300 hover:text-indigo-600">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 text-gray-700 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-300 hover:border-indigo-200 hover:shadow-sm pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors duration-300"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <label className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-300 cursor-pointer">
                <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-300 transition-colors duration-300" required />
                <span className="ml-2 text-sm">I agree to the <a href="#" className="text-indigo-600 hover:underline">Terms & Conditions</a></span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 md:py-4 px-4 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all duration-300 shadow hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0 ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm md:text-base">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-300">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>

      
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes slide-in {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
        @keyframes fade-out {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-fade-out {
          animation: fade-out 0.5s ease-out forwards;
        }
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, 20px) rotate(5deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-15px, 15px) rotate(-3deg); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(10px, -10px) rotate(2deg); }
        }
        .animate-float-1 { animation: float-1 15s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 18s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 12s ease-in-out infinite; }
        .bg-gradient-animate {
          background: linear-gradient(-45deg, #f3f4f6, #e5e7eb, #f0fdf4, #ecfdf5);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}

export default Signup;
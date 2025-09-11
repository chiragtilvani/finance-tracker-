import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import Dashboard from './pages/Dashboard';

import HomePage from '@/pages/Home';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import Income from '@/pages/Income';
import Expense  from '@/pages/Expense'
// import DashboardHome from './pages/DashboardHome';

function App() {
  return (
  

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />}>
        </Route>
        <Route path="/income" element={<Income />} />
        <Route path="/expenses" element={<Expense />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
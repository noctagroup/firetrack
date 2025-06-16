import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Processamentos from '../pages/Processamentos';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Processamentos />} />
      </Routes>
    </Router>
  );
}
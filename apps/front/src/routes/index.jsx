import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Processamentos from '../pages/Processamentos';
import SelecioneProduto from '../pages/SelecioneProduto';
import BaseHeader from '../components/BaseHeader';
import SelecionePeriodo from '../pages/SelecionePeriodo';
import SelecioneAOI from '../pages/SelecioneAoi';
import ConfirmarProcessamento from '../pages/ConfirmarProcessamento';
import AnaliseVisual from '../pages/AnaliseVisual';
import Login from '../pages/Login';
import { useAuth } from '../store/AuthProvider';
import { Navigate } from 'react-router-dom';
import LoadingComponent from '../components/LoadingComponent';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  console.log("PrivateRoute user:", user);
  return user ? children : <Navigate to="/" />;
}


export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <LoadingComponent>
            <BaseHeader>
              <Login />
            </BaseHeader>
          </LoadingComponent>
        } />
        <Route path="/processamentos" element={
          <PrivateRoute>
            <LoadingComponent>
              <BaseHeader>
                <Processamentos />
              </BaseHeader>
            </LoadingComponent>
          </PrivateRoute>
        } />
        <Route path="/selecione-produto" element={
          <PrivateRoute>
            <BaseHeader>
              <SelecioneProduto />
            </BaseHeader>
          </PrivateRoute>
        } />
        <Route path="/selecione-periodo" element={
          <PrivateRoute>
            <BaseHeader>
              <SelecionePeriodo />
            </BaseHeader>
          </PrivateRoute>
        } />
        <Route path="/selecione-aoi" element={
          <PrivateRoute>
            <BaseHeader>
              <SelecioneAOI />
            </BaseHeader>
          </PrivateRoute>
        } />
        <Route path="/confirmar" element={
          <PrivateRoute>
            <BaseHeader>
              <ConfirmarProcessamento />
            </BaseHeader>
          </PrivateRoute>
        } />
        <Route path="/analise-visual" element={
            <BaseHeader>
              <AnaliseVisual />
            </BaseHeader>
        } />
      </Routes>
    </Router>
  );
}

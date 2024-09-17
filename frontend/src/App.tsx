import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

interface LoginHandlerProps {
  onLogin: (login: string, senha: string) => Promise<{ success: boolean; token?: string; role?: string }>;
}

console.log('User Role Stored:', localStorage.getItem('userRole'));

const LoginHandler: React.FC<LoginHandlerProps> = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleLogin = async (login: string, senha: string): Promise<{ success: boolean; role?: string }> => {
    const result = await onLogin(login, senha);
    if (result.success) {
      localStorage.setItem('token', result.token || '');
      localStorage.setItem('userRole', result.role || '');
      navigate('/tickets');console.log('Handle Login Called:', result);

    }
    return result;
  };

  return <LoginPage onLogin={handleLogin} />;
};

const PrivateRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  return isAuthenticated ? <>{element}</> : <Navigate to="/" />;
};

const App: React.FC = () => {
  const handleLogin = async (login: string, senha: string): Promise<{ success: boolean; token?: string; role?: string }> => {
    console.log('Tentando login com:', login, senha);

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password: senha }),
      });

      const data = await response.json();

      if (data.token) {
        console.log('Login bem-sucedido, Token:', data.token);
        return { success: true, token: data.token, role: data.role };
      } else {
        console.error('Erro de autenticação:', data.erro);
        return { success: false };
      }
    } catch (error) {
      console.error('Erro na requisição de login:', error);
      return { success: false };
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/tickets" element={<PrivateRoute element={<HomePage />} />} />
        <Route path="/" element={<LoginHandler onLogin={handleLogin} />} />
      </Routes>
    </Router>
  );
};

export default App;

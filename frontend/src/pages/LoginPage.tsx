import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (login: string, senha: string) => Promise<{ success: boolean; role?: string }>;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = await onLogin(login, senha);
    if (!result.success) {
      setError('Usuário ou senha incorretos');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex flex-col justify-center items-center w-1/2 bg-[#f1f5f9] p-12">
        <div className="max-w-md w-full p-8">
          <h2 className="text-2xl font-bold text-custom-blue mb-4">Entre na sua conta</h2>
          <p className="text-gray-600 mb-6">
            Boas-vindas! Por favor, insira suas credenciais para acessar os sistemas da Comigo.
          </p>
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-800 border border-red-300 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                id="login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite seu login"
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                id="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite sua senha"
              />
            </div>
            <div className="flex items-center justify-between mb-6">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox text-blue-600"
                />
                <span className="ml-2 text-gray-700">Mantenha-me conectado.</span>
              </label>
              <a href="#" className="text-sm text-blue-600 underline">Esqueci minha senha</a>
            </div>

            <button
              type="submit"
              className="w-full bg-custom-blue text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
      <div className="w-1/2 bg-custom-blue flex items-center justify-center">
        <img
          src="/images/login-image.png"
          alt="Login Image"
          className="max-w-lg"
        />
      </div>
    </div>
  );
};

export default LoginPage;

import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const initialForm = {
  nome: '',
  email: '',
  senha: '',
};

function App() {
  const [mode, setMode] = useState('cadastro');
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const endpoint = useMemo(() => {
    return mode === 'cadastro' ? '/api/auth/cadastro' : '/api/auth/login';
  }, [mode]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const requestBody =
        mode === 'cadastro'
          ? {
              nome: form.nome,
              email: form.email,
              senha: form.senha,
            }
          : {
              email: form.email,
              senha: form.senha,
            };

      const apiResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await apiResponse.json();

      if (!apiResponse.ok) {
        throw new Error(data?.message || data?.erro || 'Não foi possível concluir a solicitação.');
      }

      setStatus({
        type: 'success',
        message: mode === 'cadastro' ? 'Cadastro realizado com sucesso.' : 'Login realizado com sucesso.',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    setStatus({ type: '', message: '' });
  }

  return (
    <main className="page">
      <section className="auth-panel" aria-labelledby="auth-title">
        <div className="brand-block">
          <p className="eyebrow">Lions Bet</p>
          <h1 id="auth-title">{mode === 'cadastro' ? 'Criar conta' : 'Entrar na conta'}</h1>
        </div>

        <div className="mode-switch" role="tablist" aria-label="Escolha o fluxo de autenticação">
          <button
            type="button"
            className={mode === 'cadastro' ? 'active' : ''}
            onClick={() => changeMode('cadastro')}
            aria-selected={mode === 'cadastro'}
            role="tab"
          >
            Cadastro
          </button>
          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            onClick={() => changeMode('login')}
            aria-selected={mode === 'login'}
            role="tab"
          >
            Login
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'cadastro' && (
            <label htmlFor="nome">
              Nome
              <input
                id="nome"
                name="nome"
                type="text"
                value={form.nome}
                onChange={handleChange}
                placeholder="Seu nome"
                autoComplete="name"
                required
              />
            </label>
          )}

          <label htmlFor="email">
            Email
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="voce@email.com"
              autoComplete="email"
              required
            />
          </label>

          <label htmlFor="senha">
            Senha
            <input
              id="senha"
              name="senha"
              type="password"
              value={form.senha}
              onChange={handleChange}
              placeholder="Sua senha"
              autoComplete={mode === 'cadastro' ? 'new-password' : 'current-password'}
              required
            />
          </label>

          <button className="submit-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : mode === 'cadastro' ? 'Cadastrar' : 'Entrar'}
          </button>
        </form>

        {status.message && (
          <p className={`status-message ${status.type}`} role="status">
            {status.message}
          </p>
        )}
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);

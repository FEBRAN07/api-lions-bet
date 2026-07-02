import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API_BASE_URL = 'https://api-lions-bet.onrender.com';

const initialForm = {
  nome: '',
  email: '',
  senha: '',
};

const authStorageKeys = {
  token: 'lionsbet_token',
  usuario: 'lionsbet_usuario',
};

function getStoredUsuario() {
  const storedUsuario = localStorage.getItem(authStorageKeys.usuario);

  if (!storedUsuario) {
    return null;
  }

  try {
    return JSON.parse(storedUsuario);
  } catch {
    localStorage.removeItem(authStorageKeys.usuario);
    return null;
  }
}

function App() {
  const [currentPage, setCurrentPage] = useState('auth');
  const [mode, setMode] = useState('cadastro');
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usuario, setUsuario] = useState(getStoredUsuario);
  const [eventos, setEventos] = useState([]);
  const [eventosStatus, setEventosStatus] = useState({ type: 'idle', message: '' });

  const endpoint = useMemo(() => {
    return mode === 'cadastro' ? `${API_BASE_URL}/api/auth/cadastro` : `${API_BASE_URL}/api/auth/login`;
  }, [mode]);

  useEffect(() => {
    if (currentPage !== 'eventos') {
      return;
    }

    async function loadEventos() {
      setEventosStatus({ type: 'loading', message: '' });

      try {
        const apiResponse = await fetch(`${API_BASE_URL}/api/eventos`);
        const data = await apiResponse.json();

        if (!apiResponse.ok) {
          throw new Error(data?.message || data?.erro || 'Não foi possível carregar os eventos.');
        }

        setEventos(Array.isArray(data?.eventos) ? data.eventos : []);
        setEventosStatus({ type: 'success', message: '' });
      } catch (error) {
        setEventos([]);
        setEventosStatus({ type: 'error', message: error.message });
      }
    }

    loadEventos();
  }, [currentPage]);

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

      if (!data?.token || !data?.usuario) {
        throw new Error('Resposta de autenticação inválida.');
      }

      localStorage.setItem(authStorageKeys.token, data.token);
      localStorage.setItem(authStorageKeys.usuario, JSON.stringify(data.usuario));
      setUsuario(data.usuario);
      setForm(initialForm);

      setStatus({
        type: 'success',
        message:
          mode === 'cadastro'
            ? 'Cadastro realizado com sucesso. Sessão salva.'
            : 'Login realizado com sucesso. Sessão salva.',
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

  function handleLogout() {
    localStorage.removeItem(authStorageKeys.token);
    localStorage.removeItem(authStorageKeys.usuario);
    setUsuario(null);
    setStatus({ type: '', message: '' });
  }

  return (
    <main className="page">
      <section className={currentPage === 'eventos' ? 'app-panel events-panel' : 'app-panel'} aria-labelledby={currentPage === 'eventos' ? 'events-title' : 'auth-title'}>
        <nav className="app-nav" aria-label="Navegação principal">
          <button
            type="button"
            className={currentPage === 'auth' ? 'active' : ''}
            onClick={() => setCurrentPage('auth')}
          >
            Conta
          </button>
          <button
            type="button"
            className={currentPage === 'eventos' ? 'active' : ''}
            onClick={() => setCurrentPage('eventos')}
          >
            Eventos
          </button>
        </nav>

        {currentPage === 'auth' ? (
          <>
        <div className="brand-block">
          <p className="eyebrow">Lions Bet</p>
          <h1 id="auth-title">{mode === 'cadastro' ? 'Criar conta' : 'Entrar na conta'}</h1>
          {usuario && <p className="session-info">Sessão ativa: {usuario.nome}</p>}
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

        {usuario && (
          <button className="logout-button" type="button" onClick={handleLogout}>
            Sair
          </button>
        )}
          </>
        ) : (
          <section className="events-page" aria-labelledby="events-title">
            <div className="brand-block">
              <p className="eyebrow">Eventos abertos</p>
              <h1 id="events-title">Escolha uma partida</h1>
            </div>

            {eventosStatus.type === 'loading' && <p className="events-state">Carregando eventos...</p>}

            {eventosStatus.type === 'error' && (
              <p className="status-message error" role="status">
                {eventosStatus.message}
              </p>
            )}

            {eventosStatus.type === 'success' && eventos.length === 0 && (
              <p className="events-state">Nenhum evento aberto no momento.</p>
            )}

            {eventos.length > 0 && (
              <div className="events-list">
                {eventos.map((evento) => (
                  <article className="event-card" key={evento._id}>
                    <div>
                      <p className="event-status">{evento.status}</p>
                      <h2>
                        {evento.mandante} x {evento.visitante}
                      </h2>
                    </div>

                    <div className="odds-grid" aria-label="Odds do evento">
                      <div>
                        <span>{evento.mandante}</span>
                        <strong>{Number(evento.oddMandante).toFixed(2)}</strong>
                      </div>
                      <div>
                        <span>Empate</span>
                        <strong>{Number(evento.oddEmpate).toFixed(2)}</strong>
                      </div>
                      <div>
                        <span>{evento.visitante}</span>
                        <strong>{Number(evento.oddVisitante).toFixed(2)}</strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);

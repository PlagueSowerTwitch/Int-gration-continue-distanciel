import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing-nav">
        <span className="logo">✅ TodoApp</span>
        <div className="nav-actions">
          {user ? (
            <>
              <button className="btn btn-outline" onClick={() => navigate('/todos')}>
                Mes todos
              </button>
              <button className="btn btn-primary" onClick={logout}>
                Déconnexion
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => navigate('/auth')}>
              Connexion
            </button>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">🚀 Déployé avec Docker + Kubernetes</div>
        <h1 className="hero-title">
          Organisez votre vie,<br />
          <span className="gradient-text">une tâche à la fois</span>
        </h1>
        <p className="hero-subtitle">
          Une application full-stack React + Node.js + PostgreSQL, conteneurisée avec Docker
          et orchestrée avec Kubernetes sur Azure.
        </p>
        <div className="hero-cta">
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/auth')}>
            Commencer gratuitement →
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        {[
          { icon: '🔐', title: 'Authentification sécurisée', desc: 'JWT, bcrypt, routes protégées' },
          { icon: '📋', title: 'Gestion de tâches', desc: 'Créer, modifier, supprimer vos todos' },
          { icon: '☁️', title: 'Cloud-native', desc: 'Docker, Kubernetes, Azure VM' },
        ].map((f) => (
          <div key={f.title} className="feature-card card">
            <span className="feature-icon">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>Projet CI/CD scolaire · React · Node.js · PostgreSQL · Docker · K8s · Azure</p>
      </footer>
    </div>
  );
}

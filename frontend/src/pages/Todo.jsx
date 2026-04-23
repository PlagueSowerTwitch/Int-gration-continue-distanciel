import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { api } from '../api/client';
import './Todo.css';

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Chargement initial
  useEffect(() => {
    loadTodos();
  }, []);

  async function loadTodos() {
    try {
      const data = await api.getTodos();
      setTodos(data);
    } catch (err) {
      setError('Impossible de charger les todos');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const todo = await api.createTodo(newTitle.trim());
      setTodos([todo, ...todos]);
      setNewTitle('');
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggle(todo) {
    try {
      const updated = await api.updateTodo(todo.id, { completed: !todo.completed });
      setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleEdit(id) {
    if (!editTitle.trim()) return;
    try {
      const updated = await api.updateTodo(id, { title: editTitle.trim() });
      setTodos(todos.map((t) => (t.id === id ? updated : t)));
      setEditingId(null);
      setEditTitle('');
    } catch (err) {
      setError(err.message);
    }
  }

  const done = todos.filter((t) => t.completed).length;
  const total = todos.length;

  return (
    <div className="todo-layout">
      {/* Header */}
      <header className="todo-header">
        <span className="logo">✅ TodoApp</span>
        <div className="header-right">
          <span className="user-email">👤 {user?.email}</span>
          <button className="btn btn-outline" onClick={() => { logout(); navigate('/'); }}>
            Déconnexion
          </button>
        </div>
      </header>

      <main className="todo-main">
        <div className="todo-card card">
          <h1 className="todo-title">Mes Tâches</h1>

          {/* Progress */}
          {total > 0 && (
            <div className="progress-bar-wrap">
              <div className="progress-label">
                {done} / {total} terminées
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(done / total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleCreate} className="todo-form">
            <input
              type="text"
              placeholder="Nouvelle tâche…"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="todo-input"
            />
            <button type="submit" className="btn btn-primary">
              + Ajouter
            </button>
          </form>

          {error && <p className="error-msg">⚠️ {error}</p>}

          {/* List */}
          {loading ? (
            <p className="loading-text">Chargement…</p>
          ) : todos.length === 0 ? (
            <div className="empty-state">
              <span>📝</span>
              <p>Aucune tâche pour l'instant. Commencez par en créer une !</p>
            </div>
          ) : (
            <ul className="todo-list">
              {todos.map((todo) => (
                <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo)}
                    className="todo-checkbox"
                  />

                  {editingId === todo.id ? (
                    <div className="edit-row">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="edit-input"
                        autoFocus
                      />
                      <button className="btn btn-primary btn-sm" onClick={() => handleEdit(todo.id)}>
                        ✓
                      </button>
                      <button className="btn btn-outline btn-sm" onClick={() => setEditingId(null)}>
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="todo-text">{todo.title}</span>
                      <div className="todo-actions">
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => { setEditingId(todo.id); setEditTitle(todo.title); }}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(todo.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

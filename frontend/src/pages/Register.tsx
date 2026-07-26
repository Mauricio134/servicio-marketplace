import { useState } from "react";

import {
  registerUser,
} from "../api/client";

import "./Register.css";

interface RegisterProps {
  onLogin: () => void;
  onBack: () => void;
}

export default function Register({
  onLogin,
  onBack,
}: RegisterProps) {
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [whatsapp, setWhatsapp] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await registerUser({
        name,
        email,
        password,
        whatsapp,
      });

      onLogin();

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo crear la cuenta.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card register-card">
        <button
          className="auth-back"
          onClick={onBack}
          type="button"
        >
          ← Volver
        </button>

        <div className="auth-heading">
          <span className="auth-label">
            ÚNETE A QHAPAQ
          </span>

          <h1>
            Crea tu
            <span> cuenta.</span>
          </h1>

          <p>
            Forma parte de una comunidad
            donde las necesidades encuentran
            soluciones.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <div className="auth-field">
            <label htmlFor="name">
              Nombre
            </label>

            <input
              id="name"
              type="text"
              placeholder="Tu nombre"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value,
                )
              }
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="email">
              Correo electrónico
            </label>

            <input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value,
                )
              }
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="whatsapp">
              WhatsApp
            </label>

            <input
              id="whatsapp"
              type="tel"
              placeholder="+51 999 999 999"
              value={whatsapp}
              onChange={(event) =>
                setWhatsapp(
                  event.target.value,
                )
              }
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value,
                )
              }
              required
            />
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creando cuenta..."
              : "Crear cuenta"}
          </button>
        </form>

        <div className="auth-footer">
          <span>
            ¿Ya tienes una cuenta?
          </span>

          <button
            type="button"
            onClick={onLogin}
          >
            Inicia sesión
          </button>
        </div>
      </section>
    </main>
  );
}

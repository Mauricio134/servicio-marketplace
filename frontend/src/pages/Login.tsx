import { useState } from "react";

import {
  loginUser,
} from "../api/client";

import "./Login.css";

interface LoginProps {
  onSuccess: () => void;
  onRegister: () => void;
  onBack: () => void;
}

export default function Login({
  onSuccess,
  onRegister,
  onBack,
}: LoginProps) {
  const [email, setEmail] =
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
      const response =
        await loginUser({
          email,
          password,
        });

      localStorage.setItem(
        "qhapaq_token",
        response.token,
      );

      localStorage.setItem(
        "qhapaq_user",
        JSON.stringify(
          response.user,
        ),
      );
      onSuccess();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo iniciar sesión.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <button
          className="auth-back"
          onClick={onBack}
          type="button"
        >
          ← Volver
        </button>

        <div className="auth-heading">
          <span className="auth-label">
            QHAPAQ
          </span>

          <h1>
            Bienvenido
            <span> de vuelta.</span>
          </h1>

          <p>
            Ingresa a tu cuenta para
            continuar.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
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
              ? "Ingresando..."
              : "Iniciar sesión"}
          </button>
        </form>

        <div className="auth-footer">
          <span>
            ¿Todavía no tienes una cuenta?
          </span>

          <button
            type="button"
            onClick={onRegister}
          >
            Regístrate
          </button>
        </div>
      </section>
    </main>
  );
}

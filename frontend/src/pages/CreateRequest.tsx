import { useState } from "react";

import {
  createPost,
} from "../api/client";

import "./CreateRequest.css";

interface CreateRequestProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function CreateRequest({
  onBack,
  onSuccess,
}: CreateRequestProps) {
  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [minBudget, setMinBudget] =
    useState("");

  const [maxBudget, setMaxBudget] =
    useState("");

  const [estimatedTime, setEstimatedTime] =
    useState("");

  const [location, setLocation] =
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

    const token =
      localStorage.getItem(
        "qhapaq_token",
      );

    if (!token) {
      setError(
        "No hay una sesión activa.",
      );

      setLoading(false);

      return;
    }

    try {
      await createPost(
        {
          title,
          description,
          type: "REQUEST",
          minBudget: minBudget
            ? Number(minBudget)
            : undefined,
          maxBudget: maxBudget
            ? Number(maxBudget)
            : undefined,
          estimatedTime: estimatedTime
            ? Number(estimatedTime)
            : undefined,
          location: location || undefined,
        },
        token,
      );

      onSuccess();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo crear la necesidad.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="create-request-page">
      <div className="create-request-container">
        <button
          className="create-request-back"
          onClick={onBack}
          type="button"
        >
          ← Volver
        </button>

        <header className="create-request-header">
          <span className="create-request-label">
            NUEVA PUBLICACIÓN
          </span>

          <h1>
            ¿Qué necesitas?
          </h1>

          <p>
            Describe lo que necesitas y
            permite que las personas adecuadas
            te hagan una propuesta.
          </p>
        </header>

        <form
          className="create-request-form"
          onSubmit={handleSubmit}
        >
          <div className="create-request-field">
            <label htmlFor="title">
              Título de la necesidad
            </label>

            <input
              id="title"
              type="text"
              placeholder="Ej. Necesito reparar mi laptop"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              required
            />
          </div>

          <div className="create-request-field">
            <label htmlFor="description">
              Describe lo que necesitas
            </label>

            <textarea
              id="description"
              placeholder="Explica con detalle qué necesitas..."
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value,
                )
              }
              rows={6}
              required
            />
          </div>

          <div className="create-request-budget">
            <div className="create-request-field">
              <label htmlFor="minBudget">
                Presupuesto mínimo
              </label>

              <input
                id="minBudget"
                type="number"
                min="0"
                step="0.01"
                placeholder="S/ 0"
                value={minBudget}
                onChange={(event) =>
                  setMinBudget(
                    event.target.value,
                  )
                }
              />
            </div>

            <div className="create-request-field">
              <label htmlFor="maxBudget">
                Presupuesto máximo
              </label>

              <input
                id="maxBudget"
                type="number"
                min="0"
                step="0.01"
                placeholder="S/ 0"
                value={maxBudget}
                onChange={(event) =>
                  setMaxBudget(
                    event.target.value,
                  )
                }
              />
            </div>
          </div>

          <div className="create-request-field">
            <label htmlFor="estimatedTime">
              Tiempo máximo para realizarlo
            </label>

            <input
              id="estimatedTime"
              type="number"
              min="1"
              step="1"
              placeholder="Ej. 7 días"
              value={estimatedTime}
              onChange={(event) =>
                setEstimatedTime(
                  event.target.value,
                )
              }
            />

            <small>
              Indica cuántos días tienes disponibles para recibir el servicio.
            </small>
          </div>

          <div className="create-request-field">
            <label htmlFor="location">
              Ubicación
            </label>

            <input
              id="location"
              type="text"
              placeholder="Ej. Arequipa, Perú"
              value={location}
              onChange={(event) =>
                setLocation(
                  event.target.value,
                )
              }
            />
          </div>

          {error && (
            <div className="create-request-error">
              {error}
            </div>
          )}

          <div className="create-request-actions">
            <button
              className="create-request-cancel"
              type="button"
              onClick={onBack}
            >
              Cancelar
            </button>

            <button
              className="create-request-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Publicando..."
                : "Publicar necesidad"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

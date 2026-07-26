import { useEffect, useState } from "react";

import {
  createOffer,
  getPostById,
  type Post,
} from "../api/client";

import "./PostDetails.css";

interface PostDetailsProps {
  postId: string;
  token: string;
  onBack: () => void;
  onSuccess: () => void;
}

export default function PostDetails({
  postId,
  token,
  onBack,
  onSuccess,
}: PostDetailsProps) {
  const [post, setPost] =
    useState<Post | null>(null);

  const [price, setPrice] =
    useState("");

  const [estimatedTime, setEstimatedTime] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadPost() {
      try {
        setLoading(true);

        const data =
          await getPostById(postId);

        setPost(data);
      } catch (error) {
        console.error(error);

        setError(
          "No se pudo cargar la necesidad.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [postId]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!price || !estimatedTime || !message) {
      setError(
        "Completa todos los campos de la oferta.",
      );

      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await createOffer(
        postId,
        {
          price: Number(price),
          estimatedTime: Number(
            estimatedTime,
          ),
          message,
        },
        token,
      );

      onSuccess();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo enviar la oferta.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="post-details-page">
        <div className="post-details-container">
          <p>Cargando necesidad...</p>
        </div>
      </main>
    );
  }

  if (error && !post) {
    return (
      <main className="post-details-page">
        <div className="post-details-container">
          <button
            className="post-details-back"
            type="button"
            onClick={onBack}
          >
            ← Volver
          </button>

          <div className="post-details-error">
            {error}
          </div>
        </div>
      </main>
    );
  }

  if (!post) {
    return null;
  }

  const isClosed =
    post.status === "CLOSED";

  return (
    <main className="post-details-page">
      <div className="post-details-container">
        <button
          className="post-details-back"
          type="button"
          onClick={onBack}
        >
          ← Volver a explorar
        </button>

        <div className="post-details-layout">
          <section className="post-details-content">
            <div className="post-details-top">
              <span className="post-details-label">
                NECESITA UN SERVICIO
              </span>

              <span
                className={`post-details-status ${
                  isClosed
                    ? "closed"
                    : "active"
                }`}
              >
                {isClosed
                  ? "CERRADA"
                  : "ACTIVA"}
              </span>
            </div>

            <h1>{post.title}</h1>

            <p className="post-details-description">
              {post.description}
            </p>

            <div className="post-details-info">
              {post.minBudget !== null &&
                post.maxBudget !== null && (
                  <div>
                    <span>
                      PRESUPUESTO
                    </span>

                    <strong>
                      S/ {post.minBudget} — S/{" "}
                      {post.maxBudget}
                    </strong>
                  </div>
                )}

              {post.location && (
                <div>
                  <span>
                    UBICACIÓN
                  </span>

                  <strong>
                    ⌖ {post.location}
                  </strong>
                </div>
              )}

              {post.estimatedTime !== null &&
                post.estimatedTime !== undefined && (
                  <div>
                    <span>
                      TIEMPO MÁXIMO
                    </span>

                    <strong>
                      ⏱ {post.estimatedTime} días
                    </strong>
                  </div>
                )}
            </div>

            {post.user && (
              <div className="post-details-author">
                <span>
                  PUBLICADO POR
                </span>

                <strong>
                  {post.user.name}
                </strong>
              </div>
            )}
          </section>

          {!isClosed && (
            <section className="offer-card">
              <div className="offer-card-heading">
                <span className="offer-card-label">
                  ¿PUEDES AYUDAR?
                </span>

                <h2>
                  Envía tu oferta.
                </h2>

                <p>
                  Cuéntale a esta persona
                  cómo puedes ayudarla.
                </p>
              </div>

              <form
                className="offer-form"
                onSubmit={handleSubmit}
              >
                <div className="offer-field">
                  <label htmlFor="price">
                    Precio de tu servicio
                  </label>

                  <div className="offer-input-with-prefix">
                    <span>S/</span>

                    <input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={price}
                      onChange={(event) =>
                        setPrice(
                          event.target.value,
                        )
                      }
                      required
                    />
                  </div>
                </div>

                <div className="offer-field">
                  <label htmlFor="estimatedTime">
                    Tiempo estimado
                  </label>

                  <input
                    id="estimatedTime"
                    type="number"
                    min="1"
                    placeholder="Ej. 3"
                    value={estimatedTime}
                    onChange={(event) =>
                      setEstimatedTime(
                        event.target.value,
                      )
                    }
                    required
                  />

                  <small>
                    Indica el tiempo estimado
                    en días.
                  </small>
                </div>

                <div className="offer-field">
                  <label htmlFor="message">
                    Mensaje
                  </label>

                  <textarea
                    id="message"
                    placeholder="Explica cómo puedes ayudar..."
                    value={message}
                    onChange={(event) =>
                      setMessage(
                        event.target.value,
                      )
                    }
                    rows={5}
                    required
                  />
                </div>

                {error && (
                  <div className="offer-error">
                    {error}
                  </div>
                )}

                <button
                  className="offer-submit"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting
                    ? "Enviando..."
                    : "Enviar oferta"}
                </button>
              </form>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

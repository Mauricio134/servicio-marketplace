import { useEffect, useState } from "react";

import {
  createOffer,
  deleteOffer,
  getOffers,
  getPostById,
  updateOffer,
  type Post,
} from "../api/client";

import "./PostDetails.css";

interface PostDetailsProps {
  postId: string;
  userId: string;
  token: string;
  onBack: () => void;
  onSuccess: () => void;
}

interface Offer {
  id: string;
  userId: string;
  price: number;
  estimatedTime: number;
  message: string;
  status:
    | "PENDING"
    | "INTERESTED"
    | "REJECTED"
    | "ACCEPTED";
}

export default function PostDetails({
  postId,
  userId,
  token,
  onBack,
  onSuccess,
}: PostDetailsProps) {
  const [post, setPost] =
    useState<Post | null>(null);

  const [myOffer, setMyOffer] =
    useState<Offer | null>(null);

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

  const [deleting, setDeleting] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [editingOffer, setEditingOffer] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const [
          postData,
          offersData,
        ] = await Promise.all([
          getPostById(postId),
          getOffers(postId, token),
        ]);

        setPost(postData);

        const offer =
          offersData.find(
            (offer) =>
              offer.userId === userId,
          ) ?? null;

        setMyOffer(offer);

        if (offer) {
          setPrice(
            String(offer.price),
          );

          setEstimatedTime(
            String(
              offer.estimatedTime,
            ),
          );

          setMessage(
            offer.message,
          );
        }
      } catch (error) {
        console.error(
          "ERROR CARGANDO POST U OFERTAS:",
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : "No se pudo cargar la necesidad.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [postId, token]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !price ||
      !estimatedTime ||
      !message
    ) {
      setError(
        "Completa todos los campos de la oferta.",
      );

      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const offer =
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

      setMyOffer(offer);
      setEditingOffer(false);

      onSuccess();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo enviar la oferta.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdateOffer(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !myOffer ||
      !price ||
      !estimatedTime ||
      !message
    ) {
      setError(
        "Completa todos los campos de la oferta.",
      );

      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const updatedOffer =
        await updateOffer(
          myOffer.id,
          {
            price: Number(price),
            estimatedTime: Number(
              estimatedTime,
            ),
            message,
          },
          token,
        );

      setMyOffer(updatedOffer);
      setEditingOffer(false);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la oferta.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteOffer() {
    if (!myOffer) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteOffer(
        myOffer.id,
        token,
      );

      setMyOffer(null);
      setShowDeleteModal(false);
      setEditingOffer(false);
      setPrice("");
      setEstimatedTime("");
      setMessage("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la oferta.",
      );
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <main className="post-details-page">
        <div className="post-details-container">
          <p>
            Cargando necesidad...
          </p>
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

            <h1>
              {post.title}
            </h1>

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
                post.estimatedTime !==
                  undefined && (
                  <div>
                    <span>
                      TIEMPO MÁXIMO
                    </span>

                    <strong>
                      ⏱{" "}
                      {post.estimatedTime}{" "}
                      días
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

          {myOffer ? (
            <section className="offer-card">
              <div className="offer-card-heading">
                <span className="offer-card-label">
                  {myOffer.status ===
                  "ACCEPTED"
                    ? "OFERTA ACEPTADA"
                    : "MI OFERTA"}
                </span>

                <h2>
                  {myOffer.status ===
                  "ACCEPTED"
                    ? "Tu propuesta fue aceptada."
                    : "Ya tienes una oferta para esta necesidad."}
                </h2>

                <p>
                  {myOffer.status ===
                  "ACCEPTED"
                    ? "Esta oferta queda como registro de la propuesta aceptada."
                    : "Puedes modificarla o retirarla cuando quieras."}
                </p>
              </div>

              {!editingOffer && (
                <>
                  <div className="my-offer-details">
                    <div>
                      <span>PRECIO</span>
                      <strong>
                        S/ {myOffer.price}
                      </strong>
                    </div>

                    <div>
                      <span>TIEMPO ESTIMADO</span>
                      <strong>
                        {myOffer.estimatedTime} días
                      </strong>
                    </div>
                  </div>

                  <p className="my-offer-message">
                    {myOffer.message}
                  </p>
                </>
              )}

              {editingOffer ? (
                <form
                  className="offer-form"
                  onSubmit={
                    handleUpdateOffer
                  }
                >
                  <div className="offer-field">
                    <label htmlFor="price">
                      Precio de tu servicio
                    </label>

                    <div className="offer-input-with-prefix">
                      <span>
                        S/
                      </span>

                      <input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={price}
                        onChange={(
                          event,
                        ) =>
                          setPrice(
                            event.target
                              .value,
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
                      value={
                        estimatedTime
                      }
                      onChange={(
                        event,
                      ) =>
                        setEstimatedTime(
                          event.target
                            .value,
                        )
                      }
                      required
                    />

                    <small>
                      Indica el tiempo
                      estimado en días.
                    </small>
                  </div>

                  <div className="offer-field">
                    <label htmlFor="message">
                      Mensaje
                    </label>

                    <textarea
                      id="message"
                      value={message}
                      onChange={(
                        event,
                      ) =>
                        setMessage(
                          event.target
                            .value,
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
                    disabled={
                      submitting
                    }
                  >
                    {submitting
                      ? "Guardando..."
                      : "Guardar cambios"}
                  </button>

                  <button
                    className="my-offer-cancel"
                    type="button"
                    onClick={() =>
                      setEditingOffer(
                        false,
                      )
                    }
                  >
                    Cancelar
                  </button>
                </form>
              ) : (
                <>

                  {error && (
                    <div className="offer-error">
                      {error}
                    </div>
                  )}

                  <div className="my-offer-actions">
                    {myOffer.status !==
                      "ACCEPTED" && (
                      <button
                        className="my-offer-edit"
                        type="button"
                        onClick={() =>
                          setEditingOffer(
                            true,
                          )
                        }
                      >
                        Editar oferta
                      </button>
                    )}

                    {myOffer.status !==
                      "ACCEPTED" && (
                      <button
                        className="my-offer-delete"
                        type="button"
                        onClick={
                          handleDeleteOffer
                        }
                        disabled={deleting}
                      >
                        {deleting
                          ? "Eliminando..."
                          : "Retirar oferta"}
                      </button>
                    )}
                  </div>
                </>
              )}
            </section>
          ) : (
            !isClosed && (
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
                  onSubmit={
                    handleSubmit
                  }
                >
                  <div className="offer-field">
                    <label htmlFor="price">
                      Precio de tu servicio
                    </label>

                    <div className="offer-input-with-prefix">
                      <span>
                        S/
                      </span>

                      <input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={price}
                        onChange={(
                          event,
                        ) =>
                          setPrice(
                            event.target
                              .value,
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
                      value={
                        estimatedTime
                      }
                      onChange={(
                        event,
                      ) =>
                        setEstimatedTime(
                          event.target
                            .value,
                        )
                      }
                      required
                    />

                    <small>
                      Indica el tiempo
                      estimado en días.
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
                      onChange={(
                        event,
                      ) =>
                        setMessage(
                          event.target
                            .value,
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
                    disabled={
                      submitting
                    }
                  >
                    {submitting
                      ? "Enviando..."
                      : "Enviar oferta"}
                  </button>
                </form>
              </section>
            )
          )}
        </div>
      </div>
      {showDeleteModal && myOffer && (
        <div
          className="offer-modal-overlay"
          onClick={() =>
            !deleting &&
            setShowDeleteModal(false)
          }
        >
          <div
            className="offer-confirm-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="offer-modal-icon">
              !
            </div>

            <span className="offer-modal-label">
              CONFIRMAR ACCIÓN
            </span>

            <h2>
              {myOffer.status === "ACCEPTED"
                ? "¿Eliminar esta oferta?"
                : "¿Retirar tu oferta?"}
            </h2>

            <p>
              {myOffer.status === "ACCEPTED"
                ? "Esta oferta ya fue aceptada. El registro será eliminado."
                : "Tu oferta será retirada de esta necesidad."}
            </p>

            <div className="offer-modal-summary">
              <div>
                <span>PRECIO</span>
                <strong>
                  S/ {myOffer.price}
                </strong>
              </div>

              <div>
                <span>TIEMPO ESTIMADO</span>
                <strong>
                  {myOffer.estimatedTime} días
                </strong>
              </div>
            </div>

            <p className="offer-modal-warning">
              Esta acción no se puede deshacer.
            </p>

            <div className="offer-modal-actions">
              <button
                className="offer-modal-cancel"
                type="button"
                disabled={deleting}
                onClick={() =>
                  setShowDeleteModal(false)
                }
              >
                Cancelar
              </button>

              <button
                className="offer-modal-confirm"
                type="button"
                disabled={deleting}
                onClick={() =>
  setShowDeleteModal(true)
}
              >
                {deleting
                  ? "Retirando..."
                  : "Sí, retirar oferta"}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}

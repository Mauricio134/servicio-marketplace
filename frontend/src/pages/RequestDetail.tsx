import { useEffect, useState } from "react";

import {
  getPostById,
  getOffers,
} from "../api/client";

import "./RequestDetail.css";

interface RequestDetailProps {
  postId: string;
  token: string;
  onBack: () => void;
}

interface Post {
  id: string;
  title: string;
  description: string;
  type: "REQUEST" | "SERVICE";
  minBudget: number | null;
  maxBudget: number | null;
  location: string | null;
  estimatedTime?: number | null;
  status?: "ACTIVE" | "CLOSED";
}

interface Offer {
  id: string;
  price: number;
  estimatedTime: number;
  message: string;
  status:
    | "PENDING"
    | "INTERESTED"
    | "REJECTED"
    | "ACCEPTED";
  user: {
    id: string;
    name: string;
    whatsapp?: string | null;
  };
}

export default function RequestDetail({
  postId,
  token,
  onBack,
}: RequestDetailProps) {
  const [request, setRequest] =
    useState<Post | null>(null);

  const [offers, setOffers] =
    useState<Offer[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const [
          requestData,
          offersData,
        ] = await Promise.all([
          getPostById(postId),
          getOffers(postId, token),
        ]);

        setRequest(requestData);
        setOffers(offersData);
      } catch {
        setError(
          "No se pudo cargar la necesidad.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [postId, token]);

  if (loading) {
    return (
      <main className="request-detail-page">
        <div className="request-detail-container">
          Cargando necesidad...
        </div>
      </main>
    );
  }

  if (error || !request) {
    return (
      <main className="request-detail-page">
        <div className="request-detail-container">
          <button
            className="request-detail-back"
            onClick={onBack}
          >
            ← Volver
          </button>

          <p>
            {error ||
              "No se encontró la necesidad."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="request-detail-page">
      <div className="request-detail-container">

        <button
          className="request-detail-back"
          onClick={onBack}
        >
          ← Mis necesidades
        </button>

        <section className="request-detail-header">

          <span className="request-detail-label">
            MI NECESIDAD
          </span>

          <div className="request-detail-status">
            <span />

            {request.status === "CLOSED"
              ? "CERRADA"
              : "ACTIVA"}
          </div>

          <h1>
            {request.title}
          </h1>

          <p>
            {request.description}
          </p>

          <div className="request-detail-info">

            {request.minBudget !== null &&
              request.maxBudget !== null && (
                <span>
                  <strong>S/</strong>

                  {request.minBudget}
                  {" — "}
                  S/
                  {request.maxBudget}
                </span>
              )}

            {request.location && (
              <span>
                <strong>⌖</strong>

                {request.location}
              </span>
            )}

            {request.estimatedTime !== null &&
              request.estimatedTime !== undefined && (
                <span>
                  <strong>⏱</strong>

                  Máximo{" "}
                  {request.estimatedTime} días
                </span>
              )}

          </div>
        </section>

        <section className="offers-section">

          <div className="offers-header">
            <div>
              <span className="offers-label">
                PROPUESTAS RECIBIDAS
              </span>

              <h2>
                Ofertas para esta necesidad
              </h2>
            </div>

            <span className="offers-count">
              {offers.length}
            </span>
          </div>

          {offers.length === 0 && (
            <div className="offers-empty">
              <h3>
                Todavía no has recibido ofertas.
              </h3>

              <p>
                Cuando alguien vea tu necesidad
                y quiera ayudarte, su propuesta
                aparecerá aquí.
              </p>
            </div>
          )}

          {offers.length > 0 && (
            <div className="offers-list">
              {offers.map((offer) => (
                <article
                  className="offer-card"
                  key={offer.id}
                >
                  <div className="offer-card-header">
                    <div>
                      <span className="offer-label">
                        PROPUESTA DE
                      </span>

                      <h3>
                        {offer.user.name}
                      </h3>
                    </div>

                    <span
                      className={`offer-status offer-status-${offer.status.toLowerCase()}`}
                    >
                      {offer.status}
                    </span>
                  </div>

                  <div className="offer-details">
                    <div>
                      <span>Precio</span>

                      <strong>
                        S/ {offer.price}
                      </strong>
                    </div>

                    <div>
                      <span>Tiempo estimado</span>

                      <strong>
                        {offer.estimatedTime} días
                      </strong>
                    </div>
                  </div>

                  <p className="offer-message">
                    {offer.message}
                  </p>

                  <button className="offer-view-button">
                    Ver propuesta →
                  </button>
                </article>
              ))}
            </div>
          )}

        </section>
      </div>
    </main>
  );
}

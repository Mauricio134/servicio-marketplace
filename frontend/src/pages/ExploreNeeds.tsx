import { useEffect, useState } from "react";

import {
  getPosts,
  type Post,
} from "../api/client";

import "./ExploreNeeds.css";

interface ExploreNeedsProps {
  userId: string;
  onOpen: (postId: string) => void;
  onBack: () => void;
}

export default function ExploreNeeds({
  userId,
  onOpen,
  onBack,
}: ExploreNeedsProps) {
  const [requests, setRequests] =
    useState<Post[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadRequests() {
      try {
        setLoading(true);
        setError("");

        const posts =
          await getPosts();

        const otherRequests =
          posts.filter(
            (post) =>
              post.type === "REQUEST" &&
              post.user?.id !== userId,
          );

        setRequests(
          otherRequests,
        );
      } catch (error) {
        console.error(error);

        setError(
          "No se pudieron cargar las necesidades.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, [userId]);

  return (
    <main className="explore-needs-page">
      <div className="explore-needs-container">
        <header className="explore-needs-header">
          <div>
            <button
              className="explore-needs-back"
              type="button"
              onClick={onBack}
            >
              ← Volver
            </button>

            <span className="explore-needs-label">
              EXPLORAR
            </span>

            <h1>
              Necesidades de{" "}
              <span>
                otras personas.
              </span>
            </h1>

            <p>
              Descubre lo que otras personas
              necesitan y encuentra oportunidades
              para ofrecer tus habilidades.
            </p>
          </div>
        </header>

        {loading && (
          <div className="explore-needs-state">
            Cargando necesidades...
          </div>
        )}

        {error && (
          <div className="explore-needs-state explore-needs-error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          requests.length === 0 && (
            <section className="explore-needs-empty">
              <div className="explore-empty-symbol">
                ◈
              </div>

              <h2>
                No hay necesidades disponibles
                por ahora.
              </h2>

              <p>
                Cuando otras personas publiquen
                una necesidad, aparecerá aquí.
              </p>
            </section>
          )}

        {!loading &&
          !error &&
          requests.length > 0 && (
            <section className="explore-needs-grid">
              {requests.map(
                (request) => {
                  const isClosed =
                    request.status ===
                    "CLOSED";

                  return (
                    <article
                      className={`explore-need-card ${
                        isClosed
                          ? "explore-need-card-closed"
                          : ""
                      }`}
                      key={request.id}
                      onClick={() =>
                        onOpen(
                          request.id,
                        )
                      }
                    >
                      <div className="explore-need-card-top">
                        <span className="explore-need-card-label">
                          NECESITA UN SERVICIO
                        </span>

                        <span
                          className={`explore-need-status ${
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

                      <h2>
                        {request.title}
                      </h2>

                      <p>
                        {
                          request.description
                        }
                      </p>

                      <div className="explore-need-info">
                        {request.minBudget !== null &&
                          request.maxBudget !== null && (
                            <span>
                              <strong>S/</strong>{" "}
                              {request.minBudget} — S/{" "}
                              {request.maxBudget}
                            </span>
                          )}

                        {request.estimatedTime !== null &&
                          request.estimatedTime !== undefined && (
                            <span>
                              <strong>⏱</strong>{" "}
                              Máximo {request.estimatedTime} días
                            </span>
                          )}

                        {request.location && (
                          <span>
                            <strong>⌖</strong>{" "}
                            {request.location}
                          </span>
                        )}
                      </div>

                      <div className="explore-need-footer">
                        <span>
                          Ver necesidad y ofrecer
                        </span>

                        <span className="explore-need-arrow">
                          →
                        </span>
                      </div>
                    </article>
                  );
                },
              )}
            </section>
          )}
      </div>
    </main>
  );
}

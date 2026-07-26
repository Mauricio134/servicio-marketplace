import { useEffect, useState } from "react";

import { getPosts, type Post } from "../api/client";

import "./MyRequests.css";

interface MyRequestsProps {
  userId: string;
  onCreate: () => void;
  onOpen: (postId: string) => void;
  onBack: () => void;
}

export default function MyRequests({
  userId,
  onCreate,
  onOpen,
  onBack,
}: MyRequestsProps) {
  const [requests, setRequests] = useState<Post[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRequests() {
      try {
        setLoading(true);
        setError("");

        const posts = await getPosts();

        const ownRequests = posts.filter(
          (post) => post.type === "REQUEST" && post.user?.id === userId,
        );

        setRequests(ownRequests);
      } catch (error) {
        console.error(error);

        setError("No se pudieron cargar tus necesidades.");
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, [userId]);

  return (
    <main className="my-requests-page">
      <div className="my-requests-container">
        <header className="my-requests-header">
          <div>
            <button className="my-requests-back" type="button" onClick={onBack}>
              ← Volver
            </button>

            <h1>
              Mis <span>necesidades.</span>
            </h1>

            <p>
              Aquí puedes gestionar las necesidades que has publicado y revisar
              las ofertas que recibas.
            </p>
          </div>

          <button
            className="my-requests-create"
            type="button"
            onClick={onCreate}
          >
            <span>+</span>
            Nueva necesidad
          </button>
        </header>

        {loading && (
          <div className="my-requests-state">Cargando tus necesidades...</div>
        )}

        {error && (
          <div className="my-requests-state my-requests-error">{error}</div>
        )}

        {!loading && !error && requests.length === 0 && (
          <section className="my-requests-empty">
            <div className="empty-symbol">+</div>

            <h2>Todavía no has publicado ninguna necesidad.</h2>

            <p>
              Cuenta qué necesitas y deja que las personas adecuadas te hagan
              una propuesta.
            </p>

            <button
              type="button"
              onClick={onCreate}
              className="my-requests-empty-button"
            >
              Publicar mi primera necesidad
            </button>
          </section>
        )}

        {!loading && !error && requests.length > 0 && (
          <section className="my-requests-grid">
            {requests.map((request) => {
              const isClosed = request.status === "CLOSED";

              return (
                <article
                  className={`request-card ${
                    isClosed ? "request-card-closed" : ""
                  }`}
                  key={request.id}
                  onClick={() => onOpen(request.id)}
                >
                  <div className="request-card-top">
                    <span className="request-card-label">
                      NECESITO UN SERVICIO
                    </span>

                    <span
                      className={`request-status ${
                        isClosed ? "closed" : "active"
                      }`}
                    >
                      {isClosed ? "CERRADA" : "ACTIVA"}
                    </span>
                  </div>

                  <h2>{request.title}</h2>

                  <p>{request.description}</p>

                  <div className="request-card-info">
                    {request.minBudget !== null &&
                      request.maxBudget !== null && (
                        <span>
                          <strong>S/</strong> {request.minBudget} — S/{" "}
                          {request.maxBudget}
                        </span>
                      )}

                    {request.location && (
                      <span>
                        <strong>⌖</strong> {request.location}
                      </span>
                    )}
                  </div>

                  <div className="request-card-footer">
                    <span>Ver necesidad</span>

                    <span className="request-card-arrow">→</span>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

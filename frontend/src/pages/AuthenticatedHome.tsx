import "./AuthenticatedHome.css";

interface AuthenticatedHomeProps {
  onMyRequests: () => void;
  onExploreRequests: () => void;
}

export default function AuthenticatedHome({
  onMyRequests,
  onExploreRequests,
}: AuthenticatedHomeProps) {
  return (
    <main className="authenticated-home">
      <section className="authenticated-home-container">
        <div className="authenticated-home-heading">
          <span className="authenticated-home-label">
            QHAPAQ
          </span>

          <h1>
            ¿Qué quieres
            <span> hacer?</span>
          </h1>

          <p>
            Encuentra soluciones para tus necesidades
            o ayuda a otras personas a encontrar las
            suyas.
          </p>
        </div>

        <div className="authenticated-home-options">
          <button
            className="authenticated-option"
            onClick={onMyRequests}
            type="button"
          >
            <span className="authenticated-option-icon">
              ◈
            </span>

            <span className="authenticated-option-label">
              MIS NECESIDADES
            </span>

            <strong>
              Mis necesidades
            </strong>

            <span>
              Consulta las necesidades que has
              publicado y revisa las ofertas que
              has recibido.
            </span>

            <span className="authenticated-option-action">
              Ver mis necesidades →
            </span>
          </button>

          <button
            className="authenticated-option authenticated-option-explore"
            onClick={onExploreRequests}
            type="button"
          >
            <span className="authenticated-option-icon">
              ↗
            </span>

            <span className="authenticated-option-label">
              COMUNIDAD
            </span>

            <strong>
              Explorar necesidades
            </strong>

            <span>
              Descubre lo que otras personas necesitan
              y ofrece tus servicios para ayudarlas.
            </span>

            <span className="authenticated-option-action">
              Explorar necesidades →
            </span>
          </button>
        </div>
      </section>
    </main>
  );
}

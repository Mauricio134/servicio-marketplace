import "./LandingPage.css";

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
}

export default function LandingPage({
  onLogin,
  onRegister,
}: LandingPageProps) {
  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="landing-container">
          <div className="landing-hero-content">
            <span className="landing-eyebrow">
              PERSONAS · NEGOCIOS · OPORTUNIDADES
            </span>

            <h1 className="landing-title">
              Lo que necesitas.
              <br />

              <span>Lo que sabes hacer.</span>
            </h1>

            <p className="landing-description">
              QHAPAQ conecta a personas que necesitan
              un servicio con quienes pueden hacerlo
              realidad.
            </p>

            <div className="landing-actions">
              <button
                className="landing-primary-button"
                type="button"
                onClick={onRegister}
              >
                Empezar ahora
                <span>→</span>
              </button>

              <button
                className="landing-secondary-button"
                type="button"
                onClick={onLogin}
              >
                Ya tengo una cuenta
              </button>
            </div>
          </div>

          <div className="landing-visual">
            <div className="landing-visual-card">
              <div className="landing-visual-top">
                <span className="landing-visual-dot"></span>

                <span>
                  CONEXIONES QUE FUNCIONAN
                </span>
              </div>

              <div className="landing-visual-line"></div>

              <div className="landing-visual-content">
                <div className="landing-visual-block">
                  <strong>Necesito</strong>

                  <span>
                    una solución
                  </span>
                </div>

                <div className="landing-visual-arrow">
                  →
                </div>

                <div className="landing-visual-block landing-visual-block-yellow">
                  <strong>Encuentro</strong>

                  <span>
                    a quien puede ayudar
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-explanation">
        <div className="landing-container">
          <div className="explanation-heading">
            <span className="landing-eyebrow">
              UNA FORMA MÁS DIRECTA
            </span>

            <h2>
              Las buenas ideas
              <br />
              necesitan conexiones.
            </h2>
          </div>

          <div className="explanation-content">
            <p>
              Publica una necesidad, encuentra
              personas que pueden ayudarte y recibe
              propuestas directamente.
            </p>

            <p>
              O comparte lo que sabes hacer y permite
              que quienes lo necesitan te encuentren.
            </p>
          </div>
        </div>
      </section>

      <section className="landing-values">
        <div className="landing-container">
          <div className="value-item">
            <span className="value-number">
              01
            </span>

            <h3>Publica</h3>

            <p>
              Cuenta qué necesitas o qué puedes
              ofrecer.
            </p>
          </div>

          <div className="value-item">
            <span className="value-number">
              02
            </span>

            <h3>Conecta</h3>

            <p>
              Encuentra personas que pueden ayudarte.
            </p>
          </div>

          <div className="value-item">
            <span className="value-number">
              03
            </span>

            <h3>Resuelve</h3>

            <p>
              Lleva tu necesidad desde una idea hasta
              una solución.
            </p>
          </div>
        </div>
      </section>

      <section className="landing-final-cta">
        <div className="landing-container">
          <div>
            <span className="landing-eyebrow">
              TU PRÓXIMO PASO
            </span>

            <h2>
              Encuentra tu camino.
            </h2>
          </div>

          <button
            className="landing-primary-button"
            type="button"
            onClick={onRegister}
          >
            Crear una cuenta
            <span>→</span>
          </button>
        </div>
      </section>
    </main>
  );
}

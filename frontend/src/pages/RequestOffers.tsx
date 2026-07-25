import { useEffect, useState } from "react";

import {
  getOffers,
  markOfferAsInteresting,
  cancelOfferInterest,
  acceptOffer,
  type Offer,
} from "../api/client";

import "./RequestOffers.css";

interface RequestOffersProps {
  postId: string;
  token: string;
  onBack: () => void;
}

export default function RequestOffers({
  postId,
  token,
  onBack,
}: RequestOffersProps) {
  const [offers, setOffers] =
    useState<Offer[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [acceptingOfferId, setAcceptingOfferId] =
    useState<string | null>(null);

  const [offerToAccept, setOfferToAccept] =
    useState<Offer | null>(null);

  async function loadOffers() {
    try {
      setLoading(true);
      setError("");

      const offersData =
        await getOffers(
          postId,
          token,
        );

      setOffers(offersData);
    } catch (error) {
      console.error(
        "ERROR CARGANDO OFERTAS:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar las ofertas.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOffers();
  }, [postId, token]);

  async function handleInterest(
    offerId: string,
  ) {
    try {
      await markOfferAsInteresting(
        offerId,
        token,
      );

      await loadOffers();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo seleccionar la oferta.",
      );
    }
  }

  async function handleCancelInterest(
    offerId: string,
  ) {
    try {
      await cancelOfferInterest(
        offerId,
        token,
      );

      await loadOffers();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo cancelar el interés.",
      );
    }
  }

  async function handleAcceptOffer() {
    if (!offerToAccept) {
      return;
    }

    try {
      setAcceptingOfferId(
        offerToAccept.id,
      );

      setError("");

      await acceptOffer(
        offerToAccept.id,
        token,
      );

      setOfferToAccept(null);

      await loadOffers();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo aceptar la oferta.",
      );
    } finally {
      setAcceptingOfferId(null);
    }
  }

  return (
    <main className="request-offers-page">
      <div className="request-offers-container">
        <button
          className="request-offers-back"
          type="button"
          onClick={onBack}
        >
          ← Volver a mis necesidades
        </button>

        <header className="request-offers-header">
          <span className="request-offers-label">
            PROPUESTAS RECIBIDAS
          </span>

          <h1>
            Ofertas para tu necesidad.
          </h1>

          <p>
            Aquí puedes revisar las propuestas
            enviadas por otras personas.
          </p>
        </header>

        {loading && (
          <p>
            Cargando ofertas...
          </p>
        )}

        {error && (
          <div className="request-offers-error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          offers.length === 0 && (
            <div className="offers-empty">
              <div>◈</div>

              <h3>
                Todavía no has recibido ofertas.
              </h3>

              <p>
                Cuando alguien quiera ayudarte,
                su propuesta aparecerá aquí.
              </p>
            </div>
          )}

        {!loading &&
          offers.length > 0 && (
            <div className="offers-list">
              {offers.map((offer) => (
                <article
                  className="offer-received-card"
                  key={offer.id}
                >
                  <div className="offer-received-top">
                    <div>
                      <span className="offer-received-label">
                        OFERTA DE
                      </span>

                      <h3>
                        {offer.user.name}
                      </h3>
                    </div>

                    <span>
                      {offer.status ===
                      "INTERESTED"
                        ? "ME INTERESA"
                        : offer.status ===
                          "ACCEPTED"
                        ? "ACEPTADA"
                        : offer.status ===
                          "REJECTED"
                        ? "RECHAZADA"
                        : "PENDIENTE"}
                    </span>
                  </div>

                  <div className="offer-received-details">
                    <div>
                      <span>
                        PRECIO
                      </span>

                      <strong>
                        S/ {offer.price}
                      </strong>
                    </div>

                    <div>
                      <span>
                        TIEMPO ESTIMADO
                      </span>

                      <strong>
                        {offer.estimatedTime} días
                      </strong>
                    </div>
                  </div>

                  <div className="offer-received-message">
                    <span>
                      MENSAJE
                    </span>

                    <p>
                      {offer.message}
                    </p>
                  </div>

                  {offer.status ===
                    "INTERESTED" && (
                    <div className="offer-contact-section">
                      <div className="offer-selected-message">
                        ✓ Esta oferta te interesa
                      </div>

                      <div className="offer-contact-info">
                        <span>
                          CONTACTO
                        </span>

                        <p>
                          ✉ {offer.user.email}
                        </p>

                        {offer.user.whatsapp && (
                          <p>
                            📱{" "}
                            {offer.user.whatsapp}
                          </p>
                        )}
                      </div>

                      <div className="offer-actions">
                        <button
                          className="offer-accept-button"
                          type="button"
                          disabled={
                            acceptingOfferId ===
                            offer.id
                          }
                          onClick={() =>
                            setOfferToAccept(
                              offer,
                            )
                          }
                        >
                          {acceptingOfferId ===
                          offer.id
                            ? "Aceptando..."
                            : "Aceptar esta oferta"}
                        </button>

                        <button
                          className="offer-cancel-button"
                          type="button"
                          onClick={() =>
                            handleCancelInterest(
                              offer.id,
                            )
                          }
                        >
                          Cancelar interés
                        </button>
                      </div>
                    </div>
                  )}

                  {offer.status ===
                    "PENDING" && (
                    <button
                      className="offer-interest-button"
                      type="button"
                      onClick={() =>
                        handleInterest(
                          offer.id,
                        )
                      }
                    >
                      Me interesa esta oferta →
                    </button>
                  )}

                  {offer.status ===
                    "ACCEPTED" && (
                    <div className="offer-accepted-message">
                      ✓ Oferta aceptada
                    </div>
                  )}

                  {offer.status ===
                    "REJECTED" && (
                    <div className="offer-rejected-message">
                      Esta oferta fue rechazada.
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
      </div>

      {offerToAccept && (
        <div
          className="offer-modal-overlay"
          onClick={() =>
            setOfferToAccept(null)
          }
        >
          <div
            className="offer-confirm-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="offer-modal-icon">
              ✓
            </div>

            <span className="offer-modal-label">
              CONFIRMAR ELECCIÓN
            </span>

            <h2>
              ¿Aceptar esta oferta?
            </h2>

            <p>
              Estás a punto de aceptar la oferta
              de{" "}
              <strong>
                {offerToAccept.user.name}
              </strong>
              .
            </p>

            <div className="offer-modal-summary">
              <div>
                <span>PRECIO</span>
                <strong>
                  S/ {offerToAccept.price}
                </strong>
              </div>

              <div>
                <span>TIEMPO</span>
                <strong>
                  {offerToAccept.estimatedTime} días
                </strong>
              </div>
            </div>

            <p className="offer-modal-warning">
              Al aceptar esta oferta, la necesidad
              se cerrará y las demás propuestas
              serán rechazadas.
            </p>

            <div className="offer-modal-actions">
              <button
                className="offer-modal-cancel"
                type="button"
                onClick={() =>
                  setOfferToAccept(null)
                }
              >
                Volver
              </button>

              <button
                className="offer-modal-confirm"
                type="button"
                disabled={
                  acceptingOfferId ===
                  offerToAccept.id
                }
                onClick={handleAcceptOffer}
              >
                {acceptingOfferId ===
                offerToAccept.id
                  ? "Aceptando..."
                  : "Sí, aceptar oferta"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

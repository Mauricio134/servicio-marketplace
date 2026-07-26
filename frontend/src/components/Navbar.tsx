import {
  useEffect,
  useState,
} from "react";

import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type Notification,
} from "../api/client";

import "./Navbar.css";

interface User {
  id: string;
  name: string;
  email: string;
  whatsapp?: string | null;
}

interface NavbarProps {
  user: User | null;
  token: string | null;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
}

export default function Navbar({
  user,
  token,
  onLogin,
  onRegister,
  onLogout,
}: NavbarProps) {
  const [
    notifications,
    setNotifications,
  ] = useState<Notification[]>([]);

  const [
    showNotifications,
    setShowNotifications,
  ] = useState(false);

  const [
    expandedNotificationId,
    setExpandedNotificationId,
  ] = useState<string | null>(null);

  const [
    loadingNotifications,
    setLoadingNotifications,
  ] = useState(false);

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read,
    ).length;

  async function loadNotifications() {
    if (!token) {
      setNotifications([]);
      return;
    }

    try {
      setLoadingNotifications(true);

      const data =
        await getNotifications(token);

      setNotifications(data);
    } catch (error) {
      console.error(
        "Error cargando notificaciones:",
        error,
      );
    } finally {
      setLoadingNotifications(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, [token]);

  useEffect(() => {
    function handleScroll() {
      setShowNotifications(false);
      setExpandedNotificationId(null);
    }

    function handleClickOutside(
      event: MouseEvent,
    ) {
      const target =
        event.target as HTMLElement;

      if (
        !target.closest(
          ".navbar-notifications-wrapper",
        )
      ) {
        setShowNotifications(false);
        setExpandedNotificationId(null);
      }
    }

    window.addEventListener(
      "scroll",
      handleScroll,
    );

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );

      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  async function handleNotificationClick(
    notification: Notification,
  ) {
    if (!token) {
      return;
    }

    if (
      notification.type ===
      "OFFER_ACCEPTED"
    ) {
      setExpandedNotificationId(
        (current) =>
          current === notification.id
            ? null
            : notification.id,
      );
    }

    if (!notification.read) {
      try {
        await markNotificationAsRead(
          notification.id,
          token,
        );

        setNotifications((current) =>
          current.map((item) =>
            item.id === notification.id
              ? {
                  ...item,
                  read: true,
                }
              : item,
          ),
        );
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function handleMarkAllAsRead() {
    if (!token || unreadCount === 0) {
      return;
    }

    try {
      await markAllNotificationsAsRead(
        token,
      );

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read: true,
        })),
      );
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <header className="navbar">
      <div className="navbar-container">
        <button
          className="navbar-brand"
          type="button"
          onClick={() =>
            window.scrollTo(0, 0)
          }
        >
          <span className="navbar-brand-mark">
            Q
          </span>

          <span className="navbar-brand-name">
            QHAPAQ
          </span>
        </button>

        <nav className="navbar-actions">
          {user ? (
            <>
              <div className="navbar-notifications-wrapper">
                <button
                  className="navbar-notifications-button"
                  type="button"
                  onClick={async () => {
                    const nextState =
                      !showNotifications;

                    setShowNotifications(
                      nextState,
                    );

                    if (nextState) {
                      await loadNotifications();
                    }
                  }}
                  aria-label="Notificaciones"
                >
                  <span className="navbar-bell">
                    🔔
                  </span>

                  {unreadCount > 0 && (
                    <span className="navbar-notifications-count">
                      {unreadCount > 99
                        ? "99+"
                        : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="notifications-panel">
                    <div className="notifications-header">
                      <div>
                        <span className="notifications-label">
                          ACTIVIDAD
                        </span>

                        <h3>
                          Notificaciones
                        </h3>
                      </div>

                      {unreadCount > 0 && (
                        <button
                          className="notifications-read-all"
                          type="button"
                          onClick={
                            handleMarkAllAsRead
                          }
                        >
                          Marcar todo como leído
                        </button>
                      )}
                    </div>

                    {loadingNotifications && (
                      <div className="notifications-empty">
                        Cargando...
                      </div>
                    )}

                    {!loadingNotifications &&
                      notifications.length ===
                        0 && (
                        <div className="notifications-empty">
                          <span>◈</span>

                          <p>
                            No tienes
                            notificaciones.
                          </p>
                        </div>
                      )}

                    {!loadingNotifications &&
                      notifications.length >
                        0 && (
                        <div className="notifications-list">
                          {notifications.map(
                            (
                              notification,
                            ) => {
                              const isExpanded =
                                expandedNotificationId ===
                                notification.id;

                              return (
                                <div
                                  className={`notification-wrapper ${
                                    notification.read
                                      ? "notification-read"
                                      : "notification-unread"
                                  }`}
                                  key={
                                    notification.id
                                  }
                                >
                                  <button
                                    className="notification-item"
                                    type="button"
                                    onClick={() =>
                                      handleNotificationClick(
                                        notification,
                                      )
                                    }
                                  >
                                    <span className="notification-status">
                                      {notification.read
                                        ? "✓"
                                        : "●"}
                                    </span>

                                    <span className="notification-content">
                                      <span className="notification-message">
                                        {
                                          notification.message
                                        }
                                      </span>

                                      <span className="notification-date">
                                        {new Date(
                                          notification.createdAt,
                                        ).toLocaleString(
                                          "es-ES",
                                          {
                                            dateStyle:
                                              "short",
                                            timeStyle:
                                              "short",
                                          },
                                        )}
                                      </span>
                                    </span>

                                    {notification.type ===
                                      "OFFER_ACCEPTED" && (
                                      <span className="notification-expand-icon">
                                        {isExpanded
                                          ? "⌃"
                                          : "⌄"}
                                      </span>
                                    )}
                                  </button>

                                  {isExpanded &&
                                    notification.type ===
                                      "OFFER_ACCEPTED" && (
                                    <div className="notification-details">
                                      {!notification.offer ? (
                                        <p>
                                          No hay detalles de oferta disponibles.
                                        </p>
                                      ) : (
                                        <>
                                          <div className="notification-detail-heading">
                                            <span>
                                              {notification.message.includes(
                                                "rechazada",
                                              )
                                                ? "OFERTA RECHAZADA"
                                                : "OFERTA ACEPTADA"}
                                            </span>

                                            <strong>
                                              {
                                                notification
                                                  .offer
                                                  .post
                                                  .title
                                              }
                                            </strong>
                                          </div>

                                          <div className="notification-detail-grid">
                                            <div>
                                              <span>
                                                PRECIO
                                              </span>

                                              <strong>
                                                S/{" "}
                                                {
                                                  notification
                                                    .offer
                                                    .price
                                                }
                                              </strong>
                                            </div>

                                            <div>
                                              <span>
                                                TIEMPO
                                              </span>

                                              <strong>
                                                {
                                                  notification
                                                    .offer
                                                    .estimatedTime
                                                }{" "}
                                                días
                                              </strong>
                                            </div>
                                          </div>

                                          <div className="notification-detail-block">
                                            <span>
                                              MENSAJE DE LA OFERTA
                                            </span>

                                            <p>
                                              {
                                                notification
                                                  .offer
                                                  .message
                                              }
                                            </p>
                                          </div>

                                          <div className="notification-detail-block">
                                            <span>
                                              CONTACTO
                                            </span>

                                            <p>
                                              ✉{" "}
                                              {
                                                notification
                                                  .offer
                                                  .user
                                                  .email
                                              }
                                            </p>

                                            {notification
                                              .offer
                                              .user
                                              .whatsapp && (
                                              <p>
                                                📱{" "}
                                                {
                                                  notification
                                                    .offer
                                                    .user
                                                    .whatsapp
                                                }
                                              </p>
                                            )}
                                          </div>

                                          <div className="notification-detail-description">
                                            <span>
                                              NECESIDAD
                                            </span>

                                            <p>
                                              {
                                                notification
                                                  .offer
                                                  .post
                                                  .description
                                              }
                                            </p>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            },
                          )}
                        </div>
                      )}
                  </div>
                )}
              </div>

              <span className="navbar-greeting">
                Hola, {user.name}
              </span>

              <button
                className="navbar-login"
                type="button"
                onClick={onLogout}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <button
                className="navbar-login"
                type="button"
                onClick={onLogin}
              >
                Iniciar sesión
              </button>

              <button
                className="navbar-register"
                type="button"
                onClick={onRegister}
              >
                Registrarse
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

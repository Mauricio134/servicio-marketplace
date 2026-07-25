import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateRequest from "./pages/CreateRequest";
import ExploreNeeds from "./pages/ExploreNeeds";
import MyRequests from "./pages/MyRequests";
import PostDetails from "./pages/PostDetails";
import RequestOffers from "./pages/RequestOffers";

import "./App.css";

type View =
  | "landing"
  | "login"
  | "register"
  | "dashboard"
  | "my-needs"
  | "explore-needs"
  | "create-request"
  | "post-details"
  | "request-offers";

interface User {
  id: string;
  name: string;
  email: string;
  whatsapp?: string | null;
}

function App() {
  const [view, setView] =
    useState<View>("landing");

  const [user, setUser] =
    useState<User | null>(null);

  const [selectedPostId, setSelectedPostId] =
    useState<string | null>(null);

  useEffect(() => {
    const storedUser =
      localStorage.getItem("qhapaq_user");

    const storedToken =
      localStorage.getItem("qhapaq_token");

    if (storedUser && storedToken) {
      try {
        const parsedUser =
          JSON.parse(storedUser);

        setUser(parsedUser);
        setView("dashboard");
      } catch {
        localStorage.removeItem(
          "qhapaq_user",
        );

        localStorage.removeItem(
          "qhapaq_token",
        );
      }
    }
  }, []);

  function handleLoginSuccess() {
    const storedUser =
      localStorage.getItem("qhapaq_user");

    if (!storedUser) {
      setView("landing");
      return;
    }

    try {
      const parsedUser =
        JSON.parse(storedUser);

      setUser(parsedUser);
      setView("dashboard");
    } catch {
      setView("landing");
    }
  }

  function handleRegisterSuccess() {
    const storedUser =
      localStorage.getItem("qhapaq_user");

    if (!storedUser) {
      setView("landing");
      return;
    }

    try {
      const parsedUser =
        JSON.parse(storedUser);

      setUser(parsedUser);
      setView("dashboard");
    } catch {
      setView("landing");
    }
  }

  function handleLogout() {
    localStorage.removeItem(
      "qhapaq_token",
    );

    localStorage.removeItem(
      "qhapaq_user",
    );

    setUser(null);
    setView("landing");
  }

  if (
    view === "landing" &&
    !user
  ) {
    return (
      <>
        <Navbar
          user={null}
          token={null}
          onLogin={() =>
            setView("login")
          }
          onRegister={() =>
            setView("register")
          }
          onLogout={handleLogout}
        />

        <LandingPage
          onLogin={() =>
            setView("login")
          }
          onRegister={() =>
            setView("register")
          }
        />
      </>
    );
  }

  if (view === "login") {
    return (
      <>
        <Navbar
          user={null}
          token={null}
          onLogin={() =>
            setView("login")
          }
          onRegister={() =>
            setView("register")
          }
          onLogout={handleLogout}
        />

        <Login
          onSuccess={
            handleLoginSuccess
          }
          onRegister={() =>
            setView("register")
          }
          onBack={() =>
            setView("landing")
          }
        />
      </>
    );
  }

  if (view === "register") {
    return (
      <>
        <Navbar
          user={null}
          token={null}
          onLogin={() =>
            setView("login")
          }
          onRegister={() =>
            setView("register")
          }
          onLogout={handleLogout}
        />

        <Register
          onSuccess={
            handleRegisterSuccess
          }
          onLogin={() =>
            setView("login")
          }
          onBack={() =>
            setView("landing")
          }
        />
      </>
    );
  }

  if (
    view === "my-needs" &&
    user
  ) {
    return (
      <>
        <Navbar
          user={user}
          token={localStorage.getItem("qhapaq_token")}
          onLogin={() =>
            setView("login")
          }
          onRegister={() =>
            setView("register")
          }
          onLogout={handleLogout}
        />

        <MyRequests
          userId={user.id}
          onCreate={() => {
            setView("create-request");
          }}
          onOpen={(postId) => {
            setSelectedPostId(postId);
            setView("request-offers");
          }}
          onBack={() =>
            setView("dashboard")
          }
        />
      </>
    );
  }

  if (
    view === "explore-needs" &&
    user
  ) {
    return (
      <>
        <Navbar
          user={user}
          token={localStorage.getItem("qhapaq_token")}
          onLogin={() =>
            setView("login")
          }
          onRegister={() =>
            setView("register")
          }
          onLogout={handleLogout}
        />

        <ExploreNeeds
          userId={user.id}
          onOpen={(postId) => {
            setSelectedPostId(postId);
            setView("post-details");
          }}
          onBack={() =>
            setView("dashboard")
          }
        />
      </>
    );
  }


  if (
    view === "request-offers" &&
    user &&
    selectedPostId
  ) {
    const token =
      localStorage.getItem(
        "qhapaq_token",
      );

    if (!token) {
      return null;
    }

    return (
      <>
        <Navbar
          user={user}
          token={localStorage.getItem("qhapaq_token")}
          onLogin={() =>
            setView("login")
          }
          onRegister={() =>
            setView("register")
          }
          onLogout={handleLogout}
        />

        <RequestOffers
          postId={selectedPostId}
          token={token}
          onBack={() =>
            setView("my-needs")
          }
        />
      </>
    );
  }

  if (
    view === "post-details" &&
    user &&
    selectedPostId
  ) {
    const token =
      localStorage.getItem(
        "qhapaq_token",
      );

    if (!token) {
      return null;
    }

    return (
      <>
        <Navbar
          user={user}
          token={localStorage.getItem("qhapaq_token")}
          onLogin={() =>
            setView("login")
          }
          onRegister={() =>
            setView("register")
          }
          onLogout={handleLogout}
        />

        <PostDetails
          postId={selectedPostId}
          token={token}
          onBack={() =>
            setView("explore-needs")
          }
          onSuccess={() =>
            setView("explore-needs")
          }
        />
      </>
    );
  }

  if (view === "create-request") {
    return (
      <>
        <Navbar
          user={user}
          token={localStorage.getItem("qhapaq_token")}
          onLogin={() =>
            setView("login")
          }
          onRegister={() =>
            setView("register")
          }
          onLogout={handleLogout}
        />

        <CreateRequest
          onBack={() =>
            setView("my-needs")
          }
          onSuccess={() =>
            setView("my-needs")
          }
        />
      </>
    );
  }

  return (
    <>
      <Navbar
        user={user}
        token={localStorage.getItem("qhapaq_token")}
        onLogin={() =>
          setView("login")
        }
        onRegister={() =>
          setView("register")
        }
        onLogout={handleLogout}
      />

      <main className="dashboard-page">
        <section className="dashboard-container">
          <div className="dashboard-heading">
            <span className="dashboard-label">
              QHAPAQ
            </span>

            <h1>
              Hola,{" "}
              <span>
                {user?.name}
              </span>
            </h1>

            <p>
              Encuentra necesidades, ofrece
              tus habilidades y conecta con
              personas.
            </p>
          </div>

          <div className="dashboard-options">
            <button
              className="dashboard-option"
              onClick={() =>
                setView("my-needs")
              }
            >
              <span className="dashboard-option-icon">
                ◈
              </span>

              <span className="dashboard-option-label">
                MIS NECESIDADES
              </span>

              <strong>
                Necesidades que publiqué
              </strong>

              <p>
                Revisa las necesidades que has
                creado y gestiona las propuestas
                que recibiste.
              </p>

              <span className="dashboard-option-action">
                Ver mis necesidades →
              </span>
            </button>

            <button
              className="dashboard-option"
              onClick={() =>
                setView(
                  "explore-needs",
                )
              }
            >
              <span className="dashboard-option-icon">
                ↗
              </span>

              <span className="dashboard-option-label">
                EXPLORAR
              </span>

              <strong>
                Necesidades de otras personas
              </strong>

              <p>
                Descubre lo que otras personas
                necesitan y ofrece tus servicios.
              </p>

              <span className="dashboard-option-action">
                Explorar necesidades →
              </span>
            </button>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;

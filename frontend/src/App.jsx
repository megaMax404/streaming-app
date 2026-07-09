import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import CategoryPage from "./pages/CategoryPage";
import CategoryList from "./pages/CategoryList";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

function App() {
  const [isAdmin, setIsAdmin] = useState(
    !!sessionStorage.getItem("adminToken")
  );

  const [search, setSearch] = useState("");

  function Layout({ children }) {
    return (
      <>
        <Navbar search={search} setSearch={setSearch} />

        <main className="page-container">
          {children}
        </main>

        <Footer />
      </>
    );
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={
            <Layout>
              <Home search={search} />
            </Layout>
          }
        />

        {/* CATEGORY */}
        <Route
          path="/category/:category"
          element={
            <Layout>
              <CategoryPage />
            </Layout>
          }
        />

        {/* CATEGORY LIST */}
        <Route
          path="/categories"
          element={
            <Layout>
              <CategoryList />
            </Layout>
          }
        />

        {/* MOVIE */}
        <Route
          path="/movie/:slug"
          element={<MovieDetail />}
        />

        {/* ADMIN */}
        <Route
          path="/9x9adm-panel"
          element={
            isAdmin ? (
              <Admin />
            ) : (
              <Navigate
                to="/9x9adm-login"
                replace
              />
            )
          }
        />

        <Route
          path="/9x9adm-login"
          element={
            <AdminLogin
              setIsAdmin={setIsAdmin}
            />
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
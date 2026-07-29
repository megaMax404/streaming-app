import { useState, lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const MovieDetail = lazy(() => import("./pages/MovieDetail"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const CategoryList = lazy(() => import("./pages/CategoryList"));

import PageTracker from "./components/PageTracker";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import LoadingPage from "./components/LoadingPage";
import { useEffect } from "react";
import { trackVisitor } from "./utils/visitorTracker";

function App() {

  useEffect(() => {
    console.log("trackVisitor called");
    trackVisitor();
  }, []);

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
      <PageTracker />
      <Suspense fallback={<LoadingPage />}>
        <Routes>

          <Route
            path="/"
            element={
              <Layout>
                <Home search={search} />
              </Layout>
            }
          />

          <Route
            path="/category/:slug"
            element={
              <Layout>
                <Home search={search} />
              </Layout>
            }
          />

          <Route
            path="/categories"
            element={
              <Layout>
                <CategoryList />
              </Layout>
            }
          />

          <Route
            path="/categories/:category"
            element={
              <Layout>
                <CategoryPage />
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
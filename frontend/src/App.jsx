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

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {

  const [isAdmin, setIsAdmin] = useState(
    !!sessionStorage.getItem("adminToken")
  );

  const [search, setSearch] = useState("");

  function MainLayout() {
    return (
      <>
        <Navbar search={search} setSearch={setSearch} />

        <div className="page-container">
          <Home search={search} />
        </div>

        <Footer />
      </>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/category/:slug" element={<MainLayout />} />

        <Route
          path="/movie/:id"
          element={
            <>
              <Navbar search={search} setSearch={setSearch} />
              <MovieDetail />
              <Footer />
            </>
          }
        />

        <Route
          path="/9x9adm-panel"
          element={
            isAdmin
              ? <Admin />
              : <Navigate to="/9x9adm-login" replace />
          }
        />

        <Route
          path="/9x9adm-login"
          element={<AdminLogin setIsAdmin={setIsAdmin} />}
        />

        <Route
          path="/categories"
          element={
            <>
              <Navbar search={search} setSearch={setSearch} />
              <CategoryPage />
              <Footer />
            </>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
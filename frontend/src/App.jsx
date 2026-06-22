import { useState } from "react";
import {
  HashRouter,
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

  const [search, setSearch] =
    useState("");

  return (
    <HashRouter>
      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={
            <>
              <Navbar
                search={search}
                setSearch={setSearch}
              />

              <Home
                search={search}
              />

              <Footer />
            </>
          }
        />

        {/* MOVIE DETAIL */}
        <Route
          path="/movie/:id"
          element={
            <>
              <Navbar
                search={search}
                setSearch={setSearch}
              />
              <MovieDetail />

              <Footer />
            </>
          }
        />

        {/* LOGIN */}
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

        {/* PROTECTED ADMIN */}
        <Route
          path="/categories"
          element={
            <>
              <Navbar
                search={search}
                setSearch={setSearch}
              />
              <CategoryPage />
              <Footer />
            </>
          }
        />


        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>


    </HashRouter>
  );

}


export default App;
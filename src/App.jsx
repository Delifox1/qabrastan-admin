import {
  HashRouter,
  Routes,
  Route,
} from "react-router-dom";

import Layout from "./layout/Layout";

import Dashboard from "./pages/Dashboard";
import AddGrave from "./pages/AddGrave";
import ViewGraves from "./pages/ViewGraves";
import NewAnnouncement from "./pages/NewAnnouncement";
import ViewAnnouncements from "./pages/ViewAnnouncements";
import LoginPage from "./pages/LoginPage";
import EditGrave from "./pages/EditGrave";
import EditAnnouncement from "./pages/EditAnnouncement";
import ManageCemeteries from "./pages/ManageCemeteries";
import ManageAdmins from "./pages/ManageAdmins";
import SuperAdminRoute from "./components/SuperAdminRoute";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <HashRouter>
      <Routes>

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/add-grave"
            element={<AddGrave />}
          />

          <Route
            path="/view-graves"
            element={<ViewGraves />}
          />

          <Route
            path="/new-announcement"
            element={<NewAnnouncement />}
          />

          <Route
            path="/view-announcements"
            element={<ViewAnnouncements />}
          />

          <Route
            path="/edit-grave/:id"
            element={<EditGrave />}
          />

          <Route
            path="/edit-announcement/:id"
            element={<EditAnnouncement />}
          />

          <Route
            path="/cemeteries"
            element={
              <SuperAdminRoute>
                <ManageCemeteries />
              </SuperAdminRoute>
            }
          />

          <Route
            path="/admins"
            element={
              <SuperAdminRoute>
                <ManageAdmins />
              </SuperAdminRoute>
            }
          />
        </Route>

      </Routes>
    </HashRouter>
  );
}

export default App;
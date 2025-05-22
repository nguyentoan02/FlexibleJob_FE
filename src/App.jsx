import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import GuestPage from "./pages/GuestPage";
import Login from "./pages/Login";
import AdminPage from "./pages/AdminPage";
import AdminUsers from "./pages/AdminUsers";
import UserPage from "./pages/UserPage";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import { useAuth } from "./hooks/useAuth";

function App() {
    const { user } = useAuth();

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        !user ? (
                            <GuestPage />
                        ) : (
                            <Navigate
                                to={
                                    user.role === "ADMIN"
                                        ? "/admin/dashboard"
                                        : "/user/dashboard"
                                }
                                replace
                            />
                        )
                    }
                />
                <Route
                    path="/login"
                    element={
                        !user ? (
                            <Login />
                        ) : (
                            <Navigate
                                to={
                                    user.role === "ADMIN"
                                        ? "/admin/dashboard"
                                        : "/user/dashboard"
                                }
                                replace
                            />
                        )
                    }
                />

                {/* Admin */}
                <Route element={<PrivateRoute role="ADMIN" />}>
                    <Route path="/admin/dashboard" element={<AdminPage />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                </Route>

                {/* User */}
                <Route element={<PrivateRoute role="JOBSEEKER" />}>
                    <Route path="/user/dashboard" element={<UserPage />} />
                </Route>

                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;

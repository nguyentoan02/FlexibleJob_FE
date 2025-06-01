// src/App.jsx (Đảm bảo đã có)
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
// Import các component nhóm route
import AuthRoutes from "./routes/AuthRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import JobseekerRoutes from "./routes/JobseekerRoutes";

function App() {
    return (
        <Router>
            <Routes>
                {/* Gọi các nhóm route như các thành phần con trực tiếp của <Routes> */}
                {/* AuthRoutes sẽ chứa các route /login, /forgot-password, /new-forgot-password, v.v. */}
                {AuthRoutes()}
                {AdminRoutes()}
                {JobseekerRoutes()}
                {/* Các route xử lý lỗi và catch-all */}
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;

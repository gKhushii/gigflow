import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Gigs from "./pages/Gigs";
import CreateGig from "./pages/CreateGig";
import GigDetails from "./pages/GigDetails";
import ClientDashboard from "./pages/ClientDashboard";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Gigs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={<CreateGig />} />
        <Route path="/gig/:id" element={<GigDetails />} />
        <Route path="/client/gig/:id" element={<ClientDashboard />} />
      </Routes>
  );
}

export default App;

import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import WelcomePopup from "./components/WelcomePopup";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import AboutPage from "./components/AboutPage";
import Services from "./components/Services";
import ServicesPage from "./components/ServicesPage";
import BookingForm from "./components/BookingForm";
import Contact from "./components/Contact";
import Gallery from "./components/Gallery";
import Footer from "./components/Footer";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Register from "./components/Register";
import Account from "./components/Account";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminBookings from "./admin/AdminBookings";
import AdminCustomers from "./admin/AdminCustomers";
import AdminServices from "./admin/AdminServices";
import ReviewsPage from "./components/ReviewsPage";
import AdminReviews from "./admin/AdminReviews";
import ReviewInvite from "./components/ReviewInvite";
import GalleryManagement from "./admin/GalleryManagement";

function Home() {
  const location = useLocation();

  const [showWelcome, setShowWelcome] = useState(
    location.state?.loginSuccess || false
  );

  const customerName = location.state?.customerName || "";

  const closeWelcome = () => {
    setShowWelcome(false);

    window.history.replaceState(
      {},
      document.title,
      window.location.pathname
    );
  };

  return (
    <>
      {showWelcome && (
        <WelcomePopup
          customerName={customerName}
          onClose={closeWelcome}
        />
      )}

      <Hero />
      <About />
      <Services />
      <ReviewInvite />
    </>
  );
}

function App() {
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Navbar />}

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<AboutPage />} />

        <Route path="/services" element={<ServicesPage />} />

        <Route path="/gallery" element={<Gallery />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/booking" element={<BookingForm />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
  path="/reset-password/:token"
  element={<ResetPassword />}
/>

        <Route path="/register" element={<Register />} />

        <Route path="/account" element={<Account />} />

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/bookings"
          element={<AdminBookings />}
        />

        <Route
          path="/admin/customers"
          element={<AdminCustomers />}
        />

        <Route
          path="/admin/services"
          element={<AdminServices />}
        />

        <Route
          path="/reviews"
          element={<ReviewsPage />}
        />

        <Route
          path="/admin/reviews"
          element={<AdminReviews />}
        />

        <Route
          path="/admin/gallery"
          element={<GalleryManagement />}
        />

      </Routes>

      {!isAdminPage && location.pathname !== "/account" && (
        <Footer />
      )}
    </>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;
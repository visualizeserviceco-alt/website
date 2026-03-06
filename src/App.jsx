import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Showcase from './pages/Showcase';
import Contact from './pages/Contact';
import LeadPartner from './pages/LeadPartner';
import Pricing from './pages/Pricing';

export default function App() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <main className="page-shell page-fade" key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/showcase" element={<Showcase />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/lead-partner" element={<LeadPartner />} />
          <Route path="/pricing" element={<Pricing />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

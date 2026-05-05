import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Showcase from './pages/Showcase';
import Contact from './pages/Contact';
import LeadPartner from './pages/LeadPartner';
import Pricing from './pages/Pricing';
import Prints from './pages/Prints';
import PrintsAdmin from './pages/PrintsAdmin';

export default function App() {
  const location = useLocation();

  // Admin route renders outside the normal layout (no navbar/footer)
  if (location.pathname === '/admin') {
    return <PrintsAdmin />;
  }

  // Prints configurator also outside normal layout
  if (location.pathname === '/prints') {
    return <Prints />;
  }

  return (
    <>
      <Navbar />
      <main className="page-shell page-fade" key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/showcase" element={<Showcase />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book" element={<Contact />} />
          <Route path="/lead-partner" element={<LeadPartner />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/prints" element={<Prints />} />
          <Route path="/admin" element={<PrintsAdmin />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

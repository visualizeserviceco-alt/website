import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Showcase from './pages/Showcase';
import Contact from './pages/Contact';
import LeadPartner from './pages/LeadPartner';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/showcase" element={<Showcase />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/lead-partner" element={<LeadPartner />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

import Hero from '../components/Hero';
import Trust from '../components/Trust';
import Services from '../components/Services';
import ShowcasePreview from '../components/ShowcasePreview';
import Process from '../components/Process';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';

export default function Home() {
  return (
    <>
      <Hero />
      <Trust />
      <Services />
      <ShowcasePreview />
      <Process />
      <Testimonials />
      <CTA />
    </>
  );
}

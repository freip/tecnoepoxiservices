import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Transformation } from '@/components/Transformation';
import { Spaces } from '@/components/Spaces';
import { ProjectsGallery } from '@/components/ProjectsGallery';
import { Solutions } from '@/components/Solutions';
import { WhyTecno } from '@/components/WhyTecno';
import { Process } from '@/components/Process';
import { Reviews } from '@/components/Reviews';
import { Testimonials } from '@/components/Testimonials';
import { FinalCTA } from '@/components/FinalCTA';
import { QuoteForm } from '@/components/QuoteForm';
import { Footer } from '@/components/Footer';

/**
 * Narrative order: impact → desire → proof → understanding → trust → quote.
 * Calls to action are placed after the hero, after the transformation, after the
 * gallery, and at the close, so the visitor is never far from one.
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Transformation />
        <Spaces />
        <ProjectsGallery />
        <Solutions />
        <WhyTecno />
        <Process />
        <Reviews />
        <Testimonials />
        <FinalCTA />
        <QuoteForm />
      </main>
      <Footer />
    </>
  );
}

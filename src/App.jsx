import './styles/global.css';
import './styles/components.css';
import './styles/responsive.css';

import SvgDefs from './components/SvgDefs';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Statement from './components/Statement';
import Visit from './components/Visit';
import PodExplorer from './components/PodExplorer';
import WellnessScore from './components/WellnessScore';
import LivApp from './components/LivApp';
import HumanOS from './components/HumanOS';
import Centres from './components/Centres';
import FAQ from './components/FAQ';
import Company from './components/Company';
import Contact from './components/Contact';
import MobileDock from './components/MobileDock';
import Footer from './components/Footer';
import ScrollEffects from './components/ScrollEffects';
import { LivDataProvider } from './context/LivDataContext';

export default function App() {
  return (
    <LivDataProvider>
      <SvgDefs />
      <ScrollEffects />
      <Navbar />
      <main id="top">
        <Hero />
        <Statement />
        <Visit />
        <PodExplorer />
        <WellnessScore />
        <LivApp />
        <HumanOS />
        <Centres />
        <FAQ />
        <Company />
        <Contact />
      </main>
      <MobileDock />
      <Footer />
    </LivDataProvider>
  );
}

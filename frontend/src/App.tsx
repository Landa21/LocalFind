import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import FeaturedExperiences from './components/FeaturedExperiences';
import HowItWorks from './components/HowItWorks';
import BecomeLocalGuide from './components/BecomeLocalGuide';
import Footer from './components/Footer';
import About from './components/About';

function App() {
  return (
    <div className="min-h-screen bg-warm-gray font-sans flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <Hero />
        <Categories />
        <FeaturedExperiences />
        <HowItWorks />
        <About />
        <BecomeLocalGuide />
      </div>
      <Footer />
    </div>
  )
}

export default App

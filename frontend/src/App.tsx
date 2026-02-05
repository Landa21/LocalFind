import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import FeaturedExperiences from './components/FeaturedExperiences';
import HowItWorks from './components/HowItWorks';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <Hero />
      <Categories />
      <FeaturedExperiences />
      <HowItWorks />

      {/* Spacer for scroll */}
      <div className="h-[500px]"></div>
    </div>
  )
}

export default App

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <Hero />
      <Categories />

      {/* Spacer for scroll */}
      <div className="h-[500px]"></div>
    </div>
  )
}

export default App

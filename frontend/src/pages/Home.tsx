import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import FeaturedExperiences from '../components/FeaturedExperiences';
import About from '../components/About';
import HowItWorks from '../components/HowItWorks';
import BecomeLocalGuide from '../components/ExperienceOwners';
import Footer from '../components/Footer';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-warm-gray font-sans flex flex-col">
            <Navbar />
            <div className="flex-grow">
                <Hero />
                <Categories />
                <FeaturedExperiences />
                <About />
                <HowItWorks />
                <BecomeLocalGuide />
            </div>
            <Footer />
        </div>
    );
};

export default Home;

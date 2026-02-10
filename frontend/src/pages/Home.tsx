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
    const [searchQuery, setSearchQuery] = React.useState('');

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        // Scroll to Featured Experiences if search is active
        if (query) {
            const featuredSection = document.getElementById('featured-experiences');
            if (featuredSection) {
                featuredSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <div className="min-h-screen bg-warm-gray font-sans flex flex-col">
            <Navbar />
            <div className="flex-grow">
                <Hero onSearch={handleSearch} />
                <Categories />
                <FeaturedExperiences searchQuery={searchQuery} />
                <About />
                <HowItWorks />
                <BecomeLocalGuide />
            </div>
            <Footer />
        </div>
    );
};

export default Home;

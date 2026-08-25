import Header from '../components/Home/Header';
import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';
import Footer from '../components/Home/Footer';

const Home = () => {

    

  return (
    <div className="min-h-screen bg-gray-50 font-sans relative">
      <Header />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
};

export default Home;

import Navbar from "./components/layout/Navbar";
import Hero from "./components/home/Hero";
import Features from "./components/home/Features";
import UpcomingEvents from "./components/home/UpcomingEvents";
import Footer from "./components/layout/Footer";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <UpcomingEvents />
      </main>
      <Footer />
    </div>
  );
}

export default App;
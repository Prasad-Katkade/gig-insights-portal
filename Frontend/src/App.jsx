import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Routes from "./routes";

function App() {
  return (
    <div className="min-h-screen w-full ">
      <Header />
      <Routes />
      <Footer/>
      
    </div>
  );
}

export default App;

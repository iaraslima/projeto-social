import { useState } from "react";
import Home from "./pages/home/Home.jsx";
import Biblia from "./pages/biblia/Biblia.jsx";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const navigateToBiblia = () => setCurrentPage("biblia");
  const navigateToHome = () => setCurrentPage("home");

  if (currentPage === "biblia") {
    return <Biblia onBack={navigateToHome} />;
  }

  return <Home onNavigateToBiblia={navigateToBiblia} />;
}

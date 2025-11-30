import { useState } from "react";
import Home from "./pages/home/Home.jsx";
import Biblia from "./pages/biblia/Biblia.jsx";
import AntigoTestamento from "./pages/antigoTestamento/AntigoTestamento.jsx";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const navigateToBiblia = () => setCurrentPage("biblia");
  const navigateToHome = () => setCurrentPage("home");
  const navigateToAntigoTestamento = () => setCurrentPage("antigoTestamento");
  const navigateBackToBiblia = () => setCurrentPage("biblia");

  if (currentPage === "antigoTestamento") {
    return <AntigoTestamento onBack={navigateBackToBiblia} />;
  }

  if (currentPage === "biblia") {
    return <Biblia onBack={navigateToHome} onNavigateToAntigoTestamento={navigateToAntigoTestamento} />;
  }

  return <Home onNavigateToBiblia={navigateToBiblia} />;
}

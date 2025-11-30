import React, { useState } from "react";
import Home from "./pages/home/Home.jsx";
import Biblia from "./pages/biblia/Biblia.jsx";
import AntigoTestamento from "./pages/antigoTestamento/AntigoTestamento.jsx";
import TelaCapitulos from "./pages/capitulos/TelaCapitulos"; 

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [livroSelecionado, setLivroSelecionado] = useState(null);

  const navigateToBiblia = () => setCurrentPage("biblia");
  const navigateToHome = () => setCurrentPage("home");
  const navigateToAntigoTestamento = () => setCurrentPage("antigoTestamento");
  const navigateBackToBiblia = () => setCurrentPage("biblia");

  const handleSelectBook = (livroId, livroNome) => {
    setLivroSelecionado({ id: livroId, nome: livroNome });
    setCurrentPage("capitulos");
  };

  const navigateBackToAntigoTestamento = () => {
    setLivroSelecionado(null); 
    setCurrentPage("antigoTestamento"); 
  };

  if (currentPage === "capitulos" && livroSelecionado) {
    return (
      <TelaCapitulos 
        livroId={livroSelecionado.id} 
        nomeInicial={livroSelecionado.nome}
        onVoltar={navigateBackToAntigoTestamento}
      />
    );
  }

  if (currentPage === "antigoTestamento") {
    return (
      <AntigoTestamento 
        onBack={navigateBackToBiblia} 
        onSelectBook={handleSelectBook} 
      />
    );
  }

  if (currentPage === "biblia") {
    return (
      <Biblia 
        onBack={navigateToHome} 
        onNavigateToAntigoTestamento={navigateToAntigoTestamento} 
      />
    );
  }

  return <Home onNavigateToBiblia={navigateToBiblia} />;
}
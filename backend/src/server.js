import app from "./app.js";
import { preCarregarBiblia } from "./services/biblia.service.js";

const PORT = 3000;

async function iniciarServidor() {
    try {
        console.log("Pré-carregando dados da Bíblia (cache ou download)...");
        await preCarregarBiblia(); 

        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT} e Bíblia pronta!`);
        });
    } catch (error) {
        console.error("Erro fatal ao iniciar o servidor ou carregar a Bíblia:", error);
        process.exit(1); 
    }
}

iniciarServidor();
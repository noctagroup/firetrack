export async function getProcessamentos() {
  // Simulação de dados - substitua por chamada via Axios futuramente
  return Promise.resolve({
    fenomenos: [
      {
        id: 1,
        title: "Processamento 1",
        dataInicio: "2024/03/01",
        dataFim: "2024/03/01",
        produto: "CB4-WPM-L2-DN-1",
        candidatos: 10,
        acao: "Baixar Candidatos",
      },
    ],
    aguardandoAnalise: [
      {
        id: 2,
        title: "Processamento 2",
        dataInicio: "2024/03/01",
        dataFim: "2024/03/01",
        produto: "CB4-WPM-L2-DN-1",
        candidatos: 10,
        acao: "Iniciar análise",
      },
    ],
    emProcessamento: [
      {
        id: 5,
        title: "Processamento 5",
        dataInicio: "2024/03/01",
        dataFim: "2024/03/01",
        produto: "CB4-WPM-L2-DN-1",
        estado: "Publishing",
      },
    ],
  });
}

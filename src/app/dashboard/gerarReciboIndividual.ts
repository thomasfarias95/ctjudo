import jsPDF from 'jspdf';

export const gerarReciboIndividual = (atleta: any) => {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format:'A6'
  });

  const dataHoje = new Date();
  const dataFormatada = dataHoje.toLocaleDateString('pt-BR');
  
  // Tratamento para exibir "PRÓPRIO" caso o responsável esteja nulo no banco
  const nomeAtleta = (atleta.nomeCompleto || atleta.nome || "Atleta").toUpperCase();
  const responsavel = (atleta.nomeResponsavel || "PRÓPRIO").toUpperCase();

  // --- DESIGN DO RECIBO ---
  doc.setFillColor(0, 51, 102); // Azul Marinho do CT
  doc.rect(0, 0, 105, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("RECIBO DE PAGAMENTO", 52.5, 12, { align: 'center' });
  doc.setFontSize(8);
  doc.text("CT FERROVIÁRIO DE JUDÔ", 52.5, 18, { align: 'center' });

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text(`DATA: ${dataFormatada}`, 10, 40);
  
  doc.setFont("helvetica", "bold");
  doc.text("ATLETA:", 10, 50);
  doc.setFont("helvetica", "normal");
  doc.text(nomeAtleta, 30, 50);

  doc.setFont("helvetica", "bold");
  doc.text("RESPONSÁVEL:", 10, 58);
  doc.setFont("helvetica", "normal");
  doc.text(responsavel, 45, 58);

  doc.setFont("helvetica", "bold");
  doc.text("VALOR:", 10, 66);
  doc.text("R$ 100,00", 30, 66);

  // --- MENSAGEM DE AGRADECIMENTO ---
  doc.setDrawColor(200, 200, 200);
  doc.line(10, 75, 95, 75);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  const mensagem = "Agradecemos a confiança no CT Ferroviário! O apoio da família é o que impulsiona nossos atletas no caminho do Judô. Oss!";
  const linhasMensagem = doc.splitTextToSize(mensagem, 85);
  doc.text(linhasMensagem, 10, 85);

  // --- CARIMBO DE CONFIRMAÇÃO ---
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(0.5);
  doc.roundedRect(25, 110, 55, 18, 3, 3, 'S');
  
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 51, 102);
  doc.setFontSize(8);
  doc.text("PAGAMENTO CONFIRMADO", 52.5, 117, { align: 'center' });
  doc.text("SENSEI ALDISIO SEVERINO", 52.5, 123, { align: 'center' });

  // Salva o arquivo no seu computador para envio manual
  const nomeArquivo = `Recibo_${nomeAtleta.split(' ')}_${dataFormatada.replace(/\//g, '-')}.pdf`;
  doc.save(nomeArquivo);
};
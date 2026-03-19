// app/dashboard/geradorPDF.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const gerarDocumentoAtleta = (atleta: any) => {
  const doc = new jsPDF();
  const dataHoje = new Date().toLocaleDateString('pt-BR');
  const anoAtual = new Date().getFullYear();

  // --- DESIGN DO CABEÇALHO ---
  doc.setFillColor(0, 51, 102); // Azul Marinho do CT
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("CT FERROVIÁRIO DE JUDÔ", 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text("Formando Campeões dentro e fora do Tatame", 105, 28, { align: 'center' });

  // --- INFORMAÇÕES DO ATLETA ---
  doc.setTextColor(0);
  doc.setFontSize(14);
  doc.text("COMPROVANTE DE MATRÍCULA E CRONOGRAMA", 20, 55);
  
  doc.setFontSize(11);
  const infoY = 65;
  doc.text(`Atleta: ${atleta.nomeCompleto}`, 20, infoY);
  doc.text(`Responsável: ${atleta.nomeResponsavel || 'Próprio'}`, 20, infoY + 7);
  doc.text(`Turno: ${atleta.turno} | Graduação: ${atleta.graduacao}`, 20, infoY + 14);
  doc.text(`Vencimento: Todo dia ${atleta.diaVencimento}`, 20, infoY + 21);
  doc.text(`Data de Emissão: ${dataHoje}`, 140, infoY);

  // --- TABELA DE MENSALIDADES (LOGÍSTICA ANUAL) ---
  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const rows = meses.map((mes, index) => [
    mes,
    `${atleta.diaVencimento}/${String(index + 1).padStart(2, '0')}/${anoAtual}`,
    "R$ 100,00", // Valor fixo ou vindo do banco
    "Assinatura: ________________"
  ]);

  autoTable(doc, {
    startY: 95,
    head: [['Mês de Referência', 'Data Prevista', 'Valor Sugerido', 'Recibo de Pagamento']],
    body: rows,
    headStyles: { fillColor: [0, 51, 102] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    theme: 'grid'
  });

  // --- RODAPÉ ---
  const finalY = (doc as any).lastAutoTable.finalY + 35;
  doc.setFontSize(9);
  doc.text("Este documento serve como cronograma financeiro para os pais e responsáveis.", 105, finalY, { align: 'center' });
  doc.text("CT Ferroviário - Recife, PE", 105, finalY + 5, { align: 'center' });

  // Download
  doc.save(`Ficha_${atleta.nomeCompleto.split(' ')[0]}_${anoAtual}.pdf`);
};
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const gerarDocumentoAtleta = (atleta: any) => {
  const doc = new jsPDF();
  const dataHoje = new Date().toLocaleDateString('pt-BR');
  const anoAtual = new Date().getFullYear();

  // --- TRATAMENTO ANTI-NULL ---
  const nome = (atleta.nomeCompleto || atleta.nome || "Atleta Não Identificado").toUpperCase();
  const responsavel = (atleta.nomeResponsavel || "Próprio (Maior de Idade)").toUpperCase();
  const turno = (atleta.turno || "Não Definido").toUpperCase();
  const graduacao = (atleta.graduacao || "Branca").toUpperCase();
  const vencimento = atleta.diaVencimento || "10";

  // --- CABEÇALHO ---
  doc.setFillColor(0, 51, 102);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("CT FERROVIÁRIO DE JUDÔ", 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text("Formando Campeões dentro e fora do Tatame", 105, 28, { align: 'center' });

  // --- INFO ---
  doc.setTextColor(0);
  doc.setFontSize(14);
  doc.text("COMPROVANTE DE MATRÍCULA E CRONOGRAMA", 20, 55);
  
  doc.setFontSize(11);
  const infoY = 65;
  doc.text(`Atleta: ${nome}`, 20, infoY);
  doc.text(`Responsável: ${responsavel}`, 20, infoY + 7);
  doc.text(`Turno: ${turno} | Graduação: ${graduacao}`, 20, infoY + 14);
  doc.text(`Vencimento: Todo dia ${vencimento}`, 20, infoY + 21);
  doc.text(`Data de Emissão: ${dataHoje}`, 140, infoY);

  // --- TABELA ---
  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const rows = meses.map((mes, index) => [
    mes,
    `${String(vencimento).padStart(2, '0')}/${String(index + 1).padStart(2, '0')}/${anoAtual}`,
    "R$ 100,00", 
    "Assinatura: ________________"
  ]);

  autoTable(doc, {
    startY: 95,
    head: [['Mês de Referência', 'Data Prevista', 'Valor Sugerido', 'Recibo de Pagamento']],
    body: rows,
    headStyles: { fillColor: },
    alternateRowStyles: { fillColor: },
    theme: 'grid',
    styles: { fontSize: 9 }
  });

  // --- RODAPÉ ---
  const finalY = (doc as any).lastAutoTable.finalY + 30;
  doc.setFontSize(9);
  doc.text("Este documento serve como cronograma financeiro para os pais e responsáveis.", 105, finalY, { align: 'center' });
  doc.text("CT Ferroviário - Recife, PE", 105, finalY + 5, { align: 'center' });

  doc.save(`Ficha_${nome.split(' ')}_${anoAtual}.pdf`);
};
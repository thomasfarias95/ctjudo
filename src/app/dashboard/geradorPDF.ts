import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const gerarDocumentoAtleta = (atleta: any) => {
  const doc = new jsPDF();
  const dataHoje = new Date();
  const mesAtualIndice = dataHoje.getMonth(); // 0 a 11
  const anoAtual = dataHoje.getFullYear();

  // Tratamento de dados (Null do banco vira PRÓPRIO)
  const nomeAtleta = (atleta.nomeCompleto || atleta.nome || "Atleta").toUpperCase();
  const responsavel = (atleta.nomeResponsavel || "PRÓPRIO").toUpperCase();
  const vencimento = atleta.diaVencimento || "28";

  // CABEÇALHO ESTILIZADO
  doc.setFillColor(0, 51, 102); 
  doc.rect(0, 0, 210, 40, 'F');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("CT FERROVIÁRIO DE JUDÔ", 105, 20, { align: 'center' });
  doc.setFontSize(10);
  doc.text("Comprovante de Quitação Anual", 105, 28, { align: 'center' });

  // INFOS DO ATLETA
  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.text(`ATLETA: ${nomeAtleta}`, 20, 55);
  doc.text(`RESPONSÁVEL: ${responsavel}`, 20, 62);
  doc.text(`EMISSÃO: ${dataHoje.toLocaleDateString('pt-BR')}`, 140, 55);

  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  
  const rows = meses.map((mes, index) => {
    // LÓGICA DO CARIMBO:
    // Só carimba se o status for EM_DIA E se for o mês atual (ou meses anteriores já pagos)
    const estaPago = atleta.statusPagamento === 'EM_DIA' && index <= mesAtualIndice;
    
    return [
      mes,
      `${String(vencimento).padStart(2, '0')}/${String(index + 1).padStart(2, '0')}/${anoAtual}`,
      "R$ 100,00", 
      estaPago ? "CONFIRMADO: CT FERROVIÁRIO" : "__________________________"
    ];
  });

  autoTable(doc, {
    startY: 80,
    head: [['Mês', 'Vencimento', 'Valor', 'Assinatura/Carimbo']],
    body: rows,
    headStyles: { fillColor:  'black'}, // Correção do erro visual
    alternateRowStyles: { fillColor: 'black' }, 
    didParseCell: (data) => {
      // Estiliza o "Carimbo" em azul escuro e negrito para destacar
      if (data.section === 'body' && data.column.index === 3 && data.cell.text.includes("CONFIRMADO")) {
        data.cell.styles.textColor = 'black';
        data.cell.styles.fontStyle = 'bold';
      }
    },
    theme: 'grid',
    styles: { fontSize: 9 }
  });

  doc.setFontSize(8);
  doc.text("Documento gerado automaticamente pelo sistema de gestão CT Ferroviário.", 105, 285, { align: 'center' });

  doc.save(`Recibo_${anoAtual}_${nomeAtleta.split(' ')}.pdf`);
};
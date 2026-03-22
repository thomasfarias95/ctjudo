import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const gerarDocumentoAtleta = (atleta: any) => {
  const doc = new jsPDF();
  const dataHoje = new Date().toLocaleDateString('pt-BR');
  const anoAtual = new Date().getFullYear();

  const nome = (atleta.nomeCompleto || atleta.nome || "Atleta Não Identificado").toUpperCase();
  const responsavel = (atleta.nomeResponsavel || "Próprio").toUpperCase();
  const vencimento = atleta.diaVencimento || "28";

  // CABEÇALHO
  doc.setFillColor(0, 51, 102);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("CT FERROVIÁRIO DE JUDÔ", 105, 20, { align: 'center' });
  doc.setFontSize(10);
  doc.text("Gestão Financeira e Administrativa", 105, 28, { align: 'center' });

  // INFO
  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.text(`ATLETA: ${nome}`, 20, 55);
  doc.text(`RESPONSÁVEL: ${responsavel}`, 20, 62);
  doc.text(`DATA DE EMISSÃO: ${dataHoje}`, 140, 55);

  // TABELA COM LÓGICA DE ASSINATURA
  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  
  const rows = meses.map((mes, index) => {
    // Se o atleta estiver "EM_DIA", assinamos automaticamente
    const estaPago = atleta.statusPagamento === 'EM_DIA';
    return [
      mes,
      `${String(vencimento).padStart(2, '0')}/${String(index + 1).padStart(2, '0')}/${anoAtual}`,
      "R$ 100,00", 
      estaPago ? "ASSINADO: ALDISIO SEVERINO" : "Assinatura: ________________"
    ];
  });

  autoTable(doc, {
    startY: 80,
    head: [['Mês de Referência', 'Data Prevista', 'Valor Sugerido', 'Recibo de Pagamento']],
    body: rows,
    headStyles: { fillColor:'' },
    alternateRowStyles: { fillColor:'' },
    // Colore a assinatura do Sensei de verde no PDF
    didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 3 && data.cell.text.includes("ALDISIO")) {
            data.cell.styles.textColor = '';
            data.cell.styles.fontStyle = 'bold';
        }
    },
    theme: 'grid',
    styles: { fontSize: 9 }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 20;
  doc.setFontSize(8);
  doc.text("Documento oficial para controle de mensalidades do CT Ferroviário.", 105, finalY, { align: 'center' });

  const primeiroNome = nome.split(' ');
  doc.save(`Ficha_Financeira_${primeiroNome}.pdf`);
};
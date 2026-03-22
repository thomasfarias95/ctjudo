import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const gerarDocumentoAtleta = (atleta: any) => {
  const doc = new jsPDF();
  const dataHoje = new Date().toLocaleDateString('pt-BR');
  const anoAtual = new Date().getFullYear();

  // Tratamento de dados
  const nome = (atleta.nomeCompleto || atleta.nome || "Atleta Não Identificado").toUpperCase();
  const responsavel = (atleta.nomeResponsavel || "PRÓPRIO").toUpperCase();
  const vencimento = atleta.diaVencimento || "28";

  // CABEÇALHO
  doc.setFillColor(0, 51, 102); // Azul Marinho do CT
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("CT FERROVIÁRIO DE JUDÔ", 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text("Gestão Financeira e Administrativa", 105, 28, { align: 'center' });

  // INFORMAÇÕES
  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.text(`ATLETA: ${nome}`, 20, 55);
  doc.text(`RESPONSÁVEL: ${responsavel}`, 20, 62);
  doc.text(`DATA DE EMISSÃO: ${dataHoje}`, 140, 55);

  // TABELA DE HISTÓRICO ANUAL (Vigente)
  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const rows = meses.map((mes, index) => {
    // Se o status for EM_DIA, já sai com a assinatura do Sensei
    const estaPago = atleta.statusPagamento === 'EM_DIA';
    
    return [
      mes,
      `${String(vencimento).padStart(2, '0')}/${String(index + 1).padStart(2, '0')}/${anoAtual}`,
      "R$ 100,00", 
      estaPago ? "Assinatura: ________________" : "Assinatura: ________________"
    ];
  });

  autoTable(doc, {
    startY: 80,
    head: [['Mês de Referência', 'Data Prevista', 'Valor Sugerido', 'Recibo de Pagamento']],
    body: rows,
    headStyles: { fillColor: 'gray'}, // CORRIGIDO: Valores adicionados aqui
    alternateRowStyles: { fillColor: 'black'}, // CORRIGIDO: Valores adicionados aqui
    didParseCell: (data) => {
      // Estiliza a assinatura automática em verde se existir
      if (data.section === 'body' && data.column.index === 3 && data.cell.text.includes("ALDISIO")) {
        data.cell.styles.textColor = 'black';
        data.cell.styles.fontStyle = 'bold';
      }
    },
    theme: 'grid',
    styles: { fontSize: 9 }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 20;
  doc.setFontSize(8);
  doc.text("Este documento serve como cronograma financeiro e recibo de quitação.", 105, finalY, { align: 'center' });
  doc.text("CT Ferroviário - Recife, PE", 105, finalY + 5, { align: 'center' });

  const primeiroNome = nome.split(' ');
  doc.save(`Carnê_${anoAtual}_${primeiroNome}.pdf`);
};
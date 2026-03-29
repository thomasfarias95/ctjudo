import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const gerarDocumentoAtleta = (atleta: any) => {
  const doc = new jsPDF();
  const dataHoje = new Date();
  const mesAtualIndice = dataHoje.getMonth();
  const anoAtual = dataHoje.getFullYear();

  const nomeAtleta = (atleta.nomeCompleto || atleta.nome || "Atleta").toUpperCase();
  const papel = (atleta.papel || "ALUNO").toUpperCase();
  const responsavel = (atleta.nomeResponsavel || "PRÓPRIO").toUpperCase();
  const vencimento = atleta.diaVencimento || "10";

  // CABEÇALHO ESTILIZADO (Azul Marinho CTF)
  doc.setFillColor(0, 51, 102); 
  doc.rect(0, 0, 210, 40, 'F');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("CT FERROVIÁRIO DE JUDÔ", 105, 20, { align: 'center' });
  doc.setFontSize(10);
  doc.text("Relatório de Situação Cadastral e Financeira", 105, 28, { align: 'center' });

  // INFOS DO ATLETA
  doc.setTextColor(0);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`ATLETA/PROFESSOR: ${nomeAtleta}`, 20, 55);
  doc.setFont("helvetica", "normal");
  doc.text(`RESPONSÁVEL: ${papel === 'PROFESSOR' ? 'N/A' : responsavel}`, 20, 62);
  doc.text(`GRADUAÇÃO: ${atleta.graduacao || 'BRANCA'}`, 20, 69);
  doc.text(`EMISSÃO: ${dataHoje.toLocaleDateString('pt-BR')}`, 140, 55);

  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  
  const rows = meses.map((mes, index) => {
    // Se for PROFESSOR, mostra Isento. Se for ALUNO, checa pagamento.
    const isProfessor = papel === 'PROFESSOR';
    const estaPago = (atleta.statusPagamento === 'EM_DIA' && index <= mesAtualIndice) || isProfessor;
    
    return [
      mes,
      `${String(vencimento).padStart(2, '0')}/${String(index + 1).padStart(2, '0')}/${anoAtual}`,
      isProfessor ? "ISENTO" : "R$ 100,00", 
      estaPago ? (isProfessor ? "PERFIL DOCENTE" : "PAGO: CT FERROVIÁRIO") : "__________________________"
    ];
  });

  autoTable(doc, {
    startY: 80,
    head: [['Mês', 'Vencimento', 'Valor', 'Status / Assinatura']],
    body: rows,
    headStyles: { fillColor:'black', textColor: 255, fontStyle: 'bold' }, // Azul CTF no topo
    alternateRowStyles: { fillColor:'black' }, // Cinza clarinho para leitura
    didParseCell: (data) => {
      // Destaca o status de PAGO ou ISENTO em negrito
      if (data.section === 'body' && data.column.index === 3) {
        if (data.cell.text.includes("PAGO") || data.cell.text.includes("DOCENTE")) {
          data.cell.styles.textColor = 'gray'; // Verde escuro
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 3 }
  });

  // RODAPÉ
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text("Documento gerado pelo sistema de gestão CT Ferroviário - Oss!", 105, 285, { align: 'center' });

  // Nome do arquivo sem espaços estranhos
  const nomeArquivo = nomeAtleta.replace(/\s+/g, '_');
  doc.save(`Ficha_${anoAtual}_${nomeArquivo}.pdf`);
};
export const getFinanceiro = async (atletaId: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/financeiro/${atletaId}`);
  return response.json();
};
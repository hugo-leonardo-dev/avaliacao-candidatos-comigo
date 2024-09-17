interface Ticket {
  id?: number; 
  tipo: string;
  motivo: string;
  descricao: string;
  clienteId: number;
  veiculo: string;
  dataAbertura: string;
  prazo: string;
  status: string;
}

const isValidISO8601 = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date.toISOString() === dateString;
};

export const validarTicket = (ticket: Ticket): string[] => {
  const errors: string[] = [];

  if (!ticket.tipo || ticket.tipo.trim() === '') {
    errors.push('O campo "tipo" é obrigatório.');
  }

  if (!ticket.motivo || ticket.motivo.trim() === '') {
    errors.push('O campo "motivo" é obrigatório.');
  }

  if (!ticket.descricao || ticket.descricao.trim() === '') {
    errors.push('O campo "descrição" é obrigatório.');
  }

  if (!ticket.clienteId) {
    errors.push('O campo "cliente" é obrigatório.');
  }

  if (!ticket.veiculo || ticket.veiculo.trim() === '') {
    errors.push('O campo "veículo" é obrigatório.');
  }

  if (!ticket.dataAbertura || !isValidISO8601(ticket.dataAbertura)) {
    errors.push('O campo "data de abertura" deve estar no formato ISO 8601 (YYYY-MM-DDTHH:MM:SSZ).');
  }

  if (!ticket.prazo || !isValidISO8601(ticket.prazo)) {
    errors.push('O campo "prazo" deve estar no formato ISO 8601 (YYYY-MM-DDTHH:MM:SSZ).');
  }

  const validStatuses = ['a_fazer', 'em_andamento', 'concluido'];
  if (!validStatuses.includes(ticket.status)) {
    errors.push(`O campo "status" deve ser um dos seguintes valores: ${validStatuses.join(', ')}.`);
  }

  return errors;
};

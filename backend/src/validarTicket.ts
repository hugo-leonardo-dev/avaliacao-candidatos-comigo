interface Ticket {
  id?: number; // ID opcional para criação
  tipo: string;
  motivo: string;
  descricao: string;
  clienteId: number; // Atualizado para clienteId
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

  // Validação do tipo
  if (!ticket.tipo || ticket.tipo.trim() === '') {
    errors.push('O campo "tipo" é obrigatório.');
  }

  // Validação do motivo
  if (!ticket.motivo || ticket.motivo.trim() === '') {
    errors.push('O campo "motivo" é obrigatório.');
  }

  // Validação da descrição
  if (!ticket.descricao || ticket.descricao.trim() === '') {
    errors.push('O campo "descrição" é obrigatório.');
  }

  // Validação do clienteId
  if (!ticket.clienteId) {
    errors.push('O campo "cliente" é obrigatório.');
  }

  // Validação do veículo
  if (!ticket.veiculo || ticket.veiculo.trim() === '') {
    errors.push('O campo "veículo" é obrigatório.');
  }

  // Validação da data de abertura (formato ISO 8601 completo)
  if (!ticket.dataAbertura || !isValidISO8601(ticket.dataAbertura)) {
    errors.push('O campo "data de abertura" deve estar no formato ISO 8601 (YYYY-MM-DDTHH:MM:SSZ).');
  }

  // Validação do prazo (formato ISO 8601 completo)
  if (!ticket.prazo || !isValidISO8601(ticket.prazo)) {
    errors.push('O campo "prazo" deve estar no formato ISO 8601 (YYYY-MM-DDTHH:MM:SSZ).');
  }

  // Validação do status (ex: a_fazer, em_andamento, concluido)
  const validStatuses = ['a_fazer', 'em_andamento', 'concluido'];
  if (!validStatuses.includes(ticket.status)) {
    errors.push(`O campo "status" deve ser um dos seguintes valores: ${validStatuses.join(', ')}.`);
  }

  return errors;
};

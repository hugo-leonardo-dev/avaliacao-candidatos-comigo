import React from 'react';
import { Ticket } from '../types/types';

interface TicketsTableProps {
  tickets: Ticket[];
  onEdit: (ticket: Ticket) => void;
  onDelete: (ticketId: number) => void;
  isAdmin: boolean;
}

const TicketsTable: React.FC<TicketsTableProps> = ({ tickets, onEdit, onDelete, isAdmin }) => {
  console.log("isAdmin:", isAdmin);
  const handleDelete = (ticketId: number) => {
    const confirmDelete = window.confirm('Tem certeza de que deseja excluir este ticket?');
    if (confirmDelete) {
      onDelete(ticketId);
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'a_fazer':
        return 'A Fazer';
      case 'em_andamento':
        return 'Em Andamento';
      case 'concluido':
        return 'Concluído';
      default:
        return status;
    }
  };

  return (
    <div className="px-8">
  <div className="overflow-x-auto">
    <table className="min-w-full table-auto bg-white border-collapse rounded-lg shadow-sm border-spacing-4">
      <thead className="bg-[#f1f5f9]">
        <tr>
          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 rounded-tl-lg">ID</th>
          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tipo</th>
          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Motivo</th>
          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Descrição</th>
          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cliente</th>
          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Veículo</th>
          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Data de Abertura</th>
          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Prazo</th>
          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 rounded-tr-lg">Ações</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((ticket) => (
          <tr key={ticket.id} className="border-b border-gray-200">
            <td className="p-4 text-left rounded-bl-lg">{ticket.id}</td>
            <td className="p-4 text-left">{ticket.tipo}</td>
            <td className="p-4 text-left">{ticket.motivo}</td>
            <td className="p-4 text-left">{ticket.descricao}</td>
            <td className="p-4 text-left">{ticket.cliente.nome}</td>
            <td className="p-4 text-left">{ticket.veiculo}</td>
            <td className="p-4 text-left">{new Date(ticket.dataAbertura).toLocaleDateString()}</td>
            <td className="p-4 text-left">{new Date(ticket.prazo).toLocaleDateString()}</td>
            <td className="p-4 text-left">{formatStatus(ticket.status)}</td>
            <td className="px-4 py-4 text-center rounded-br-lg">
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => onEdit(ticket)}
                  className="text-blue-500 hover:text-blue-700"
                  aria-label="Editar ticket"
                >
                  <svg className="w-[24px] h-[24px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"/>
                  </svg>
                </button>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(ticket.id)}
                    className="text-red-600 hover:text-red-900"
                    aria-label="Excluir ticket"
                  >
                    <svg className="w-[24px] h-[24px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M6 6l12 12m-12 0l12-12"/>
                    </svg>
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default TicketsTable;

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import TicketFilter from '../components/TicketFilter';
import TicketsTable from '../components/TicketsTable';
import TicketForm from '../components/TicketForm';
import { Ticket, TicketFilterState, Cliente, TicketFormData } from '../types/types';

const HomePage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState<TicketFilterState>({
    periodo: '',
    ordenadoPor: 'dataAbertura',
    status: '',
    tipo: '',
    motivo: '',
    cliente: '',
    veiculo: '',
  });
  const [showSidebar, setShowSidebar] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await fetch('http://localhost:3000/tickets', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar tickets');
      }

      const data = await response.json();
      setTickets(data);
      setFilteredTickets(data);
    } catch (error) {
      console.error('Erro ao buscar tickets:', error);
    }
  };

  const fetchClientes = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await fetch('http://localhost:3000/clientes', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.error('Usuário não autorizado. Redirecionando para o login.');
        }
        throw new Error('Erro ao buscar clientes');
      }

      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchClientes();
  
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false); // Defina como false caso o papel não seja admin
    }
  }, []);
  
  

  const handleFilterChange = (newFilter: Partial<TicketFilterState>) => {
    setFilter(prevFilter => {
      const updatedFilter = { ...prevFilter, ...newFilter };
      applyFilters(updatedFilter);
      return updatedFilter;
    });
  };

  const handleClearFilters = () => {
    const resetFilter: TicketFilterState = {
      periodo: '',
      ordenadoPor: 'dataAbertura',
      status: '',
      tipo: '',
      motivo: '',
      cliente: '',
      veiculo: '',
    };
    setFilter(resetFilter);
    applyFilters(resetFilter);
  };

  const applyFilters = (filter: TicketFilterState) => {
    let filtered = tickets;

    if (filter.status) {
      filtered = filtered.filter(ticket => ticket.status.includes(filter.status));
    }
    if (filter.tipo) {
      filtered = filtered.filter(ticket => ticket.tipo.includes(filter.tipo));
    }
    if (filter.motivo) {
      filtered = filtered.filter(ticket => ticket.motivo.includes(filter.motivo));
    }
    if (filter.cliente) {
      filtered = filtered.filter(ticket => ticket.clienteId === Number(filter.cliente));
    }
    if (filter.veiculo) {
      filtered = filtered.filter(ticket => ticket.veiculo.includes(filter.veiculo));
    }

    if (filter.ordenadoPor) {
      filtered = filtered.sort((a, b) => {
        const aValue = a[filter.ordenadoPor as keyof Ticket];
        const bValue = b[filter.ordenadoPor as keyof Ticket];

        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
      });
    }

    setFilteredTickets(filtered);
  };

  const handleSubmit = async (ticketData: TicketFormData) => {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      };
  
      let response;

        if (editingTicket?.id) {
        response = await fetch(`http://localhost:3000/tickets/${editingTicket.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(ticketData),
        });
      } else {
        response = await fetch('http://localhost:3000/tickets', {
          method: 'POST',
          headers,
          body: JSON.stringify(ticketData),
        });
      }
  
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Erro ao salvar ticket:', errorResponse);
        throw new Error(`Erro ao salvar ticket: ${errorResponse.erro || errorResponse.erros.join(', ')}`);
      }
  
      console.log('Ticket salvo com sucesso!');
      await fetchTickets();
      setShowSidebar(false);
      setEditingTicket(null); 
    } catch (error) {
      console.error('Erro na requisição de criação/edição do ticket:', error);
    }
  };
  

  const handleEdit = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setShowSidebar(true);
  };

  const handleDelete = async (ticketId: number) => {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      };

      const response = await fetch(`http://localhost:3000/tickets/${ticketId}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Erro ao excluir ticket:', errorResponse);
        throw new Error(`Erro ao excluir ticket: ${errorResponse.erro || errorResponse.erros.join(', ')}`);
      }

      console.log('Ticket excluído com sucesso!');
      await fetchTickets();
    } catch (error) {
      console.error('Erro na requisição de exclusão do ticket:', error);
    }
  };

  const totalTickets = tickets.length;
  const displayedTickets = filteredTickets.length;

  return (
    <div>
      <Header />
      <div className="flex items-start gap-4 my-4 px-8">
        <button
          onClick={() => setShowSidebar(true)}
          className="bg-custom-blue text-white px-4 py-2 rounded-md"
        >
          Criar Ticket +
        </button>
        <TicketFilter
          filter={filter}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      </div>

      <TicketsTable
        tickets={filteredTickets}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isAdmin={isAdmin}
      />

      <div className="mt-4 px-8 text-center text-gray-600">
        Exibindo {displayedTickets} de {totalTickets} do total de {totalTickets} registros
      </div>

      {showSidebar && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowSidebar(false)}></div>
          <div className="fixed inset-0 flex justify-end z-50">
            <div className="relative bg-white w-[580px] p-4 shadow-lg">
              <button
                type="button"
                onClick={() => setShowSidebar(false)}
                className="absolute top-2 left-[-32px] text-gray-600 hover:text-gray-900"
                aria-label="Fechar"
              >
                <svg className="w-[32px] h-[32px] text-white hover:text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <TicketForm
                onSubmit={handleSubmit}
                onClose={() => setShowSidebar(false)}
                clientes={clientes}
                initialData={editingTicket ? {
                  tipo: editingTicket.tipo,
                  motivo: editingTicket.motivo,
                  descricao: editingTicket.descricao,
                  clienteId: editingTicket.clienteId,
                  veiculo: editingTicket.veiculo,
                  dataAbertura: new Date(editingTicket.dataAbertura).toISOString().slice(0, 16),
                  prazo: new Date(editingTicket.prazo).toISOString().slice(0, 16),
                  status: editingTicket.status
                } : undefined}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;

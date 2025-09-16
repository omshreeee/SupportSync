import React, { useEffect, useState } from "react";
import axios from "axios";

const TicketList = ({ isAdmin }) => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const url = isAdmin ? 'http://localhost:5000/api/admin/tickets' : 'http://localhost:5000/api/tickets';
    axios.get(url, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(r => setTickets(r.data));
  }, [isAdmin]);

  const closeTicket = (id) => {
    axios.put(`http://localhost:5000/api/admin/tickets/${id}`, { status: "closed" }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(() => window.location.reload());
  };

  return (
    <div>
      {tickets.map(t => (
        <div key={t.id}>
          <b>{t.title}</b> | Status: {t.status} | Priority: {t.priority}
          {isAdmin && t.status !== 'closed' && (
            <button onClick={() => closeTicket(t.id)}>Close</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TicketList;

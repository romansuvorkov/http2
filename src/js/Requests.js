export default class Requests {
  constructor() {
    this.server = 'http://localhost:7070/';
  }

  createTicket(name, description) {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams();
      params.append('name', name);
      params.append('description', description);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${this.server}/ticketList`);
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          return resolve(xhr.responseText);
        }
        return reject(xhr.responseText);
      });
      xhr.send(params);
    });
  }

  getTickets() {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `${this.server}/ticketList`);
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const ticketList = JSON.parse(xhr.responseText);
          return resolve(ticketList);
        }
        return reject(xhr.responseText);
      });
      xhr.send();
    });
  }

  redactTicket(id, name, description) {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams();
      params.append('id', id);
      params.append('name', name);
      params.append('description', description);

      const xhr = new XMLHttpRequest();
      xhr.open('PUT', `${this.server}/ticketList`);
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          return resolve(xhr.responseText);
        }
        return reject(xhr.responseText);
      });
      xhr.send(params);
    });
  }

  getDescription(id) {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams();
      params.append('id', id);
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `${this.server}/ticketList?${params}`);
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const description = xhr.responseText;
          return resolve(description);
        }
        return reject(xhr.responseText);
      });
      xhr.send();
    });
  }

  deleteTicket(id) {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams();
      params.append('id', id);
      const xhr = new XMLHttpRequest();
      xhr.open('DELETE', `${this.server}/ticketList?${params}`);
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const ticketList = xhr.responseText;
          return resolve(ticketList);
        }
        return reject(xhr.responseText);
      });
      xhr.send();
    });
  }

  changeStatus(id, status) {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams();
      params.append('id', id);
      params.append('status', status);

      const xhr = new XMLHttpRequest();
      xhr.open('PATCH', `${this.server}/ticketList?${params}`);
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const ticketList = xhr.responseText;
          return resolve(ticketList);
        }
        return reject(xhr.responseText);
      });
      xhr.send();
    });
  }
}

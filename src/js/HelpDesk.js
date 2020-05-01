import changeVisability from './changeVisability';

export default class HelpDesk {
  constructor(requests) {
    this.requests = requests;
    this.addBtn = document.querySelector('.add_button');
    this.container = document.querySelector('.help_desk');
    this.delForm = document.querySelector('.delete_form');
    this.redactForm = document.querySelector('.redact_form');
    this.inputForm = document.querySelector('.input_form');
    this.inputName = this.inputForm.querySelector('.short_description');
    this.inputDescription = this.inputForm.querySelector('.long_description');
    this.redactName = this.redactForm.querySelector('.short_description');
    this.redactDescription = this.redactForm.querySelector('.long_description');
    this.tickets = document.querySelector('.tickets_list');
    this.redactTicketId = null;
    this.delItem = null;
  }

  async init() {
    let ticketsList = await this.requests.getTickets();
    this.drawTickets(ticketsList);

    this.addBtn.addEventListener('click', (event) => {
      event.preventDefault();
      changeVisability(this.inputForm, 'none', 'flex');
    });

    this.inputForm.addEventListener('click', async (event) => {
      if (event.target.classList.contains('save')) {
        event.preventDefault();
        await this.requests.createTicket(this.inputName.value, this.inputDescription.value);
        ticketsList = await this.requests.getTickets();
        this.drawTickets(ticketsList);
        changeVisability(this.inputForm, 'flex', 'none');
        this.inputName.value = '';
        this.inputDescription.value = '';
      } else if (event.target.classList.contains('reset')) {
        changeVisability(this.inputForm, 'flex', 'none');
      }
    });

    this.redactForm.addEventListener('click', async (event) => {
      if (event.target.classList.contains('save')) {
        event.preventDefault();
        await this.requests.redactTicket(this.redactTicketId, this.redactName.value, this.redactDescription.value);
        ticketsList = await this.requests.getTickets();
        this.drawTickets(ticketsList);
        changeVisability(this.redactForm, 'flex', 'none');
        this.inputName.value = '';
        this.inputDescription.value = '';
        this.redactTicketId = null;
      } else if (event.target.classList.contains('reset')) {
        changeVisability(this.redactForm, 'flex', 'none');
      }
    });

    this.delForm.addEventListener('click', async (event) => {
      if (event.target.classList.contains('save')) {
        event.preventDefault();
        await this.requests.deleteTicket(this.delItem);
        ticketsList = await this.requests.getTickets();
        this.drawTickets(ticketsList);
        this.delItem = null;
        changeVisability(this.delForm, 'flex', 'none');
      } else if (event.target.classList.contains('reset')) {
        changeVisability(this.delForm, 'flex', 'none');
      }
    });

    this.container.addEventListener('click', async (event) => {
      if (event.target.classList.contains('delete')) {
        this.delItem = event.target.closest('.list_item').dataset.id;
        changeVisability(this.delForm, 'none', 'flex');
      } else if (event.target.classList.contains('redact')) {
        changeVisability(this.redactForm, 'none', 'flex');
        this.redactTicketId = event.target.closest('.list_item').dataset.id;
        const redactingTicket = event.target.closest('.list_item');
        const redactingName = redactingTicket.querySelector('.item_name').innerText;
        const redactingItem = await this.requests.getDescription(this.redactTicketId);
        const redactingObj = JSON.parse(redactingItem);
        this.redactName.value = redactingName;
        this.redactDescription.value = redactingObj[0].description;
      } else if (event.target.classList.contains('status')) {
        let targetElStatus = null;
        const targetElId = event.target.closest('.list_item').dataset.id;
        if (event.target.innerText === '✓') {
          targetElStatus = false;
        } else {
          targetElStatus = true;
        }
        await this.requests.changeStatus(targetElId, targetElStatus);
        ticketsList = await this.requests.getTickets();
        this.drawTickets(ticketsList);
      } else if (event.target.classList.contains('list_item')) {
        const itemId = event.target.closest('.list_item').dataset.id;
        const descrContainer = event.target.closest('.list_item').querySelector('.item_descr');
        if (descrContainer.innerText === '') {
          const descriptionJSON = await this.requests.getDescription(itemId);
          const description = JSON.parse(descriptionJSON);
          descrContainer.innerText = description[0].description;
          descrContainer.classList.toggle('none');
        } else {
          descrContainer.innerText = '';
          descrContainer.classList.toggle('none');
        }
      }
    });
  }

  drawTickets(inputAtt) {
    this.tickets.innerHTML = '';
    for (const item of inputAtt) {
      const creationDate = new Date(item.created);
      const day = creationDate.getDate();
      const month = creationDate.getMonth() + 1;
      const year = creationDate.getFullYear();
      const hour = creationDate.getHours();
      const min = creationDate.getMinutes();
      const itemCreated = `${day}.${month}.${year} ${hour}:${min}`;
      const ticket = document.createElement('div');
      ticket.classList.add('list_item');
      ticket.dataset.id = item.id;
      let status = '';
      if (item.status === 'true') {
        status = '✓';
      }
      ticket.innerHTML = `
        <span class="status">${status}</span>
        <span class="item_name">${item.name}</span>
        <span class="item_date">${itemCreated}</span>
        <span class="redact"></span>
        <span class="delete">X</span>
        <span class="item_descr none"></span>
      `;
      this.tickets.appendChild(ticket);
    }
  }
}

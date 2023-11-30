import API from './Api';

class ClientListService {
  saveClient(values) {
    return API.post('/client-list', values);
  }
  updateClient(id, values) {
    return API.put('/client-list/' + id, values);
  }
  getClients() {
    return API.post('client-list/search?size=9999', {
      query: '',
    });
  }
}

export default new ClientListService();

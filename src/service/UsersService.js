import api from './Api';

const SAVE_USER = '/user/';
const GET_ALL_USERS = '/user/all';
const SEARCH_USERS = '/user/search';
const GET_SINGLE_USER = '/user/';
const UPDATE_USER = '/user/';
const DELETE_USER = '/user/';
const LOG_OUT = '/user/logout';
const REFRESH_TOKEN = '/auth/refresh/token';

class UsersService {
  saveUser(value) {
    return api.post(SAVE_USER, value);
  }

  getAllUsers() {
    return api.get(GET_ALL_USERS);
  }

  searchUsers(values) {
    console.log(SEARCH_USERS, values);
    return api.post(SEARCH_USERS, values);
  }

  getSingleUser(id) {
    return api.get(GET_SINGLE_USER + id);
  }

  updateUser(id, values) {
    console.log(UPDATE_USER + id, values);
    return api.put(UPDATE_USER + id, values);
  }

  deleteUser(id) {
    return api.delete(DELETE_USER + id);
  }

  refreshToken(value) {
    return api.post(REFRESH_TOKEN, { refreshToken: value });
  }

  toggleStatus(id, isActive) {
    return api.patch(`user/${id}?isActive=${isActive}`);
  }

  logOut() {
    return api.put(LOG_OUT);
  }

  resetPassword(id) {
    return api.put(`user/reset-password/${id}`);
  }

  changePassword(values, id) {
    return api.put(`user/change-password/${id}`, { ...values });
  }

  changeLogin(values, id) {
    return api.put(`user/change-login/${id}`, { ...values });
  }
}

export default new UsersService();

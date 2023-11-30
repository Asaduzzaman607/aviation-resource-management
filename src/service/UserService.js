import API from "./Api";

class UserService {
	signin(value) {
		return API.post('/auth/signin', value);
	}
}

export default new UserService();
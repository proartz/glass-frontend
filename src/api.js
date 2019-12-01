import AXIOS from 'axios'

const axios = AXIOS.create({
    baseURL: process.env.VUE_APP_URL,
});

export default {
    login(username, password) {
        return axios({
            method: 'post',
            url: '/login',
            data: {
                username: username,
                password: password
            }
        });
    },
    setHeader(token) {
        // set up authorization header
        axios.defaults.headers.common['Authorization'] = token;
    },
    deleteHeader() {
        delete axios.defaults.headers.common['Authorization'];
    },
    fetchUsers() {
        return axios({
            method: 'get',
            url: '/admin/users',
        })
    },
    addUser(user) {
        return axios({
            method: 'post',
            url: '/admin/user',
            data: user
        })
    }
}
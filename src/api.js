import axios from 'axios'

const AXIOS = axios.create({
    baseURL: "http://192.168.1.30:9090",
});

export default {
    login(username, password) {
        console.log(username);
        console.log(password);
        return AXIOS({
            method: 'post',
            url: '/login',
            data: {
                username: username,
                password: password
            }
        });
    }
}
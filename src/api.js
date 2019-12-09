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
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
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
    },
    deleteUser(user) {
        return axios({
            method: 'delete',
            url: '/admin/user',
            data: {
                id: user.id
            }
        })
    },
    fetchOrders() {
        return axios({
            method: 'get',
            url: '/orders',
        })
    },
    fetchOrder(id) {
        return axios({
            method: 'get',
            url: '/order/' + id,
        })
    },
    fetchMaterials() {
        return axios({
            method: 'get',
            url: '/materials',
        })
    },
    changeStatus(changeStatusDto) {
        return axios({
            method: 'post',
            url: '/changeStatus',
            data: changeStatusDto
        })
    },
    updateOrder(order) {
        return axios({
            method: 'post',
            url: '/updateOrder',
            data: order
        })
    },
    addOrder(order) {
        return axios({
            method: 'post',
            url: '/order',
            data: order
        })
    },
    deleteItem(deleteItemDto) {
        return axios({
            method: 'delete',
            url: '/item',
            data: deleteItemDto
        })
    },
    fetchItems(orderId) {
        return axios({
            method: 'get',
            url: '/items' + orderId,
        })
    }
}
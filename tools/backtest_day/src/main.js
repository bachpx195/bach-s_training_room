import Vue from 'vue'
import App from './App.vue'
import store from './store/store'
import axios from 'axios'

// MOB_DEBUG=true npm run test - Enables mobile debugging
// (sending console output to the webpack terminal)
// if (MOB_DEBUG) {
//     console.log = debug
//     console.error = debug
//     console.warn = debug
// }

Vue.prototype.axios = axios;

new Vue({
    el: '#app',
    store,
    axios,
    render: h => h(App)
})

function debug(...argv) {
    fetch('/debug?argv=' + JSON.stringify(argv))
}

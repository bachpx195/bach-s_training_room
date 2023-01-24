// transfer data between not relate component
// Usage
// emmiter: use bus.$emit to trigger an event to send data
// receiver: use bus.$on to listen event and handle data
// NOTICE: Should call bus.$off in beforeDestroy function to off event
import Vue from 'vue'
export default new Vue()

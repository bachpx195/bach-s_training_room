import Vue from 'vue'
import Vuex from 'vuex'
import createState from './state'
import getters from './getters'
import mutations from './mutations'
import * as actions from './actions'

Vue.use(Vuex)

const createStore = () => {
  return new Vuex.Store({
    state: createState(),
    getters,
    mutations,
    actions,
  })
}

export default createStore

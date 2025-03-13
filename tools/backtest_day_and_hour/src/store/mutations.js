import { SET_STATE } from './mutation-types'
import Vue from 'vue'

export default {
  [SET_STATE] (state, data) {
    Vue.set(state, data.key, data.value)
  }
}

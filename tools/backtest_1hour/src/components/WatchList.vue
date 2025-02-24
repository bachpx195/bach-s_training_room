
<template>
    <!-- Main component  -->
    <div id="watch-list" v-if="info" :style="style">
      <table class="table table-dark">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Price</th>
            <th scope="col">change %</th>
            <th scope="col">24h change</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">BTC</th>
            <td>{{ info.btc_close }}</td>
            <td :class="`${info.btc_return_day > 0 ? 'green' : 'red'}`">
              {{ info.btc_return_day }}
            </td>
            <td :class="`${info.btc_return_24h > 0 ? 'green' : 'red'}`">
              {{ info.btc_return_24h }}
            </td>
          </tr>
          <tr>
            <th scope="row">LTC</th>
            <td>{{ info.close }}</td>
            <td :class="`${info.return_day > 0 ? 'green' : 'red'}`">
              {{ info.return_day }}
            </td>
            <td :class="`${info.return_24h > 0 ? 'green' : 'red'}`">
              {{ info.return_24h }}
            </td>
          </tr>
          <tr>
            <th scope="row">LTC.B</th>
            <td>{{ altPrice(info.altbtc_close) }}</td>
            <td :class="`${info.altbtc_return_day > 0 ? 'green' : 'red'}`">
              {{ info.altbtc_return_day }}
            </td>
            <td :class="`${info.altbtc_return_24h > 0 ? 'green' : 'red'}`">
              {{ info.altbtc_return_24h }}
            </td>
          </tr>
        </tbody>
      </table>
      <h1>{{ currentDateFormat('dddd') }}</h1>
      <h1>{{ currentDateFormat('HH') }}</h1>
      <h2 :class="`${info.return_oc > 0 ? 'green' : 'red'}`">ReturnOC: {{ info.return_oc }} </h2>
      <h2>ReturnHL: {{ info.return_hl }}</h2>
    </div>
</template>

<script>

import _ from "lodash"
import moment from 'moment'

export default {
    name: 'WatchList',
    components: {  },
    mixins: [],
    props: {
      width: {
          type: Number,
          default: 800
      },
      height: {
          type: Number,
          default: 421
      },
      // eslint-disable-next-line vue/require-default-prop
      info: {},
      // eslint-disable-next-line vue/require-default-prop
      currentTime: {
          type: String
      }
    },
    data() {
        return {
        }
    },
    computed: {
        style() {
            return 'width: ' + this.$props.width + 'px; height: ' + this.$props.height + 'px'
        },
        
    },
    methods: {
      altPrice(price){
        return _.round(price * 100, 4)
      },
      currentDateFormat(format) {
        return moment(this.currentTime).format(format)
      },
    }
}
</script>
<style>
#watch-list {
    background: black;
    bottom: 0;
    right: 0;
    font-size: 15px;
    color: red;
    height: auto;
}
.green {
  background: green;
  color: white;
}
.red {
  background: red;
  color: white;
}
</style>

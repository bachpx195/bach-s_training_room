<template>
  <div 
    :style="{
    // eslint-disable-next-line vue/this-in-template
    width: this.width+'px',
    // eslint-disable-next-line vue/this-in-template
    height: this.height+'px'}" >
    <Bar
      id="my-chart-id"
      :options="chartOptions"
      :data="barData"
    />
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },
  props: {
      // eslint-disable-next-line vue/require-default-prop
    barData: {
        type: Object
    },
    // eslint-disable-next-line vue/require-default-prop
    chartOptions: {
        type: Object
    },
    width: {
      type: Number,
      default: 800
    },
    height: {
        type: Number,
        default: 421
    },
  },
}
</script>
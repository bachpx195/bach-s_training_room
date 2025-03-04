<template>
    <div>
        <config-chart
            :width="width"
            :height="50"
            :selected="configSelected"
            @select-merchandise="onSelectMerchandise"
            @select-day-number="onSelectDayNumber" />
        <div class="main-container">
            <bar-chart v-if="!loading" :bar-data="barData" />
        </div>
    </div>
</template>

<script>

import ConfigChart from './components/ConfigChart.vue'
import BarChart from './BarChart.vue'


import _ from "lodash"

export default {
    name: 'app',
    components: {
        ConfigChart, BarChart
    },
    data() {
        return {
            barData: {
                labels: [],
                datasets: [],
            },
            loading: true,
            width: window.innerWidth,
            height: window.innerHeight,
            colors: {
                // colorBack: '#fff',
                // colorGrid: '#eee',
                // colorText: '#333',
            },
            configSelected: {
                // TODO: chọn cặp hiển thị default
                merchandiseId: this.$store.state.merchandises[1].id,
                dayNumber: 30
            },
            merchandiseRateSelected: {
                // Cặp alt/usdt
                mainId: 35
            },
        };
    },
    computed: {
        findMerchandiseRateMain() {
            const merchandise = _.find(this.$store.state.merchandiseRates, { base_id: this.configSelected.merchandiseId, quote_id: 13 });
            return merchandise
        }
    },
    created() {
        this.getEffectHourCandlestickTypeInDay()
    },
    mounted() {
        window.addEventListener('resize', this.onResize)
        window.dc = this.chart
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    },
    methods: {
        onResize() {
            this.width = window.innerWidth
            this.height = window.innerHeight
        },
        onSelectMerchandise(merchandiseSelected) {
            this.configSelected.merchandiseId = merchandiseSelected
            this.loading = true
            this.getEffectHourCandlestickTypeInDay()
        },
        onSelectDayNumber(dayNumber) {
            this.configSelected.dayNumber = dayNumber
            this.loading = true
            this.getEffectHourCandlestickTypeInDay()
        },
        updateMerchandiseRateSelected() {
            this.merchandiseRateSelected.mainId = this.findMerchandiseRateMain.id
        },
        getEffectHourCandlestickTypeInDay() {
            const params = {
                merchandise_rate_id: this.merchandiseRateSelected.mainId,
                day_number: this.configSelected.dayNumber
            }
            this.$store.dispatch('getEffectHourCandlestickTypeInDay', params).then(res => {
                let increaseDatasets = [];
                let decreaseDatasets = [];
                this.barData.labels = _.keys(res.data)
                _.each(this.barData.labels, function (key) {
                    increaseDatasets.push(res.data[key][0])
                    decreaseDatasets.push(res.data[key][1])
                })
                this.barData.datasets = [{
                    label: "Tang",
                    data: increaseDatasets,
                    backgroundColor: 'rgb(75, 192, 192)',
                },{
                    label: "GIam",
                    data: decreaseDatasets,
                    backgroundColor: 'rgb(255, 99, 132)',
                }]
                this.loading = false
            })
        }
    }
};
</script>

<style>
html,
body {
    margin: 0;
    padding: 0;
    overflow: hidden;
}
.main-container {
    display: flex;
}
</style>

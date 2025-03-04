<template>
    <div>
        <config-chart
            :width="width"
            :height="50"
            :selected="configSelected"
            :list-event="listEvent"
            @select-merchandise="onSelectMerchandise"
            @back-chart="backChart" />
        <div class="main-container">
            <bar-chart />
            <watch-list
                :info="lastCandlestickInfo"
                :current-time="currentTime"
                :width="200"
                :height="height - 50" />
        </div>
    </div>
</template>

<script>

import ConfigChart from './components/ConfigChart.vue'
import WatchList from './components/WatchList.vue'
import BarChart from './BarChart.vue'


import _ from "lodash"
// import Const from "./stuff/constants.js"
import moment from 'moment'

export default {
    name: 'app',
    components: {
        ConfigChart, BarChart, WatchList
    },
    data() {
        return {
            chart: null,
            loading: true,
            chartFuture: [],
            datetimeIdMapping: null,
            lastCandlestickInfo: null,
            width: window.innerWidth,
            height: window.innerHeight,
            listEvent: [],
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
        this.fetchChartData(null)
        this.fetchEvents()
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
        fetchEvents() {
            const params = {
                merchandise_rate_id: this.merchandiseRateSelected.mainId
            }

            this.$store.dispatch('getEvent', params).then(res => {
                this.listEvent = res.data                
            })
        },
        onSelectMerchandise(merchandiseSelected) {
            this.configSelected.merchandiseId = merchandiseSelected
            this.updateMerchandiseRateSelected()
        },
        onSelectInterval(intervalSelected) {
            this.configSelected.intervalType = intervalSelected
            this.updateMerchandiseRateSelected()
        },
        updateMerchandiseRateSelected() {
            this.merchandiseRateSelected.mainId = this.findMerchandiseRateMain.id
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

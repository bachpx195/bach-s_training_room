<template>
    <div v-if="dataReady1 && dataReady2 && dataReady3">
        <trading-vue :data="this.chartData(1)"
            :title-txt="this.title('main')"
            :width="this.width/2"
            :height="this.height/2"
            :color-back="colors.colorBack"
            :color-grid="colors.colorGrid"
            :color-text="colors.colorText"
            id="main-trading-vue">
        </trading-vue>
        <trading-vue :data="this.chartData(2)"
            :title-txt="this.title('btc')"
            :width="this.width/2"
            :height="this.height/2"
            :color-back="colors.colorBack"
            :color-grid="colors.colorGrid"
            :color-text="colors.colorText"
            id="btc-trading-vue">
        </trading-vue>
        <trading-vue :data="this.chartData(3)"
            :title-txt="this.title('cross')"
            :width="this.width/2"
            :height="this.height/2"
            :color-back="colors.colorBack"
            :color-grid="colors.colorGrid"
            :color-text="colors.colorText"
            id="alt-btc-trading-vue">
        </trading-vue>
        <config-chart
            :width="this.width/2"
            :height="this.height/2"
            :selected="this.configSelected"
            @select-merchandise="onSelectMerchandise"
            @select-interval="onSelectInterval"
        >
        </config-chart>
    </div>
</template>

<script>
import TradingVue from './TradingVue.vue'
import ConfigChart from './components/ConfigChart.vue'
import DataCube from '../src/helpers/datacube.js'
import bus from './stuff/bus.js'
import _ from "lodash"
import Const from "./stuff/constants.js"

export default {
    name: 'app',
    components: {
        TradingVue, ConfigChart
    },
    created() {
        this.updateMerchandiseRateSelected()
        this.fetchChartData()
    },
    mounted() {
        window.dc = this.chartData(1);
        window.addEventListener('resize', this.onResize)
    },
    data() {
        return {
            dataReady1: false,
            dataReady2: false,
            dataReady3: false,
            chart1: [],
            chart2: [],
            chart3: [],
            width: window.innerWidth,
            height: window.innerHeight,
            colors: {
                colorBack: '#fff',
                colorGrid: '#eee',
                colorText: '#333',
            },
            configSelected: {
                merchandiseId: this.$store.state.merchandises[3].id,
                intervalType: this.$store.state.intervals.m15
            },
            merchandiseRateSelected: {
                // Cặp alt/usdt
                mainId: null,
                // Cặp btc/usdt
                btcId: this.$store.state.merchandiseRates[0].id,
                // Cặp chéo alt/btc
                crossId: null
            }
        };
    },
    computed: {
        findMerchandiseRateMain() {
            const merchandise = _.find(this.$store.state.merchandiseRates, { base_id: this.configSelected.merchandiseId, quote_id: 13 });
            return merchandise
        },
        findMerchandiseRateCross() {
            const merchandise = _.find(this.$store.state.merchandiseRates, { base_id: this.configSelected.merchandiseId, quote_id: 14 });
            return merchandise
        },
    },
    methods: {
        title(chartName) {
            let merchandiseRate;
            switch (chartName) {
                case 'main':
                    merchandiseRate = this.findMerchandiseRateMain
                    break
                case 'cross':
                    merchandiseRate = this.findMerchandiseRateCross
                    break
                default:
                    merchandiseRate = this.$store.state.merchandiseRates[0]
                    break
            }

            return `${merchandiseRate.slug} ${Const.MAP_INTERVAL[this.configSelected.intervalType]}`
        },
        onResize() {
            this.width = window.innerWidth
            this.height = window.innerHeight
        },
        chartData(number) {
            const data = {
                "ohlcv": this[`chart${number}`],
                ...Const.DATA_STRUCTURE
            }
            return new DataCube(data)
        },
        fetchChartData() {
            this.fetchChartDataByMerchandiseRate(1, this.merchandiseRateSelected.mainId)
            this.fetchChartDataByMerchandiseRate(2, this.merchandiseRateSelected.btcId)
            this.fetchChartDataByMerchandiseRate(3, this.merchandiseRateSelected.crossId)
        },
        fetchChartDataByMerchandiseRate(chartNumber, merchandiseId) {
            const params = {
                merchandise_rate_id: merchandiseId,
                time_type: this.configSelected.intervalType
            }
            this.$store.dispatch('getCandleStickData', params).then(res => {
                this[`chart${chartNumber}`] = res.data.ohlcv
                this[`dataReady${chartNumber}`] = true;
            })
        },
        onSelectMerchandise(merchandiseSelected) {
            bus.$emit('select-merchandise', merchandiseSelected)
            this.configSelected.merchandiseId = merchandiseSelected
            this.updateMerchandiseRateSelected()
            this.fetchChartData()
        },
        onSelectInterval(intervalSelected) {
            bus.$emit('select-interval', intervalSelected)
            this.configSelected.intervalType = intervalSelected
            this.updateMerchandiseRateSelected()
            this.fetchChartData()
        },
        updateMerchandiseRateSelected() {
            this.merchandiseRateSelected.mainId = this.findMerchandiseRateMain.id
            this.merchandiseRateSelected.crossId = this.findMerchandiseRateCross.id
        }
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    }
};
</script>

<style>
html,
body {
    background-color: #000;
    margin: 0;
    padding: 0;
    overflow: hidden;
}
.trading-vue {
    width: 50%;
    height: 50%;
    float: left;
}
</style>

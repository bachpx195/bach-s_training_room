<template>
    <div v-if="dataReady1 && dataReady2 && dataReady3">
        <loading-screen v-if="isLoading"></loading-screen>
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
            :current-time="this.currentTime"
            @select-merchandise="onSelectMerchandise"
            @select-interval="onSelectInterval"
            @select-date="onSelectDate"
            @async-candlestick-data="asyncCandlestickData"
            @next-chart="nextChart"
            @back-chart="backChart"
        >
        </config-chart>
    </div>
</template>

<script>
import TradingVue from './TradingVue.vue'
import ConfigChart from './components/ConfigChart.vue'
import LoadingScreen from './components/LoadingScreen.vue'
import DataCube from '../src/helpers/datacube.js'
import bus from './stuff/bus.js'
import _ from "lodash"
import Const from "./stuff/constants.js"
import moment from 'moment'

export default {
    name: 'app',
    components: {
        TradingVue, ConfigChart, LoadingScreen
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
            isLoading: false,
            dataReady1: false,
            dataReady2: false,
            dataReady3: false,
            chart1: [],
            chart2: [],
            chart3: [],
            chartFuture1: [],
            chartFuture2: [],
            chartFuture3: [],
            width: window.innerWidth,
            height: window.innerHeight,
            colors: {},
            configSelected: {
                // TODO: chọn cặp hiển thị default
                merchandiseId: this.$store.state.merchandises[1].id,
                intervalType: this.$store.state.intervals.m15
            },
            merchandiseRateSelected: {
                // Cặp alt/usdt
                mainId: null,
                // Cặp btc/usdt
                btcId: this.$store.state.merchandiseRates[0].id,
                // Cặp chéo alt/btc
                crossId: null
            },
            currentTime: null
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
        fetchChartData(date) {
            this.fetchChartDataByMerchandiseRate(1, this.merchandiseRateSelected.mainId, date)
            this.fetchChartDataByMerchandiseRate(2, this.merchandiseRateSelected.btcId, date)
            this.fetchChartDataByMerchandiseRate(3, this.merchandiseRateSelected.crossId, date)
        },
        fetchChartDataByMerchandiseRate(chartNumber, merchandiseId, date) {
            const params = {
                merchandise_rate_id: merchandiseId,
                time_type: this.configSelected.intervalType,
                date: date
            }
            this.$store.dispatch('getCandleStickData', params).then(res => {
                this[`chart${chartNumber}`] = res.data.ohlcv
                this[`chartFuture${chartNumber}`] = res.data.future_ohlcv
                this[`dataReady${chartNumber}`] = true;
                if(chartNumber == 1) {
                    this.setCurrentTime()
                }
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
        onSelectDate(date) {
            bus.$emit('select-date', date)
            const dateParam = moment(date).format()
            this.fetchChartData(dateParam)
        },
        updateMerchandiseRateSelected() {
            this.merchandiseRateSelected.mainId = this.findMerchandiseRateMain.id
            this.merchandiseRateSelected.crossId = this.findMerchandiseRateCross.id
        },
        asyncCandlestickData() {
            this.isLoading = true
            const params = {
                merchandise_rate_ids: [this.merchandiseRateSelected.mainId, this.merchandiseRateSelected.btcId, this.merchandiseRateSelected.crossId],
                time_type: this.configSelected.intervalType
            }
            this.$store.dispatch('asyncCandlestickData', params).then(res => {
                this.fetchChartData()
                this.isLoading = false
                alert(res.data.lastest_time)
            })
        },
        nextChart() {
            this.setNextChartDate(1)
            this.setNextChartDate(2)
            this.setNextChartDate(3)
        },
        backChart() {
            this.setBackChartDate(1)
            this.setBackChartDate(2)
            this.setBackChartDate(3)
        },
        setNextChartDate(number) {
            if(this[`chartFuture${number}`].length == 0) return
            this[`dataReady${number}`] = false
            this[`chart${number}`].push(this[`chartFuture${number}`].shift())
            this.chartData(number)
            this[`dataReady${number}`] = true
            this.setCurrentTime()
        },
        setBackChartDate(number) {
            this[`dataReady${number}`] = _.stubFalse()
            this[`chartFuture${number}`].unshift(this[`chart${number}`].pop())
            this.chartData(number)
            this[`dataReady${number}`] = true
            this.setCurrentTime()
        },
        setCurrentTime() {
            let lastDate = new Date(this.chart1[this.chart1.length - 2][0])
            this.currentTime = lastDate.toString()
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

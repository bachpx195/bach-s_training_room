<template>
<div v-if="!loading">
    <config-chart
        :width="width"
        :height="50"
        :selected="configSelected"
        :current-time="currentTime"
        @select-merchandise="onSelectMerchandise"
        @select-interval="onSelectInterval"
        @select-date="onSelectDate"
        @async-candlestick-data="asyncCandlestickData"
        @next-chart="nextChart"
        @back-chart="backChart" />
    <div class="main-container">
        <trading-vue
        :data="chart"
        :width="width - 200"
        :height="height - 50"
        :toolbar="true"
        :timezone="7"
        :color-back="colors.colorBack"
        :color-grid="colors.colorGrid"
        :color-text="colors.colorText"/>
        <watch-list
            :info="lastCandlestickInfo"
            :current-time="currentTime"
            :width="200"
            :height="height - 50" />
    </div>
</div>
<div v-else>
    <loading-screen ></loading-screen>
</div>
</template>

<script>
import TradingVue from './TradingVue.vue'
import ConfigChart from './components/ConfigChart.vue'
import WatchList from './components/WatchList.vue'
import DataCube from '../src/helpers/datacube.js'
import bus from './stuff/bus.js'
import _ from "lodash"
// import Const from "./stuff/constants.js"
import moment from 'moment'
import LoadingScreen from './components/LoadingScreen.vue'

export default {
    name: 'app',
    components: {
        TradingVue, ConfigChart, LoadingScreen, WatchList
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
            colors: {
                // colorBack: '#fff',
                // colorGrid: '#eee',
                // colorText: '#333',
            },
            configSelected: {
                // TODO: chọn cặp hiển thị default
                merchandiseId: this.$store.state.merchandises[1].id,
                intervalType: this.$store.state.intervals.hour
            },
            merchandiseRateSelected: {
                // Cặp alt/usdt
                mainId: null
            },
            currentTime: null
        };
    },
    computed: {
        findMerchandiseRateMain() {
            const merchandise = _.find(this.$store.state.merchandiseRates, { base_id: this.configSelected.merchandiseId, quote_id: 13 });
            return merchandise
        },
        currentDateFormat() {
            return moment(this.currentTime).format("YYYY-MM-DD HH:MM dddd").toString()
        }
    },
    created() {
        this.fetchChartData(null)
    },
    mounted() {
        window.addEventListener('resize', this.onResize)
        window.dc = this.chart
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    },
    methods: {
        updateChartData(ohlcvData) {
            this.chart.set('chart.data', ohlcvData)
            const customData = this.getDrawPoint(ohlcvData)
            this.chart.set('onchart.Custom0.data', customData)
        },
        onResize() {
            this.width = window.innerWidth
            this.height = window.innerHeight
        },
        fetchChartData(date) {
            this.fetchChartDataByMerchandiseRate(date)
        },
        fetchChartDataByMerchandiseRate(date) {
            const params = {
                merchandise_rate_id: 35,
                time_type: this.configSelected.intervalType,
                date: date
            }

            this.$store.dispatch('getCandleStickData', params).then(res => {
                const ohlcv = res.data.ohlcv
                const customData = this.getDrawPoint(ohlcv)
                const data = {
                    "ohlcv": ohlcv,
                    "onchart": [{
                        name: 'Custom',
                        type: 'Custom',
                        data: customData,
                        settings: {}
                    }],
                    "tools": [
                        {
                            "type": "Cursor",
                            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZAgMAAAC5h23wAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAxQTFRFAAAATU1NTU1NTU1NwlMHHwAAAAR0Uk5TAOvhxbpPrUkAAAAkSURBVHicY2BgYHBggAByabxg1WoGBq2pRCk9AKUbcND43AEAufYHlSuusE4AAAAASUVORK5CYII="
                        },
                        {
                            "type": "LineToolSegment",
                            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZAgMAAAC5h23wAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAlQTFRFAAAATU1NJCQkCxcHIQAAAAN0Uk5TAP8SmutI5AAAACxJREFUeJxjYMACGAMgNAsLdpoVKi8AVe8A1QblQlWRKt0AoULw2w1zGxoAABdiAviQhF/mAAAAAElFTkSuQmCC"
                        },
                        {
                            "type": "LineToolExtended",
                            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZAQMAAAD+JxcgAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAZQTFRFAAAATU1NkJ+rOQAAAAJ0Uk5TAP9bkSK1AAAANElEQVR4nGNggABGEMEEIlhABAeI+AASF0AlHmAqA4kzKAAx8wGQuAMKwd6AoYzBAWonAwAcLwTgNfJ3RQAAAABJRU5ErkJggg=="
                        }
                    ],
                    "tool": "Cursor"
                }
                this.chart = new DataCube(data)
                this.chartFuture = res.data.future_ohlcv
                this.datetimeIdMapping = res.data.datetime_id_mapping
                this.loading = false
                let dateTimestamp = this.setCurrentTime()
                this.getLastCandlestickInfo(dateTimestamp)
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

            const params = {
                merchandise_rate_id: 35,
                time_type: this.configSelected.intervalType,
                date: dateParam
            }

            this.$store.dispatch('getCandleStickData', params).then(res => {
                this.updateChartData(res.data.ohlcv)
                this.chartFuture = res.data.future_ohlcv
                this.datetimeIdMapping = res.data.datetime_id_mapping
                let dateTimestamp = this.setCurrentTime()
                this.getLastCandlestickInfo(dateTimestamp)
            })

            // this.fetchChartDataByMerchandiseRate(dateParam)
        },
        updateMerchandiseRateSelected() {
            this.merchandiseRateSelected.mainId = this.findMerchandiseRateMain.id
        },
        asyncCandlestickData() {
            this.isLoading = true
            const params = {
                merchandise_rate_ids: [this.merchandiseRateSelected.mainId],
                time_type: this.configSelected.intervalType
            }
            this.$store.dispatch('asyncCandlestickData', params).then(res => {
                this.fetchChartData()
                this.isLoading = false
                alert(res.data.lastest_time)
            })
        },
        nextChart() {
            this.setNextChartDate()
        },
        backChart() {
            this.setBackChartDate()
        },
        setNextChartDate() {
            if(this.chartFuture.length == 0) return
            this.chart.data.chart.data.push(this.chartFuture.shift())
            this.updateChartData(this.chart.data.chart.data)
            let dateTimestamp = this.setCurrentTime()
            this.getLastCandlestickInfo(dateTimestamp)
        },
        setBackChartDate() {
            this.chartFuture.unshift(this.chart.data.chart.data.pop())
            this.updateChartData(this.chart.data.chart.data)
            let dateTimestamp = this.setCurrentTime()
            this.getLastCandlestickInfo(dateTimestamp)
        },
        setCurrentTime() {
            let lastDate = null
            if(this.chart.data.ohlcv) {
                lastDate = this.getLastTimestamp(this.chart.data.ohlcv)
            } else {
                lastDate = this.getLastTimestamp(this.chart.data.chart.data)
            }
            let currentDate = new Date(lastDate)
            this.currentTime = currentDate.toString()
            return lastDate
        },
        getLastTimestamp(data){
            let lastDate = data[data.length - 1][0]
            return lastDate
        },
        getLastCandlestickInfo(time) {
            const params = {
                id: this.datetimeIdMapping[`${time}`]
            }
            this.$store.dispatch('getCandleStickInfoData', params).then(res => {
                this.lastCandlestickInfo = res.data
            })
        },
        getDrawPoint(data){
            const lastTimestamp = this.getLastTimestamp(data)
            const currentDate = new Date(lastTimestamp)
            const firstTimestamp = currentDate.setUTCHours(0,0,0,0)
            const firstYesterdayTimestamp = firstTimestamp - (24*60*60*1000)


            const dayData = _.filter(data, function (n) {
                return  n[0] >= firstTimestamp & n[0] <= lastTimestamp
            });

            const openCandlestick = _.find(data, function (n) {
                return  n[0] == firstTimestamp
            });

            const yesterdayData = _.filter(data, function (n) {
                return  n[0] >= firstYesterdayTimestamp & n[0] < firstTimestamp
            });

            const yesterdayHigh = _.max(_.map(yesterdayData, function(x) {return x[2]}))
            const yesterdayLow = _.min(_.map(yesterdayData, function(x) {return x[3]}))

            return [
                // day zone
                [firstTimestamp, _.max(_.map(dayData, function(x) {return x[2]}))],
                [lastTimestamp, _.min(_.map(dayData, function(x) {return x[3]}))],
                // open line
                [firstYesterdayTimestamp, openCandlestick[1]],
                [lastTimestamp, openCandlestick[1]],
                // high line
                [firstYesterdayTimestamp, yesterdayHigh],
                [lastTimestamp, yesterdayHigh],
                // low line
                [firstYesterdayTimestamp, yesterdayLow],
                [lastTimestamp, yesterdayLow]
            ]
        }
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
.main-container {
    display: flex;
}
</style>

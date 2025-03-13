<template>
<div v-if="!loading">
    <div>
        <div class="config-container" :style="configStyle">
            <config-chart
                :width="width"
                :selected="configSelected"
                :current-time="currentTime"
                :list-event="listEvent"
                @select-merchandise="onSelectMerchandise"
                @select-interval="onSelectInterval"
                @select-date="onSelectDate"
                @next-chart="nextChart"
                @back-chart="backChart" />  
        </div>
        <div>
            <trading-vue
            :title-txt="findMerchandiseRateMain.slug"
            id="main-trading-vue"
            :data="chart"
            :width="width/2"
            :height="height - 50"
            :toolbar="true"
            :timezone="7"
            :color-back="colors.colorBack"
            :color-grid="colors.colorGrid"
            :color-text="colors.colorText"
            :chart-config=" { DEFAULT_LEN: 100 } "/>
        </div>
        <div>
            <trading-vue
            v-if="chartBtc"
            title-txt="BTCUSDT"
            id="btc-trading-vue"
            :data="chartBtc"
            :width="width/2"
            :height="height - 50"
            :toolbar="false"
            :timezone="7"
            :color-back="colors.colorBack"
            :color-grid="colors.colorGrid"
            :color-text="colors.colorText"
            :chart-config=" { DEFAULT_LEN: 100 } "/>
        </div>
    </div>
</div>
<div v-else>
    <loading-screen />
</div>
</template>

<script>
import TradingVue from './TradingVue.vue'
import ConfigChart from './components/ConfigChart.vue'
import DataCube from '../src/helpers/datacube.js'
import _ from "lodash"
// import Const from "./stuff/constants.js"
import moment from 'moment'
import LoadingScreen from './components/LoadingScreen.vue'

export default {
    name: 'app',
    components: {
        TradingVue, ConfigChart, LoadingScreen
    },
    data() {
        return {
            chart: null,
            chartBtc: null,
            loading: true,
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
                intervalType: this.$store.state.intervals.day
            },
            merchandiseRateSelected: {
                // Cặp alt/usdt
                mainId: 35
            },
            currentTime: null
        };
    },
    computed: {
        findMerchandiseRateMain() {
            const merchandise = _.find(this.$store.state.merchandiseRates, { base_id: this.configSelected.merchandiseId, quote_id: 13 });
            return merchandise
        },
        findMerchandiseRateAltBtc() {
            const merchandise = _.find(this.$store.state.merchandiseRates, { base_id: this.configSelected.merchandiseId, quote_id: 14 });
            return merchandise
        },
        currentDateFormat() {
            return moment(this.currentTime).format("YYYY-MM-DD HH:MM dddd").toString()
        },
        configStyle() {
            return 'width: ' + this.width + 'px; height: 50px'
        },
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
        updateChartData(ohlcvData) {
            this.chart.set('chart.data', [])

            this.chart.set('chart.data', ohlcvData)
            const customData = this.getDrawPoint(ohlcvData)
            this.chart.set('onchart.Custom0.data', customData)
        },
        updateBtcChartData(ohlcvData) {
            this.chartBtc.set('chart.data', [])
            this.chartBtc.set('chart.data', ohlcvData)
            const customData = this.getDrawPoint(ohlcvData)
            this.chartBtc.set('onchart.Custom0.data', customData)
            
        },
        onResize() {
            this.width = window.innerWidth
            this.height = window.innerHeight
        },
        fetchChartData(date) {
            this.fetchChartDataByMerchandiseRate(date)
            this.fetchBtcChartData(date)
        },
        fetchChartDataByMerchandiseRate(date) {
            const params = {
                merchandise_rate_id: this.merchandiseRateSelected.mainId,
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
                this.setCurrentTime()
                this.loading = false
            })
        },
        fetchBtcChartData(date) {
            const params = {
                merchandise_rate_id: 34,
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
                this.chartBtc = new DataCube(data)
            })
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
            this.fetchChartData()
            this.fetchEvents()
        },
        onSelectInterval(intervalSelected) {
            this.configSelected.intervalType = intervalSelected
            this.updateMerchandiseRateSelected()
            this.fetchChartData()
        },
        onSelectDate(date) {
            const dateParam = moment(date).format()
            this.currentTime = date.toString()

            const params = {
                merchandise_rate_id: this.merchandiseRateSelected.mainId,
                time_type: this.configSelected.intervalType,
                date: dateParam
            }

            this.$store.dispatch('getCandleStickData', params).then(res => {
                this.updateChartData(res.data.ohlcv)
            })


            const paramsBtc = {
                merchandise_rate_id: 34,
                time_type: this.configSelected.intervalType,
                date: dateParam
            }

            this.$store.dispatch('getCandleStickData', paramsBtc).then(res => {
                this.updateBtcChartData(res.data.ohlcv)
            })

            this.onResize()

            // this.fetchChartDataByMerchandiseRate(dateParam)
        },
        updateMerchandiseRateSelected() {
            this.merchandiseRateSelected.mainId = this.findMerchandiseRateMain.id
        },
        nextChart() {           
            let date = new Date(this.currentTime);
            date.setDate(date.getDate() - 1);
            this.onSelectDate(date)
            // this.setNextChartDate()
        },
        backChart() {
            // this.setBackChartDate()
            let date = new Date(this.currentTime);
            date.setDate(date.getDate() + 1);
            this.onSelectDate(date)
        },
        setCurrentTime() {
            let lastDate = null
            if(this.chart.data.ohlcv) {
                lastDate = this.getLastTimestamp(this.chart.data.ohlcv) - (23*60*60*1000)
            } else {
                lastDate = this.getLastTimestamp(this.chart.data.chart.data) - (23*60*60*1000)
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
                id: this.datetimeIdMapping[`${time}`],
                type: "day"
            }
            this.$store.dispatch('getCandleStickInfoData', params).then(res => {
                this.lastCandlestickInfo = res.data
            })
        },
        getDrawPoint(data){
            const lastHourOfDayTimestamp = this.getLastTimestamp(data)
            const firstHourOfDayTimestamp = lastHourOfDayTimestamp - (23*60*60*1000);
            const yesterdayTimestamp = firstHourOfDayTimestamp - (60*60*1000);
            

            const hourData = _.filter(data, function (n) {
                return  n[0] >= firstHourOfDayTimestamp & n[0] <= lastHourOfDayTimestamp
            });

            const yesterdayData = _.find(data, function (n) {
                return  n[0] == yesterdayTimestamp
            });

            return [
                // day zone
                [firstHourOfDayTimestamp, _.max(_.map(hourData, function(x) {return x[2]}))],
                [lastHourOfDayTimestamp, _.min(_.map(hourData, function(x) {return x[3]}))],
                // open line
                [yesterdayTimestamp, yesterdayData[4]],
                [lastHourOfDayTimestamp, yesterdayData[4]],
                // high line
                [yesterdayTimestamp, yesterdayData[2]],
                [lastHourOfDayTimestamp, yesterdayData[2]],
                // low line
                [yesterdayTimestamp, yesterdayData[3]],
                [lastHourOfDayTimestamp, yesterdayData[3]]
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
.trading-vue {
    width: 50%;
    height: 50%;
    float: left;
}
.main-container {
    display: block;
}
.config-container {
    float: left;
}
</style>

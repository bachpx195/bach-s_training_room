<template>
<div v-if="!loading">
    <div>
        <div>
            <trading-vue
            v-if="chartBtc"
            title-txt="BTCUSDT"
            id="btc-trading-vue"
            :data="chartBtc"
            :width="width/2"
            :height="height/2"
            :toolbar="false"
            :timezone="7"
            :color-back="colors.colorBack"
            :color-grid="colors.colorGrid"
            :color-text="colors.colorText"
            :chart-config=" { DEFAULT_LEN: 100 } "/>
        </div>
        <div>
            <trading-vue
            v-if="chartAltBtc"
            :title-txt="findMerchandiseRateAltBtc.slug"
            id="alt-btc-trading-vue"
            :data="chartAltBtc"
            :width="width/2"
            :height="height/2"
            :toolbar="false"
            :timezone="7"
            :color-back="colors.colorBack"
            :color-grid="colors.colorGrid"
            :color-text="colors.colorText"
            :chart-config=" { DEFAULT_LEN: 100 } "/>
        </div>
        <div>
            <trading-vue
            :title-txt="findMerchandiseRateMain.slug"
            id="main-trading-vue"
            :data="chart"
            :width="width/2"
            :height="height/2"
            :toolbar="true"
            :timezone="7"
            :color-back="colors.colorBack"
            :color-grid="colors.colorGrid"
            :color-text="colors.colorText"
            :chart-config=" { DEFAULT_LEN: 100 } "/>
        </div>
        <div class="config-container" :style="configStyle">
            <config-chart
                :width="width/2"
                :selected="configSelected"
                :current-time="currentTime"
                :list-event="listEvent"
                @select-merchandise="onSelectMerchandise"
                @select-interval="onSelectInterval"
                @select-date="onSelectDate"
                @async-candlestick-data="asyncCandlestickData"
                @next-chart="nextChart"
                @back-chart="backChart" />
            <watch-list
                :info="lastCandlestickInfo"
                :current-time="currentTime"
                :width="width/2"/>
            
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
import WatchList from './components/WatchList.vue'
import DataCube from '../src/helpers/datacube.js'
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
            chartBtc: null,
            chartAltBtc: null,
            loading: true,
            chartFuture: [],
            chartBtcFuture: [],
            chartAltBtcFuture: [],
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
            return 'width: ' + this.width/2 + 'px; height: ' + this.height/2 + 'px'
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
            this.chart.set('chart.data', ohlcvData)
            const customData = this.getDrawPoint(ohlcvData)
            this.chart.set('onchart.Custom0.data', customData)
        },
        updateBtcChartData(ohlcvData) {
            this.chartBtc.set('chart.data', ohlcvData)
        },
        updateAltBtcChartData(ohlcvData) {
            this.chartAltBtc.set('chart.data', ohlcvData)
        },
        onResize() {
            this.width = window.innerWidth
            this.height = window.innerHeight
        },
        fetchChartData(date) {
            this.fetchChartDataByMerchandiseRate(date)
            this.fetchBtcChartData(date)
            this.fetchAltBtcChartData(date)
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
                this.chartFuture = res.data.future_ohlcv
                this.datetimeIdMapping = res.data.datetime_id_mapping
                this.loading = false
                let dateTimestamp = this.setCurrentTime()
                this.getLastCandlestickInfo(dateTimestamp)
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
                const data = {
                    "ohlcv": ohlcv,
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
                this.chartBtcFuture = res.data.future_ohlcv
            })
        },
        fetchAltBtcChartData(date) {
            const params = {
                merchandise_rate_id: this.findMerchandiseRateAltBtc.id,
                time_type: this.configSelected.intervalType,
                date: date
            }

            this.$store.dispatch('getCandleStickData', params).then(res => {
                const ohlcv = res.data.ohlcv
                const data = {
                    "ohlcv": ohlcv,
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
                this.chartAltBtc = new DataCube(data)
                this.chartAltBtcFuture = res.data.future_ohlcv
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

            const params = {
                merchandise_rate_id: this.merchandiseRateSelected.mainId,
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

            const paramsBtc = {
                merchandise_rate_id: 34,
                time_type: this.configSelected.intervalType,
                date: dateParam
            }

            this.$store.dispatch('getCandleStickData', paramsBtc).then(res => {
                this.updateBtcChartData(res.data.ohlcv)
                this.chartBtcFuture = res.data.future_ohlcv
            })


            const paramsAltBtc = {
                merchandise_rate_id: this.findMerchandiseRateAltBtc.id,
                time_type: this.configSelected.intervalType,
                date: dateParam
            }

            this.$store.dispatch('getCandleStickData', paramsAltBtc).then(res => {
                this.updateAltBtcChartData(res.data.ohlcv)
                this.chartAltBtcFuture = res.data.future_ohlcv
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
            this.setNextBtcDate()
            this.setNextAltBtcDate()
        },
        setNextBtcDate() {
            if(this.chartBtcFuture.length == 0) return
            this.chartBtc.data.chart.data.push(this.chartBtcFuture.shift())
            this.updateBtcChartData(this.chartBtc.data.chart.data)
        },
        setNextAltBtcDate() {
            if(this.chartAltBtcFuture.length == 0) return
            this.chartAltBtc.data.chart.data.push(this.chartAltBtcFuture.shift())
            this.updateAltBtcChartData(this.chartAltBtc.data.chart.data)
        },
        setBackChartDate() {
            this.chartFuture.unshift(this.chart.data.chart.data.pop())
            this.updateChartData(this.chart.data.chart.data)
            let dateTimestamp = this.setCurrentTime()
            this.getLastCandlestickInfo(dateTimestamp)
            this.setBackBtcDate()
            this.setBackAltBtcDate()
        },
        setBackBtcDate() {
            this.chartBtcFuture.unshift(this.chartBtc.data.chart.data.pop())
            this.updateBtcChartData(this.chartBtc.data.chart.data)
        },
        setBackAltBtcDate() {
            this.chartAltBtcFuture.unshift(this.chartAltBtc.data.chart.data.pop())
            this.updateAltBtcChartData(this.chartAltBtc.data.chart.data)
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
                id: this.datetimeIdMapping[`${time}`],
                type: "day"
            }
            this.$store.dispatch('getCandleStickInfoData', params).then(res => {
                this.lastCandlestickInfo = res.data
            })
        },
        getDrawPoint(data){
            const lastTimestamp = this.getLastTimestamp(data)
            const currentDate = new Date(lastTimestamp)
            const weekDiff = currentDate.getDay()
            let firstTimestamp;
            if(weekDiff == 0) {
                firstTimestamp = lastTimestamp - (24*60*60*1000)*6
            }else {
                firstTimestamp = lastTimestamp - (24*60*60*1000)*(weekDiff-1)
            }
            
            
            const firstLastWeekTimestamp = firstTimestamp - (24*60*60*1000)*7


            const dayData = _.filter(data, function (n) {
                return  n[0] >= firstTimestamp & n[0] <= lastTimestamp
            });

            const openCandlestick = _.find(data, function (n) {
                return  n[0] == firstTimestamp
            });

            const yesterdayData = _.filter(data, function (n) {
                return  n[0] >= firstLastWeekTimestamp & n[0] < firstTimestamp
            });

            const yesterdayHigh = _.max(_.map(yesterdayData, function(x) {return x[2]}))
            const yesterdayLow = _.min(_.map(yesterdayData, function(x) {return x[3]}))

            return [
                // day zone
                [firstTimestamp, _.max(_.map(dayData, function(x) {return x[2]}))],
                [lastTimestamp, _.min(_.map(dayData, function(x) {return x[3]}))],
                // open line
                [firstLastWeekTimestamp, openCandlestick[1]],
                [lastTimestamp, openCandlestick[1]],
                // high line
                [firstLastWeekTimestamp, yesterdayHigh],
                [lastTimestamp, yesterdayHigh],
                // low line
                [firstLastWeekTimestamp, yesterdayLow],
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
.trading-vue {
    width: 50%;
    height: 50%;
    float: left;
}
.main-container {
    display: flex;
}
.config-container {
    float: left;
}
</style>

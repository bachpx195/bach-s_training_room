<template>
    <div v-if="dataReady1 && dataReady2 && dataReady3">
        <trading-vue :data="this.chartData(1)"
            :title-txt="this.title('1H')"
            :width="this.width/2"
            :height="this.height/2"
            :color-back="colors.colorBack"
            :color-grid="colors.colorGrid"
            :color-text="colors.colorText"
            id="main-trading-vue">
        </trading-vue>
        <trading-vue :data="this.chartData(2)"
            :title-txt="this.title('1D')"
            :width="this.width/2"
            :height="this.height/2"
            :color-back="colors.colorBack"
            :color-grid="colors.colorGrid"
            :color-text="colors.colorText"
            id="btc-trading-vue">
        </trading-vue>
        <trading-vue :data="this.chartData(3)"
            :title-txt="this.title('15m')"
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

export default {
    name: 'app',
    components: {
        TradingVue, ConfigChart
    },
    created() {
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
            }
        };
    },
    methods: {
        title(interval) {
            let merchandise = _.find(this.$store.state.merchandises, { id: this.configSelected.merchandiseId });
            return `${merchandise.slug} ${interval}`
        },
        onResize() {
            this.width = window.innerWidth
            this.height = window.innerHeight
        },
        chartData(number) {
            const data = {
                "ohlcv": this[`chart${number}`],
                "onchart": [],
                "offchart": [],
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
            return new DataCube(data)
        },
        fetchChartData() {
            this.fetchChartDataByInterval(1, this.$store.state.intervals.hour)
            this.fetchChartDataByInterval(2, this.$store.state.intervals.day)
            this.fetchChartDataByInterval(3, this.$store.state.intervals.m15)
        },
        fetchChartDataByInterval(chartNumber, interval) {
            const params = {
                merchandise_rate_id: this.configSelected.merchandiseId,
                time_type: interval
            }
            this.$store.dispatch('getCandleStickData', params).then(res => {
                this[`chart${chartNumber}`] = res.data.ohlcv
                this[`dataReady${chartNumber}`] = true;
            })
        },
        onSelectMerchandise(merchandiseSelected) {
            bus.$emit('select-merchandise', merchandiseSelected)
            this.configSelected.merchandiseId = merchandiseSelected
            this.fetchChartData()
        },
        onSelectInterval(intervalSelected) {
            bus.$emit('select-interval', intervalSelected)
            this.configSelected.intervalType = intervalSelected
            this.fetchChartData()
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

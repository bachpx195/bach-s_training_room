<template>
    <div v-if="dataReady1 && dataReady2 && dataReady3">
        <trading-vue :data="this.chartData(1)"
            title-txt='BTCUSDT 1H'
            :width="this.width/2"
            :height="this.height/2"
            :color-back="colors.colorBack"
            :color-grid="colors.colorGrid"
            :color-text="colors.colorText"
            id="main-trading-vue">
        </trading-vue>
        <trading-vue :data="this.chartData(2)"
            title-txt='BTCUSDT 1D'
            :width="this.width/2"
            :height="this.height/2"
            :color-back="colors.colorBack"
            :color-grid="colors.colorGrid"
            :color-text="colors.colorText"
            id="btc-trading-vue">
        </trading-vue>
        <trading-vue :data="this.chartData(3)"
            title-txt='BTCUSDT 15m'
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
            :merchandise-list="this.merchandiseList"
        >
        </config-chart>
    </div>
</template>

<script>
import TradingVue from './TradingVue.vue'
import ConfigChart from './components/ConfigChart.vue'
import DataCube from '../src/helpers/datacube.js'

export default {
    name: 'app',
    components: {
        TradingVue, ConfigChart
    },
    created() {
        this.$store.dispatch('getMerchandisekData').then(res4 => {
            this.merchandiseList = res4.data
        })

        const params1 = {
            merchandise_rate_id: 34,
            time_type: 4
        }
        this.$store.dispatch('getCandleStickData', params1).then(res1 => {
            this.chart1 = res1.data.ohlcv
            this.dataReady1 = true;
        })
        const params2 = {
            merchandise_rate_id: 34,
            time_type: 1
        }
        this.$store.dispatch('getCandleStickData', params2).then(res2 => {
            this.chart2 = res2.data.ohlcv
            this.dataReady2 = true;
        })

        const params3 = {
            merchandise_rate_id: 34,
            time_type: 5
        }
        this.$store.dispatch('getCandleStickData', params3).then(res3 => {
            this.chart3 = res3.data.ohlcv
            this.dataReady3 = true;
        })
    },
    mounted() {
        window.dc = this.chartData(1);
        window.addEventListener('resize', this.onResize)
    },
    methods: {
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
        }
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
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
            merchandiseSeleted: {},
            merchandiseList: {}
        };
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

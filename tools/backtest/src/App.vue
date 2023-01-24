<template>
    <trading-vue :data="chart" :width="this.width" :height="this.height" :color-back="colors.colorBack"
        :color-grid="colors.colorGrid" :color-text="colors.colorText" :id="main-trading-vue">
    </trading-vue>
    <!-- <div v-if="dataReady">
        <trading-vue :data="chart1"
            :width="this.width/2"
            :height="this.height/2"
            :color-back="colors.colorBack"
            :color-grid="colors.colorGrid"
            :color-text="colors.colorText"
            :id="main-trading-vue">
        </trading-vue>
        <trading-vue :data="chart2"
            :width="this.width/2"
            :height="this.height/2"
            :color-back="colors.colorBack"
            :color-grid="colors.colorGrid"
            :color-text="colors.colorText"
            :id="btc-trading-vue">
        </trading-vue>
        <trading-vue :data="chart3"
            :width="this.width/2"
            :height="this.height/2"
            :color-back="colors.colorBack"
            :color-grid="colors.colorGrid"
            :color-text="colors.colorText"
            :id="alt-btc-trading-vue">
        </trading-vue>
    </div> -->
</template>

<script>
import TradingVue from './TradingVue.vue'
import Data from '../data/data.json'
import DataCube from '../src/helpers/datacube.js'

export default {
    name: 'app',
    components: {
        TradingVue
    },
    mounted() {
        const config = {
            method: "get",
            url: "http://localhost:4000/api/v1/candlesticks?merchandise_rate_id=34&time_type=5",
            url2: "http://localhost:4000/api/v1/candlesticks?merchandise_rate_id=34&time_type=1",
            url3: "http://localhost:4000/api/v1/candlesticks?merchandise_rate_id=34&time_type=4",
        };

        const params = {
            merchandise_rate_id: 34,
            time_type: 4
        }

        // debugger

        this.$store.dispatch('getCandleStickData', params).then(res => {
            console.log("hahaha")
            console.log(res)
            Data.chart.data = res.data.ohlcv
        })

        // this.$store.dispatch('apiGet', `event_recent_checks/${buildQueryString(params)}`).then(res => {
        //     if (res.data.events.length >= this.displayLimit || (this.customSpDesign && res.data.events.length > 0)) this.recentCheckedEvents = res.data.events
        //     if (this.isLoggedIn) this.localStorage.removeItem(this.recentCheckedEventsKey)
        // })

        // 'postEventRecentCheck', params

        // try {
        //     let res = await axios(config);

        //     //assign the data to the component state
        //     Data.chart.data = res.data.ohlcv
        //     console.log("hihi");
        //     console.log(Data);
        //     this.chart1 = new DataCube(Data);
        // } catch (err) {
        //     console.log("dkm");
        //     console.log(err);
        // }

        window.addEventListener('resize', this.onResize)
        window.dc = this.chart
        this.dataReady = true;
    },
    methods: {
        onResize() {
            this.width = window.innerWidth
            this.height = window.innerHeight
        }
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    },
    data() {
        return {
            dataReady: false,
            chart: new DataCube(Data),
            // chart1: new DataCube(Data),
            // chart2: new DataCube(Data),
            // chart3: new DataCube(Data),
            width: window.innerWidth,
            height: window.innerHeight,
            colors: {
                colorBack: '#fff',
                colorGrid: '#eee',
                colorText: '#333',
            }
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

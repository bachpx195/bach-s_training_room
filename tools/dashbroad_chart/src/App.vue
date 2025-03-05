<template>
    <div>
        <config-chart
            :width="width"
            :height="50"
            :selected="configSelected"
            @select-merchandise="onSelectMerchandise"
            @select-day-number="onSelectDayNumber" />
        <div class="main-container">
            <bar-chart
                v-if="!loading1"
                :width="width/2"
                :height="height/2 - 50"
                :bar-data="effectHourCandlestickTypeInDayData"
                :chart-options="effectHourCandlestickTypeInDayOptions" />  
            <bar-chart
                v-if="!loading2"
                :width="width/2"
                :height="height/2 - 50"
                :bar-data="highestReturnHourInDayData"
                :chart-options="highestReturnHourInDayOptions" />
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
            effectHourCandlestickTypeInDayData: {
                labels: [],
                datasets: [],
            },
            effectHourCandlestickTypeInDayOptions: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Tang/Giam theo gio'
                    },
                },
                responsive: true,
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true
                    }
                }
            },
            highestReturnHourInDayData: {
                labels: [],
                datasets: [],
            },
            highestReturnHourInDayOptions: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Return cao nhat'
                    }
                }
            },
            loading1: true,
            loading2: true,
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
        this.getHighestReturnHourInDay()
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
            this.loading1 = true
            this.loading2 = true
            this.getEffectHourCandlestickTypeInDay()
            this.getHighestReturnHourInDay()
        },
        onSelectDayNumber(dayNumber) {
            this.configSelected.dayNumber = dayNumber
            this.loading1 = true
            this.loading2 = true
            this.getEffectHourCandlestickTypeInDay()
            this.getHighestReturnHourInDay()
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
                this.effectHourCandlestickTypeInDayData.labels = _.keys(res.data)
                _.each(this.effectHourCandlestickTypeInDayData.labels, function (key) {
                    increaseDatasets.push(res.data[key][0])
                    decreaseDatasets.push(res.data[key][1])
                })
                this.effectHourCandlestickTypeInDayData.datasets = [{
                    label: "Tang",
                    data: increaseDatasets,
                    backgroundColor: 'rgb(75, 192, 192)',
                },{
                    label: "GIam",
                    data: decreaseDatasets,
                    backgroundColor: 'rgb(255, 99, 132)',
                }]
                this.loading1 = false
            })
        },
        getHighestReturnHourInDay() {
            const params = {
                merchandise_rate_id: this.merchandiseRateSelected.mainId,
                day_number: this.configSelected.dayNumber
            }
            this.$store.dispatch('getHighestReturnHourInDay', params).then(res => {
                let data = [];
                this.highestReturnHourInDayData.labels = _.keys(res.data)
                _.each(this.highestReturnHourInDayData.labels, function (key) {
                    data.push(res.data[key])
                })
                this.highestReturnHourInDayData.datasets = [{
                    label: "Highest",
                    data: data,
                    backgroundColor: 'rgb(75, 192, 192)',
                }]
                console.log(this.highestReturnHourInDayData)
                this.loading2 = false
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

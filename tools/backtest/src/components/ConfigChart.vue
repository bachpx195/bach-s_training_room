
<template>
    <!-- Main component  -->
    <div id="config-chart" :style="style">
        <img class="config-img" :src="logo">
        <p class="config-title">Backtest Tool ver1</p>
        <div class="config-select">
            <label for="select-coin">Select coin</label>
            <select v-model="configSelected.merchandiseId" name="select-coin" class="form-control" @change="changeMerchandise">
                <option v-for="mr in this.merchandiseList" :value="mr.id" :key="mr.id">
                    {{ mr.slug }}
                </option>
            </select>
        </div>
        <div class="config-select">
            <label for="select-coin">Select interval</label>
            <select v-model="configSelected.intervalType" name="select-coin" class="form-control" @change="changeInterval">
                <option v-for="(value, key) in this.intervalList" :value="value" :key="value">
                    {{ key }}
                </option>
            </select>
        </div>
        <div class="config-select">
            <button @click="asyncUpdateData">
                Update data
            </button>
        </div>
    </div>
</template>

<script>

import logo from '../assets/logo.png';

export default {
    name: 'ConfigChart',
    components: {},
    mixins: [],
    props: {
      selected: {
          type: Object
      },
      width: {
          type: Number,
          default: 800
      },
      height: {
          type: Number,
          default: 421
      }
    },
    data() {
        return {
            merchandiseList: this.$store.state.merchandises,
            intervalList: this.$store.state.intervals,
            intervalSelected: null,
            configSelected: {
                merchandiseId: this.$props.selected.merchandiseId,
                intervalType: this.$props.selected.intervalType,
            },
            logo
        }
    },
    computed: {
        style() {
            return 'width: ' + this.$props.width + 'px; height: ' + this.$props.height + 'px'
        }
    },
    methods: {
        changeMerchandise () {
            this.$emit('select-merchandise', this.configSelected.merchandiseId)
        },
        changeInterval() {
            this.$emit('select-interval', this.configSelected.intervalType)
        },
        asyncUpdateData() {
            this.$emit('async-candlestick-data')
        }
    }
}
</script>
<style>
#config-chart {
    background: white;
    position: fixed;
    bottom: 0;
    right: 0;
}
.config-title {
    text-align: center;
}
.config-select {
    display: block;
    margin: 0 auto;
    text-align: center;
}
label {
    /* Other styling... */
    clear: both;
    margin-right: 10px;
}
.config-img {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 30%;
}
</style>

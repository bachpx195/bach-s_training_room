
<template>
    <!-- Main component  -->
    <div id="config-chart" :style="style">
        <img class="config-img" :src="logo">
        <p class="config-title">Backtest Tool ver1</p>
        <div class="config-select">
            <label for="select-coin">Select coin</label>
            <select name="select-coin" class="form-control">
                <option v-for="mr in this.merchandiseList" :value="mr.id" :key="mr.id">
                    {{ mr.slug }}
                </option>
            </select>
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
        merchandiseList: {
            type: Object,
            default: function () { return {} }
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
            merchandiseList: this.$props.merchandiseList,
            merchandiseSeleted: null,
            logo
        }
    },
    computed: {
        style() {
            return 'width: ' + this.$props.width + 'px; height: ' + this.$props.height + 'px'
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

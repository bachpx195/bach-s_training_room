
<template>
    <!-- Main component  -->
    <div id="config-chart" :style="style">
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
            <label for="select-coin">Update data</label>
            <button @click="asyncUpdateData">
                Update
            </button>
        </div>
        <div class="config-select">
            <label for="select-coin">Select date</label>
            <dropdown-datepicker :on-change="changeDate"></dropdown-datepicker>
        </div>
        <br>
        <div class="config-select">
            <button class="next-btn" @click="nextChart">
                Next
            </button>
        </div>
    </div>
</template>

<script>

import logo from '../assets/logo.png';
import DropdownDatepicker from './DropdownDatepicker.vue'
import _ from "lodash"

export default {
    name: 'ConfigChart',
    components: { DropdownDatepicker },
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
        changeDate(minute, hour, day, month, year) {
            if (_.toInteger(day) > 0 && _.toInteger(month) > 0 && _.toInteger(year) > 0 && !_.isNull(hour) && !_.isNull(minute)) {
                const date = new Date(_.toInteger(year), _.toInteger(month) - 1, _.toInteger(day), hour, minute)
                this.$emit('select-date', date)
            }
        },
        asyncUpdateData() {
            this.$emit('async-candlestick-data')
        },
        nextChart() {
            this.$emit('next-chart')
        }
    }
}
</script>
<style>
#config-chart {
    background: black;
    position: fixed;
    bottom: 0;
    right: 0;
    font-size: 30px;
    color: red;
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

.next-btn {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}
</style>

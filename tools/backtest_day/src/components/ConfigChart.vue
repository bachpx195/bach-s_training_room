
<template>
    <!-- Main component  -->
    <div id="config-chart" :style="style">
        <div class="config-select" style="width: 10%">
            <select v-model="configSelected.merchandiseId" name="select-coin" class="form-control" @change="changeMerchandise">
                <option v-for="mr in merchandiseList" :value="mr.id" :key="mr.id">
                    {{ mr.slug }}
                </option>
            </select>
        </div>
        <div class="config-select" style="width: 10%">
            <select v-model="configSelected.intervalType" name="select-coin" class="form-control" @change="changeInterval">
                <option v-for="(value, key) in intervalList" :value="value" :key="value">
                    {{ key }}
                </option>
            </select>
        </div>
        <div class="config-select" style="width: 10%">
            {{ currentDateFormat }}
        </div>
        <div class="config-select" style="width: 20%">
            <datepicker
                placeholder="Select Date"
                :value="currentTime"
                @selected="changeDate"/>
            <!-- <select
                name="select-hour"
                class="form-control"
                @change="changeDate"
            >
                <option v-for="(value, key) in listDate" :value="value" :key="key">
                    {{ value }}
                </option>
            </select>     -->
            <select
                v-model="hour"
                name="select-hour"
                class="form-control"
                @change="changeHour"
            >
                <option v-for="(value, key) in [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]" :value="value" :key="key">
                    {{ value }}
                </option>
            </select>
        </div>
        <br>
        <div class="config-select" style="width: 10%">
            <button 
                class="next-btn"
                @click="backChart"
                >
                Back
            </button>
            <button 
                class="next-btn"
                @click="nextChart"
            >
                Next
            </button>
        </div>
    </div>
</template>

<script>

import Datepicker from "vuejs-datepicker/dist/vuejs-datepicker.esm.js";
import _ from "lodash"
import moment from 'moment'
import dateConst from "../stuff/list_date_constants.js"

export default {
    name: 'ConfigChart',
    components: { Datepicker },
    mixins: [],
    props: {
      // eslint-disable-next-line vue/require-default-prop
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
      },
      // eslint-disable-next-line vue/require-default-prop
      currentTime: {
          type: String
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
            hour: _.toNumber(moment(this.currentTime).format("HH"))
        }
    },
    computed: {
        style() {
            return 'width: ' + this.$props.width + 'px; height: ' + this.$props.height + 'px'
        },
        currentDateFormat() {
            return moment(this.currentTime).format("YYYY-MM-DD HH:MM dddd").toString()
        },
        listDate() {
            return dateConst.PULLBACK_DATES
        }
    },
    mounted() {
        if (typeof window !== 'undefined') {
            document.addEventListener('keydown', (e) => {
                if(e.key === 'ArrowDown') {
                    this.backChart()
                }
                if(e.key === 'ArrowUp') {
                    this.nextChart()
                }
                e.preventDefault();
            })
        }
    },
    methods: {
        changeMerchandise () {
            this.$emit('select-merchandise', this.configSelected.merchandiseId)
        },
        changeInterval() {
            this.$emit('select-interval', this.configSelected.intervalType)
        },
        changeDate(e) {
            this.$emit('select-date', e)
        },
        asyncUpdateData() {
            this.$emit('async-candlestick-data')
        },
        nextChart() {
            this.$emit('next-chart')
        },
        backChart() {
            this.$emit('back-chart')
        },
        changeHour() {
            let dateTime = moment(this.currentTime)
            dateTime.set({h: this.hour})
            this.$emit('select-date', dateTime)
        }
    }
}
</script>
<style>
#config-chart {
    background: black;
    display: flex;
    bottom: 0;
    right: 0;
    font-size: 20px;
    color: red;
    height: auto;
}
.config-title {
    text-align: center;
}
.config-select {
    display: flex;
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
  font-size: 16px;
}
</style>

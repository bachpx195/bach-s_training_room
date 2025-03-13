
<template>
    <!-- Main component  -->
    <div 
        id="config-chart"
        :style="style"
    >
        <div 
            class="config-select"
        >
            <select 
                v-model="configSelected.merchandiseId"
                name="select-coin"
                class="form-control select-date"
                @change="changeMerchandise"
            >
                <option 
                    v-for="mr in merchandiseList" 
                    :key="mr.id" 
                    :value="mr.id"
                >
                    {{ mr.slug }}
                </option>
            </select>
        </div>
        <div 
            class="config-select"
        >
            <select
                v-model="configSelected.intervalType"
                name="select-interval"
                class="form-control select-date"
                @change="changeInterval"
            >
                <option
                    v-for="(value, key) in intervalList"
                    :key="value"
                    :value="value"
                >
                    {{ key }}
                </option>
            </select>
        </div>
        <div 
            class="config-select"
        >
            {{ currentDateFormat }}
        </div>
        <div
            class="config-select"
        >
            <datepicker
                placeholder="Select Date"
                :value="currentTime"
                @selected="changeDate"
            />
        </div>
        <div
            class="config-select-date"
        >
            <select
                v-model="configSelected.event"
                name="select-event"
                class="form-control select-date"
                @change="changeEvent"
            >
                <option
                    disabled
                    selected
                    :value="null"
                >
                    -- select event --
                </option>
                <option 
                    v-for="(value, key) in listEvent"
                    :key="key"
                    :value="value[0]"
                >
                    {{ `${value[1]} - ${value[2]}` }}
                </option>
            </select>
            <select
                v-show="configSelected.event"
                v-model="date"
                name="select-date"
                class="form-control select-date"
                @change="changeOptionDate"
            >
                <option disabled selected :value="null"> -- select date -- </option>
                <option v-for="(value, key) in listEventDay" :value="value" :key="key">
                    {{ value }}
                </option>
            </select> 
        </div>
        <div 
            class="config-select"
        >
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
      },
      // eslint-disable-next-line vue/require-default-prop
      listEvent: {
        type: Array
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
                event: null,
            },
            listEventDay: [],
            date: null,
        }
    },
    computed: {
        style() {
            return 'width: ' + this.$props.width + 'px;'
        },
        currentDateFormat() {
            return moment(this.currentTime).format("YYYY-MM-DD dddd").toString()
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
                if(e.key === 'ArrowRight') {
                    this.nextSeletedDate()
                }
                if(e.key === 'ArrowLeft') {
                    this.backSeletedDate()
                }
                if(e.key === 'Enter') {
                    let dateTime = new Date(this.currentTime)
                    this.changeDate(dateTime)
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
        changeOptionDate() {
            let dateTime = new Date(this.date)
            this.$emit('select-date', dateTime)
        },
        changeEvent() {
            const params = {
                merchandise_rate_id: 35,
                time_type: this.configSelected.intervalType,
                event_id: this.configSelected.event
            }

            this.$store.dispatch('getListDay', params).then(res => {
                this.listEventDay = res.data                
            })
        },
        nextSeletedDate() {
            if (this.configSelected.event && this.date && this.listEventDay) {
                const index = this.listEventDay.indexOf(this.date)
                if (index < this.listEventDay.length - 1) {
                    this.date = this.listEventDay[index + 1]
                    let dateTime = new Date(this.date)
                    this.$emit('select-date', dateTime)
                }
            }
            
        },
        backSeletedDate() {
            if (this.configSelected.event && this.date && this.listEventDay) {
                const index = this.listEventDay.indexOf(this.date)
                if (index > 1) {
                    this.date = this.listEventDay[index - 1]
                    let dateTime = new Date(this.date)
                    this.$emit('select-date', dateTime)
                }
            }
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
  text-align: center;
  text-decoration: none;
  height: 24px;
}

.select-date {
    height: 24px;
    display: block;
}
</style>

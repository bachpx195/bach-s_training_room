
<template>
    <!-- Main component  -->
    <div 
        id="config-chart"
        :style="style"
    >
        <div 
            class="config-select"
            style="width: 10%"
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
            style="width: 10%"
        >
            <input
                v-model.number="configSelected.dayNumber"
                name="select-interval"
                class="form-control select-date"
                @change="changeDayNumber"
            >
        </div>
    </div>
</template>

<script>

import dateConst from "../stuff/list_date_constants.js"

export default {
    name: 'ConfigChart',
    components: { },
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
      listEvent: {
        type: Array
      }
    },
    data() {
        return {
            merchandiseList: this.$store.state.merchandises,
            configSelected: {
                merchandiseId: this.$props.selected.merchandiseId,
                dayNumber: this.$props.selected.dayNumber,
                event: null,
            },
            listEventDay: [],
            date: null,
        }
    },
    computed: {
        style() {
            return 'width: ' + this.$props.width + 'px; height: ' + this.$props.height + 'px'
        },
        listDate() {
            return dateConst.PULLBACK_DATES
        }
    },
    methods: {
        changeMerchandise () {
            this.$emit('select-merchandise', this.configSelected.merchandiseId)
        },
        changeDayNumber() {
            this.$emit('select-day-number', this.configSelected.dayNumber)
        },
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

.select-date {
    height: 24px;
    display: block;
}
</style>

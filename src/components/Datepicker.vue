<template id="calendar">
  <div class="calendar">
    <header class="header">
      <button @click="previousMonth">&lt;&lt;</button>
      <span>{{ currentYear }} 年 {{ currentMonthLabel | filterMonth }} 月</span>
      <button @click="nextMonth">&gt;&gt;</button>
    </header>
    <div class="headings" v-for="(dayLabel, index) in dayLabels" :key="index">
      {{ dayLabel }}
    </div>
    <div
      v-for="(day, index) in daysArray"
      :key="`days${index}`"
      class="day"
      :class="dayClassObj(day)">
      <button @click="setSelectedDate(day)">
        {{ day.date | formatDateToDay }}
      </button>
    </div>
  </div>
</template>

<script>
import dateFns from 'date-fns'
export default {
  name: 'Datepicker',
  data () {
    return {
      today: null,
      selectedDate: null,
      currDateCursor: null,
      dayLabels: null
    }
  },
  created() {
    this.dayLabels = ['日', '一', '二', '三', '四', '五', '六']
    this.today = new Date()
    this.selectedDate = this.today
    this.currDateCursor = this.today
  },
  props: {
    startDate: {
      required: false,
      type: Date,
    }
  },
  computed: {
    currentMonth() {
      return this.currDateCursor.getMonth()
    },
    currentYear() {
      return this.currDateCursor.getFullYear()
    },
    currentMonthLabel() {
      const MONTH_LABELS = [
        "January", "February", "March",
        "April", "May", "June",
        "July", "August", "September",
        "October", "November", "December"]
      return MONTH_LABELS[this.currentMonth]
    },
    daysArray() {
      const date = this.currDateCursor
      const startOfMonth = dateFns.startOfMonth(date) // 获得月份第一天
      const endOfMonth = dateFns.endOfMonth(date) // 获得月份最后一天
      //const days = dateFns.eachDay(startOfMonth, endOfMonth);
      
      const days = dateFns.eachDay(startOfMonth, endOfMonth).map((day) => ({
        date: day,
        isCurrentMonth:  dateFns.isSameMonth(new Date(this.currentYear, this.currentMonth), day),
        isToday: dateFns.isToday(day),
        isSelected: dateFns.isSameDay(this.selectedDate, day)
      }));

      // gen the days from last month
      let previousMonthCursor = dateFns.lastDayOfMonth(dateFns.addMonths(date, -1))
      const begIndex = dateFns.getDay(days[0].date)
      for (let i = begIndex; i > 0; i--) {
        days.unshift({
          date: previousMonthCursor,
          isCurrentMonth: false,
          isToday: dateFns.isToday(previousMonthCursor),
          isSelected: dateFns.isSameDay(this.selectedDate, previousMonthCursor)
        })
        previousMonthCursor = dateFns.addDays(previousMonthCursor, -1)
      }
      
      // gen days for next month
      // 在加上上个月的日期的基础上再days.length % 7取模
      const daysNeededAtEnd = (days.length % 7 > 0) ? (7 -(days.length % 7)) : 0
      let nextMonthCursor = dateFns.addMonths(date, 1)
      nextMonthCursor = dateFns.setDate(nextMonthCursor, 1)
      for (let x = 1; x <= daysNeededAtEnd; x++) {
        days.push({
          date: nextMonthCursor,
          isCurrentMonth: false,
          isToday: dateFns.isToday(nextMonthCursor),
          isSelected: dateFns.isSameDay(this.selectedDate, nextMonthCursor)
        })
        nextMonthCursor = dateFns.addDays(nextMonthCursor, 1)
      }
      return days
    }
  },
  mounted() {
    if (this.startDate) {
      this.currDateCursor = this.startDate
      this.selectedDate = this.startDate
    }
  },
  methods: {
    dayClassObj(day) {
      return {
        'today' : day.isToday,
        'current': day.isCurrentMonth,
        'selected': day.isSelected,
      };
    },
    nextMonth() {
      this.currDateCursor = dateFns.addMonths(this.currDateCursor, 1)
    },
    previousMonth() {
      this.currDateCursor = dateFns.addMonths(this.currDateCursor, -1)
    },
    setSelectedDate(day) {
      this.selectedDate = day.date
      this.currDateCursor = day.date
      this.$emit('input', this.selectedDate)
    }
  },
  filters: {
    formatDateToDay (val) {
      return dateFns.format(val, 'D')
    },
    filterMonth (val) {
      let month = ''
      switch (val) {
        case 'January':
          month = '1'
          break
        case 'February':
          month = '2'
          break
        case 'March':
          month = '3'
          break
        case 'April':
          month = '4'
          break
        case 'May':
          month = '5'
          break
        case 'June':
          month = '6'
          break
        case 'July':
          month = '7'
          break
        case 'August':
          month = '8'
          break
        case 'September':
          month = '9'
          break
        case 'October':
          month = '10'
          break
        case 'November':
          month = '11'
          break
        case 'December':
          month = '12'
          break
      }
      return month
    }
  }
}
</script>

<style scoped lang=scss>
.calendar {
  margin: 0 auto;
  border: 1px solid var(--blue-grey);
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  width: 322px;

  > .header {
    padding: .75rem;
    font-size: 1.25rem;
    grid-column: 1 / span 7;
    
    >span {
      flex: 1;
      text-align: center;
    }
    
    button {
      border: none;
      background: var(--white);
      margin: 0 1rem;
      padding: .25rem .5rem;
      
      &:hover {
        background: var(--grey);
        transition: background 150ms;
      }
    }
  }

  > * {
    align-items: center;
    display: flex;
    justify-content: center;
  }

  > .day {
    color: var(--blue-grey);
    width: 30px;
    height: 30px;
    font-size: 12px;
    margin: 5px;
    &.selected {
      border: 1px solid var(--blue-grey);
      background-color: #409eff;
    }
    &.current {
      color: var(--black);
    }
    &::before {
      content: "";
      display: inline-block;
      height: 0;
      padding-bottom: 100%;
      width: 1px;
    }

    button {
      color: inherit;
      background: transparent;
      border: none;
      height: 100%;
      width: 100%;
      outline: none;
      /* &:hover {
        background: var(--grey);
        transition: background 150ms;
      } */
    }
  }

  > .today {
    background: var(--grey);
    border-radius: 2px;
  }
}
.text-center {
  text-align: center;
}
</style>



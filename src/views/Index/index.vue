<template>
  <div>
    <p class="text-center">选择的日期: {{ formattedDate }}</p>
    <!-- <p class="text-center">选择的日期: {{ curr }}</p> -->
    <calendar v-model="curr" />
  </div>
</template>

<script>
import calendar from '@/components/Datepicker'
import dateFns from 'date-fns'
export default {
  name: 'index',
  components: {
    calendar
  },
  data () {
    return {
      curr: new Date()
    }
  },
  computed: {
    formattedDate() {
      return dateFns.format(this.curr, 'YYYY-MM-DD');
    }
  }
}
</script>

<style scoped>
</style>



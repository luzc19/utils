<template>
  <el-date-picker
    class="filter-date" 
    :value="date"
    @input="handleInput"
    type="daterange"
    range-separator="-"
    format="yyyy-MM-dd HH:mm:ss"
    value-format="yyyy-MM-dd HH:mm:ss"
    :editable="editable"
    :picker-options="pickerOptions"
    :default-time="['00:00:00', '23:59:59']"
    start-placeholder="开始日期"
    end-placeholder="结束日期">
  </el-date-picker>
</template>

<script>
import emitter from 'element-ui/src/mixins/emitter';

export default {
  mixins: [emitter],
  props: {
    queryParams: {
      type: Object,
      required: true,
    },
    valueKey: {
      type: Array,
      default() {
        return ['startDate', 'endDate'];
      },
      validator(value) {
        return value.length === 2;
      },
    },
    limitDays: {
      type: Number,
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      selectDate: null,
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          // 多数情况下至少有minDate
          // 选中2个值，再次点输入框选中一个值，点输入框的清空，再次选择时，minDate为null
          if (minDate) {
            this.selectDate = minDate.getTime();
          }
          if (maxDate) {
            this.selectDate = null;
          }
        },
        disabledDate: (time) => {
          if (this.limitDays && this.selectDate !== null) {
            const one = this.limitDays * 24 * 3600 * 1000;
            const minTime = this.selectDate - one;
            const maxTime = this.selectDate + one;
            return time.getTime() > Date.now() || time.getTime() < minTime || time.getTime() > maxTime;
          }
          return false;
        },
      },
    };
  },
  computed: {
    startKey() {
      return this.valueKey[0];
    },
    endKey() {
      return this.valueKey[1];
    },
    date() {
      let startDate = this.queryParams[this.startKey];
      let endDate = this.queryParams[this.endKey];
      if (startDate && endDate) return [startDate, endDate];
      return [];
    },
  },
  methods: {
    handleInput(args) {
      if (args === null) {
        this.queryParams[this.startKey] = null;
        this.queryParams[this.endKey] = null;
      } else {
        [this.queryParams[this.startKey], this.queryParams[this.endKey]] = args;
      }
      this.dispatch('ElFormItem', 'el.form.change', args);
    },
  },
};
</script>

<style>
.filter-date .el-range-input {
  text-overflow: ellipsis;
}
</style>

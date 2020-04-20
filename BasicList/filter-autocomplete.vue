<template>
  <el-autocomplete class="inline-input" v-model="queryParams[nameKey]" :fetch-suggestions="querySearch" :placeholder="placeholder" :trigger-on-focus="triggerOnfocus"  @select="handleSelect" clearable></el-autocomplete>
</template>
<script>
export default {
  props: {
    queryParams: {
      type: Object,
      required: true,
    },
    valueKey: {
      type: [String, Array],
      required: true,
    },
    dataList: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
    placeholder: {
      type: String,
      default: '请输入内容',
    },
    triggerOnfocus: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
    };
  },
  computed: {
    nameKey() {
      return Array.isArray(this.valueKey) ? this.valueKey[0] : this.valueKey;
    },
    idKey() {
      return Array.isArray(this.valueKey) ? this.valueKey[1] : null;
    },
  },
  methods: {
    querySearch(queryString, cb) {
      if (this.idKey) this.queryParams[this.idKey] = null;
      const data = this.dataList;
      const results = queryString ? data.filter(item => item.value.indexOf(queryString) !== -1) : data;
      if (results.length === 1 && this.idKey) this.queryParams[this.idKey] = results[0].id;
      cb(results);
    },
    handleSelect(item) {
      if (this.idKey) this.queryParams[this.idKey] = item.id;
    },
  },
};
</script>
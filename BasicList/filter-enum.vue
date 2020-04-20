<template>
<el-select v-model="queryParams[valueKey]">
  <el-option v-for="item in options" :value="item.value" :label="item.label" :key="item.label"></el-option>
</el-select>
</template>

<script>
import { getEnumList } from '@/components/EnumModule';

export default {
  data() {
    return {
      options: [],
    };
  },
  props: {
    queryParams: {
      type: Object,
      required: true,
    },
    valueKey: {
      type: String,
      required: true,
    },
    enumCode: {
      type: String,
      required: true,
    },
  },
  created() {
    getEnumList([this.enumCode]).then(([data]) => {
      this.options = data.map(item => ({ label: item.description, value: item.value }));
    });
  },
  methods: {
    
  },
};
</script>

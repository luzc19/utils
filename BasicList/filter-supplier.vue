<template>
<el-autocomplete
  v-model="queryParams[valueKey]"
  :fetch-suggestions="getSuppliers"
  placeholder="请输入供应商"
></el-autocomplete>
</template>

<script>
export default {
  props: {
    queryParams: {
      type: Object,
      required: true,
    },
    valueKey: {
      type: String,
      default: 'supplierName',
    },
  },
  data() {
    return {
      suppliers: [],
    };
  },
  methods: {
    getSuppliers(supplierName, cb) {
      if (supplierName === '') {
        cb([]);
        return;
      }
      this.$axios({
        url: '/supplier/user/queryByName',
        method: 'get',
        params: {
          supplierName,
        },
      }).then((data) => {
        this.suppliers = data.model || [];
        cb(this.suppliers.map(item => ({ value: item.supplierName })));
      }).catch(() => {
        cb([]);
      });
    },
  },
};
</script>

<style scoped></style>

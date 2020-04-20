<template>
<el-select
  :value="queryParams.supplierName_inner"
  value-key="supplierId"
  filterable
  clearable
  remote
  reserve-keyword
  placeholder="请输入供应商"
  :remote-method="getSuppliers"
  @change="handleChange"
  :loading="loading">
  <el-option
    v-for="item in suppliers"
    :key="item.supplierId"
    :label="item.supplierName"
    :value="item">
  </el-option>
</el-select>
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
      default: 'supplierId',
    },
  },
  data() {
    return {
      loading: false,
      suppliers: [],
    };
  },
  created() {
    if (this.queryParams.supplierName_inner === undefined) {
      this.$set(this.queryParams, 'supplierName_inner', '');
    }
  },
  methods: {
    handleChange(item) {
      Object.assign(this.queryParams, {
        supplierName_inner: item ? item.supplierName : '',
        [this.valueKey]: item ? item.supplierId : null,
      });
    },
    getSuppliers(supplierName) {
      if (supplierName === '') {
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
      }).catch(() => {
        this.suppliers = [];
      });
    },
  },
};
</script>

<style scoped></style>

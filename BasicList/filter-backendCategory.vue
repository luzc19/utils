<template>
<div style="display: inline-block;">
    <el-cascader style="width:100%;" v-model="categoryPath" :options="categoryData" :props="props" @change="emitChange" clearable></el-cascader>
</div>
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
      required: true,
    },
  },
  data() {
    return {
      categoryData: [],
      categoryPath: '',
      props: {
        value: 'backendCategoryId',
        label: 'categoryName',
        children: 'backendCategoryList',
        checkStrictly: true,
      },
    };
  },
  created() {
    this.getCategory();
  },
  methods: {
    getCategory() {
      this.$axios({
        url: '/backendCategory/list',
        method: 'get',
        params: {
          categoryStatus: 1,
        },
      })
        .then((data) => {
          this.categoryData = JSON.parse(JSON.stringify(data.model));
          this.categoryClassify(this.categoryData, 2, 1);
        })
        .catch((error) => {
          window.top.$topVue.$message({
            message: error.message || '网络错误',
            type: 'error',
          });
        });
    },
    categoryClassify(data, targetLevel, nowLevel) {
      const self = this;
      data.forEach((item, index) => {
        if (targetLevel === nowLevel) {
          self.$delete(data[index], 'backendCategoryList');
        } else if (item.backendCategoryList && item.backendCategoryList.length > 0) {
          self.categoryClassify(item.backendCategoryList, targetLevel, (nowLevel + 1));
        }
      });
    },
    emitChange(list) {
      let listString = '';
      if (list && list.length > 0) {
        list.forEach((item) => {
          listString += `${item}|`;
        });
        const len = listString.length - 1;
        listString = listString.slice(0, len);
      }
      this.queryParams[this.valueKey] = listString;
    },
  },
};
</script>

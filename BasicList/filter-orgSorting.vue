<template>
<div style="display: inline-block;">
  <el-cascader class="w50p" v-model="orgId" :options="allOrgDTOs" :props="treeProps" :show-all-levels="false" @change="handleOrgChange" placeholder="请选择组织" clearable></el-cascader>
  <el-select v-if="sortingKey" v-model="queryParams[sortingKey]" class="w50p" placeholder="请选择分拣中心">
    <el-option v-for="(item, index) in sortingCenter" :key="index" :value="item.sortingCenterId" :label="item.sortingCenterName"></el-option>
  </el-select>
</div>
</template>

<script>

export default {
  data() {
    return {
      orgId: null, // 储存当前选择的组织id
      allOrgDTOs: [], // 储存该用户下的组织
      treeProps: {
        label: 'orgName',
        value: 'orgId',
        children: 'childrenList',
        checkStrictly: true,
        emitPath: false,
      },
      sortingCenter: [],
    };
  },
  props: {
    queryParams: {
      type: Object,
      required: true,
    },
    valueKey: {
      type: [String, Array],
      required: true,
    },
  },
  computed: {
    orgKey() {
      return Array.isArray(this.valueKey) ? this.valueKey[0] : null;
    },
    sortingKey() {
      return Array.isArray(this.valueKey) ? this.valueKey[1] : this.valueKey;
    },
  },
  created() {
    this.getOrgTreeByCurrentUser();
  },
  methods: {
    getOrgTreeByCurrentUser() {
      this.$axios({
        url: '/common/personal/orgTreeByCurrentUser',
        method: 'get',
        errorTips: false,
        params: {
          orgTypes: [1, 3],
        },
      }).then((data) => {
        if (data.success && data.model) this.allOrgDTOs = this.switchOrgTree([data.model]);
      });
    },
    switchOrgTree(treeData) {
      return treeData.map((item) => {
        if (item.childOrgVOS && item.childOrgVOS.length > 0) {
          return {
            ...item,
            childrenList: this.switchOrgTree(item.childOrgVOS),
          };
        }
        return { ...item };
      });
    },
    handleOrgChange() {
      this.sortingCenter = [];
      this.queryParams[this.sortingKey] = null;
      if (this.orgKey) this.queryParams[this.orgKey] = this.orgId;
      if (!this.orgId) return;
      this.getSortingCenter(this.orgId);
    },
    getSortingCenter(orgId) {
      return this.$axios({
        url: '/tms/sortingcenter/querySortingCenterList',
        method: 'get',
        params: {
          orgId,
        },
      }).then((data) => {
        if (data.success) this.sortingCenter = data.model || [];
      });
    },
  },
};
</script>

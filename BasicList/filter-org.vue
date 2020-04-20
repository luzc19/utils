<template>
<div style="display: inline-block;">
  <el-cascader v-model="queryParams[valueKey]" :options="allOrgDTOs" :props="treeProps" :show-all-levels="false" style="width:100%;" @change="handleChange" :disabled="isDisabled" :placeholder="placeholder" clearable></el-cascader>
</div>
</template>

<script>
/**
 * 组织类型(orgTypes)：1-中心单元 2-部门单元 3-作业单元
 * 只有中心单元有下级
 * 只有 人员管理 和 组织管理 需要显示部门单元
 * 其他地方都默认不显示部门单元
 */

export default {
  data() {
    return {
      allOrgDTOs: [],
      treeProps: {
        label: 'orgName',
        value: 'orgId',
        children: 'childrenList',
        checkStrictly: true,
        emitPath: false,
      },
    };
  },
  props: {
    queryParams: {
      type: Object,
      required: true,
    },
    valueKey: {
      type: String,
      default: 'lookUpOrgId',
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isAllTree: {
      type: Boolean,
      default: false,
    },
    orgTypes: {
      type: Array,
      default() {
        return [1, 3];
      },
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
  },
  created() {
    if (this.isAllTree) this.getOrgTreeForTop();
    else this.getOrgTreeByCurrentUser();
  },
  methods: {
    getOrgTreeByCurrentUser() {
      this.$axios({
        url: '/common/personal/orgTreeByCurrentUser',
        method: 'get',
        errorTips: false,
        params: {
          orgTypes: this.orgTypes,
        },
      }).then((data) => {
        if (data.success && data.model) this.allOrgDTOs = this.switchOrgTree([data.model]);
      });
    },
    getOrgTreeForTop() {
      this.$axios({
        url: '/sys/org/orgTreeForTop',
        method: 'get',
        errorTips: false,
        params: {
          orgTypes: this.orgTypes,
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
    handleChange() {
      this.$nextTick(() => {
        this.$emit('change');
      });
    },
  },
};
</script>

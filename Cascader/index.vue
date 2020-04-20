<template>
<div class="wrapper">
  <div class="mr20" :class="{'w50p': selectedDetailVisible, 'w100p': !selectedDetailVisible}">
    <div class="mb5">请选择</div>
    <div>
      <el-input placeholder="请输入关键词" :value="keywordOnSelect" @input="handleKeywordOnSelect" clearable></el-input>
    </div>
    <div class="select-box">
      <div v-for="(item, index) in selectListByFilter" :key="index" class="flex1">
        <group
          ref="group"
          v-model="selectedList[index]"
          :showAllSelect="showAllSelect"
          :selectList="selectListByFilter[index]"
          :halfSelectedList="halfSelectedList[index]"
          :groupByLetter="groupByLetter && index === 0"
          @change="handleChange(index)"
          @clickOne="getChildren">
        </group>
      </div>
    </div>
  </div>
  <div class="w50p" v-if="selectedDetailVisible && selectedList && selectedList.length">
    <div class="mb5">已选择：
      <span class="text-strong mr20">{{selectedListDetail.length}}</span>
      <a href="javascript:;" class="text-danger" @click="clearAll">清空</a>
    </div>
    <div>
      <el-input placeholder="请输入关键词" v-model="keywordOnSelected" clearable></el-input>
    </div>
    <div class="selected-box">
      <el-scrollbar wrap-style="height: 370px;" tag="ul">
        <li class="selected-item" v-for="(item, index) in selectedListDescByFilter" :key="index">
          <span class="mr10">{{item.labelPath || item.label}}</span>
          <span class="el-icon-close text-danger pointer" @click="remove(item)"></span>
        </li>
      </el-scrollbar>
    </div>
  </div>
</div>
</template>

<script>
import emitter from 'element-ui/src/mixins/emitter';
import { groupBy, keyBy, uniqBy, first, debounce, flatten } from 'lodash';
import group from './group.vue';

function convertTree(tree, parentLabelPath, parentValuePath, parentId) {
  return tree.map((item) => {
    let children = [];
    let labelPath = '' + item.label;
    let valuePath = '' + item.value;
    if (parentLabelPath && parentValuePath) {
      labelPath = '' + (parentLabelPath || '') + '/' + item.label;
      valuePath = '' + (parentValuePath || '') + '/' + item.value;
    }
    if (item.children && item.children.length) {
      children = convertTree(item.children, labelPath, valuePath, item.value);
    }
    return {
      ...item,
      parentId: parentId || 0,
      labelPath,
      valuePath,
      children: children,
      disabled: item.disabled || false,
    };
  });
}
function getChildrenDeep(arr, key = 'children') {
  let result = [...arr];
  arr.forEach((item) => {
    if (item[key] && item[key].length) {
      result = result.concat(getChildrenDeep(item[key]));
    }
  });
  return result;
}
function filterIn(arr, arr2) {
  return arr.filter(item => arr2.some(item2 => item.value === item2.value));
}
function filterNotIn(arr, arr2) {
  return arr.filter(item => !arr2.some(item2 => item.value === item2.value));
}

export default {
  mixins: [emitter],
  components: {
    group,
  },
  props: {
    // treeData的每个节点结构须如下，其中 
    // {
    //   label: '', 显示名 必须
    //   id: 1,  id===value 必须
    //   value: 1, 选中值 必须
    //   level: 1, 所在层级，第一层级为1 必须
    //   parentId: 0, 上级Id 子级的parentId必须
    //   children: [],
    // }
    treeData: {
      type: Array,
      default() {
        return [];
      },
    },
    // 默认已选值，keys即是treeData中每个节点的value值
    defaultCheckedKeys: {
      type: Array,
    },
    selectedDetailVisible: {
      type: Boolean,
      default: true,
    },
    groupByLetter: {
      type: Boolean,
      default: false,
    },
    remoteMethod: {
      type: Function,
    },
    showAllSelect: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    let level = 0;
    level = Math.max.apply(null, getChildrenDeep(this.treeData).map(item => item.level));
    
    let selectList = [];
    let selectedList = [];
    let halfSelectedList = [];
    for (let index = 0; index < level; index++) {
      selectList.push([]);
      selectedList.push([]);
      halfSelectedList.push([]);
    }
    return {
      level,
      selectList,
      selectListByFilter: [],
      selectedList,
      halfSelectedList,
      keywordOnSelect: '',
      keywordOnSelected: '',
    };
  },
  computed: {
    selectedListDetail() {
      return flatten(this.selectedList).filter(item => item.children.length === 0);
    },
    selectedListDescByFilter() {
      if (!this.keywordOnSelected) return this.selectedListDetail;
      return this.selectedListDetail.filter(item => item.labelPath.indexOf(this.keywordOnSelected) >= 0);
    },
  },
  created() {
    if (this.treeData.length) {
      this.setBasicData(this.treeData);
      this.selectList.splice(0, 1, this.nodes.filter(item => item.level === 1));
      this.getToSelectList();
      this.setCheckedKeys(this.defaultCheckedKeys);
    }
  },
  methods: {
    setBasicData(treeData) {
      this.nodes = getChildrenDeep(convertTree(treeData));
      if (this.nodes.filter(item => item.level > 1 && !item.parentId).length > 0) {
        console.warn('请检查传入的数据，层级大于1的子项必须有parentId');
      }
      this.treeMap = keyBy(this.nodes, 'value');
    },
    getChildren(item) {
      if (item.children && item.children.length) {
        let index = item.level;
        let { children } = item;
        if (this.keywordOnSelect && item.label.indexOf(this.keywordOnSelect) === -1) {
          // 如果当前节点不匹配关键词，筛选子级
          children = item.children.filter((child) => {
            // 该子级已符合关键词，匹配
            if (child.label.indexOf(this.keywordOnSelect) >= 0) {
              return true;
            }
            // 判断后代是否包含符合关键词的，有则匹配
            return getChildrenDeep(child.children).find(node => node.label.indexOf(this.keywordOnSelect) >= 0);
          });
        }
        this.selectListByFilter.splice(index, 1, children);
        // 获取子级后，清空子级之后的层级
        for (index++; index < this.selectListByFilter.length; index++) {
          this.selectListByFilter.splice(index, 1, []);
        }
      } else if (item.level < this.level) {
        this.selectListByFilter.splice(item.level, 1, []);
      }
    },
    getToSelectList: debounce(function() {
      if (typeof this.remoteMethod === 'function') {
        this.remoteMethod(this.keywordOnSelect).then((data) => {
          this.setBasicData(data);
          this.selectList = [convertTree(data)];
          this.halfSelectedList = [[]];
          this.selectListByFilter = this.selectList;
        });
        return;
      }
      if (!this.keywordOnSelect) {
        this.selectListByFilter = this.selectList;
        return;
      }
      // 所有相关节点
      let relativeNodes = this.nodes.filter(item => item.label.indexOf(this.keywordOnSelect) >= 0);
      if (relativeNodes.length === 0) {
        this.selectListByFilter = [];
        return;
      }
      // 所有相关节点及其上级，包括父级，祖级，过滤重复
      let nodePool = uniqBy(flatten(relativeNodes.map((item) => {
        let arr = [item];
        let prevNode = this.treeMap[item.parentId];
        while (prevNode) {
          arr.push(prevNode);
          prevNode = this.treeMap[prevNode.parentId];
        }
        return arr;
      })), 'id');
      
      let result = this.selectList.map(() => []);
      for (let index = 0; index < result.length; index++) {
        let prevLevelId = null;
        if (index > 0) {
          if (first(result[index - 1])) {
            prevLevelId = first(result[index - 1]).id;
            result[index] = nodePool.filter(item => item.level === index + 1 && item.parentId === prevLevelId);
          }
        } else {
          result[index] = nodePool.filter(item => item.level === index + 1);
        }
      }

      this.selectListByFilter = result;
      this.$nextTick(() => {
        this.$refs.group.forEach((VNodeGroup) => {
          VNodeGroup.activeFirst();
        });
      });
    }, 300),
    handleKeywordOnSelect(str) {
      this.keywordOnSelect = str;
      this.getToSelectList();
    },
    handleChange(index) {
      // 延迟执行保障先获取获取子级
      this.$nextTick(() => {
        this.checkCurrent(index);
        this.checkPrev(index);
        this.checkNext(index);
        this.emitChange();
      });
    },
    checkCurrent(currentIndex) {
      this.halfSelectedList[currentIndex] = filterNotIn(this.halfSelectedList[currentIndex], this.selectedList[currentIndex]);
    },
    checkPrev(currentIndex) {
      let prevIndex = currentIndex - 1;

      while (prevIndex >= 0) {
        // 已选中、半选中
        let selectedKeyMap = groupBy(this.selectedList[prevIndex + 1], 'parentId');
        this.selectedList[prevIndex].filter(item => item.children.length === 0).forEach((item) => {
          selectedKeyMap[item.value] = [];
        });
        let relativeKeyMap = groupBy([...this.selectedList[prevIndex + 1], ...this.halfSelectedList[prevIndex + 1]], 'parentId'); 
        // 全选中父级
        let selectedParents = Object.keys(selectedKeyMap)
          .map(key => this.treeMap[key])
          .filter(item => item.children.length === selectedKeyMap[item.value].length);
        this.selectedList.splice(prevIndex, 1, selectedParents);
        // 半选父级
        let relativeParents = Object.keys(relativeKeyMap).map(key => this.treeMap[key]);
        this.halfSelectedList[prevIndex] = filterNotIn(relativeParents, this.selectedList[prevIndex]);
        prevIndex--;
      }
    },
    checkNext(currentIndex) {
      let nextIndex = currentIndex + 1;

      while (nextIndex < this.selectedList.length) {
        let childrenOfHalfSelect = flatten(this.halfSelectedList[nextIndex - 1].map(halfItem => halfItem.children));
        let selectedChildrenOfHalfSelect = filterIn(this.selectedList[nextIndex], childrenOfHalfSelect);
        let itemsOfAllSelect = flatten(this.selectedList[nextIndex - 1].map(item => item.children));
        this.selectedList.splice(nextIndex, 1, [...selectedChildrenOfHalfSelect, ...itemsOfAllSelect]);
        nextIndex++;
      }
    },
    remove(node) {
      let index = node.level - 1;
      let list = this.selectedList[index];
      let indexToRemove = list.findIndex(item => node.value === item.value);
      if (indexToRemove >= 0) {
        list.splice(indexToRemove, 1);
      }
      this.checkPrev(index);
      this.emitChange();
    },
    clearAll() {
      let newSelectedList = [];
      let newHalfSelectedList = [];
      for (let index = 0; index < this.level; index++) {
        newSelectedList.push([]);
        newHalfSelectedList.push([]);
      }
      this.selectedList = newSelectedList;
      this.halfSelectedList = newHalfSelectedList;
      this.emitChange();
    },
    emitChange() {
      this.$emit('change', this.selectedListDetail);
      this.dispatch('ElFormItem', 'el.form.change', [this.selectedListDetail]);
    },
    setCheckedKeys(keys = []) {
      if (keys && keys.length) {
        keys.map(id => this.treeMap[id]).filter(item => item).forEach((item) => {
          this.selectedList[item.level - 1].push(item);
        });
        this.checkPrev(this.level - 1);
      }
    },
  },
};
</script>

<style scoped>
.selected-box, .select-box {
  height: 370px;
  border: 1px solid #DCDFE6;
}
.select-box {
  display: flex;
}
.selected-box {
  padding: 5px 10px;
}
.selected-item {
  padding: 5px;
  line-height: 1.6;
}
.selected-item:hover {
  background: #f5f5f5;
}
.wrapper {
  display: flex;
}
.pointer {
  cursor: pointer;
  opacity: 0.8;
}
.pointer:hover {
  opacity: 1;
}
.mr10 {
  margin-right: 10px;
}
.mr20 {
  margin-right: 20px;
}
.mb5 {
  margin-bottom: 5px;
}
</style>

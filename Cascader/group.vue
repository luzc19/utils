<template>
<div>
  <ul v-if="groupByLetter" class="box-index">
    <li v-for="(item, index) in letters" :key="index" class="text-center fs12">
      <el-tooltip effect="dark" :content="item" placement="right-start">
        <span class="pointer" @click="scrollTo(item)">{{item}}</span>
      </el-tooltip>
    </li>
  </ul>
  <div style="margin-left: 20px;">
    <el-scrollbar wrap-style="height: 370px;" ref="scrollbar">
      <ul>
        <template  v-for="(list, letter) in selectListInGroup">
          <li class="select-item letter" :data-letter="letter" v-if="checkLetter(letter) && list.length" :key="letter">{{letter}}</li>
          <li class="select-item" :key="letter+'all'" v-if="showAllSelect && list.length > 1">
            <el-checkbox v-model="selectAll" @change="toggleSelectAll" label="全选"></el-checkbox>
          </li>
          <li class="select-item" v-for="(item, index) in list" :key="letter+index">
            <el-checkbox class="mr0" 
              :label="item" 
              :indeterminate="checkInHalfList(item)"
              :disabled="item.disabled"
              v-model="model" 
              @change="handleClickOne(item)"><span></span></el-checkbox>
            <span @click="handleClickOne(item)" class="item-name" 
              :class="{active: checkActive(item), disabled: item.disabled}">{{item.label}}</span>
          </li>
        </template>
      </ul>
    </el-scrollbar>
  </div>
</div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    selectList: {
      type: Array,
      default() {
        return [];
      },
    },
    halfSelectedList: {
      type: Array,
      default() {
        return [];
      },
    },
    groupByLetter: {
      type: Boolean,
      default: false,
    },
    showAllSelect: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'],
      currentItem: null,
      selectAll: false,
    };
  },
  computed: {
    selectListInGroup() {
      if (this.groupByLetter) {
        let listMap = {};
        this.letters.forEach((letter) => {
          listMap[letter] = [];
        });
        this.selectList.forEach((item) => {
          if (listMap[item.initial]) {
            listMap[item.initial].push(item);
          } else {
            if (!listMap['其他']) {
              listMap['其他'] = [];
            }
            listMap['其他'].push(item);
          }
        });
        return listMap;
      }
      return {
        null: this.selectList,
      };
    },
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
        this.$emit('change', val);
      },
    },
  },
  methods: {
    activeFirst() {
      [this.currentItem] = this.selectList;
    },
    handleClickOne(item) {
      this.currentItem = item;
      this.$emit('clickOne', item);
      this.$nextTick(() => {
        this.checkSelectAll();
      });
    },
    checkActive(item) {
      if (item === this.currentItem) return true;
      return this.value.findIndex(checkedItem => checkedItem.value === item.value) >= 0;
    },
    checkInHalfList(item) {
      return this.halfSelectedList.findIndex(halfItem => halfItem.value === item.value) >= 0;
    },
    checkLetter(letter) {
      return letter.length > 0 && letter !== 'undefined' && letter !== 'null';
    },
    scrollTo(letter) {
      let { scrollbar } = this.$refs;
      let elem = scrollbar.$el.querySelector('.el-scrollbar__wrap');
      let target = scrollbar.$el.querySelector(`.letter[data-letter=${letter}]`);
      if (target) {
        elem.scrollTop = target.offsetTop;
        scrollbar.handleScroll();
      }
    },
    toggleSelectAll(isChecked) {
      let val = [];
      if (isChecked) {
        val = this.selectList.filter(item => !item.disabled);
      } 
      this.$emit('input', val);
      this.$emit('change', val);
    },
    checkSelectAll() {
      if (this.value.length === this.selectList.filter(item => !item.disabled).length) {
        this.selectAll = true;
      } else {
        this.selectAll = false;
      }
    },
  },
};
</script>

<style scoped>
.box-index {
  position: absolute;
  margin-right: 5px;
  background: #eee;
  line-height: 16px;
}
.select-item {
  display: flex;
  margin: 5px;
  line-height: 1.6;
}
.item-name {
  cursor: pointer;
}
.item-name.active {
  color: #1679DB;
}
.item-name.disabled {
  color: #e60012
}
.mr0 {
  margin-right: 0;
}
</style>

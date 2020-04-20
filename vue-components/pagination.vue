<template>
<div class="v-pagination clearfix" style="">
  <a href="javascript:;" class="button-pre" v-on:click.prevent="pre">上一页</a>

  <template v-for="n in num">
    <span class="occupy" :key="'left'+n" v-if="n==currentPage-3&&n>1"> ... </span>
    <a :key="'middle'+n" href="javascript:;"
      v-if="n==1||( -3<n-currentPage&&n-currentPage<3 )||n==num"
      class="page-index"
      :class="{'current-page': currentPage==n}"
      @click="gotoPage(n)"
      >{{n}}</a>
    <span class="occupy" :key="'right'+n" v-if="n==currentPage+3&&n<num"> ... </span>
  </template>

  <a href="javascript:;" class="button-next" v-on:click.prevent="next">下一页</a>
</div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'pagination',
  props: {
    total: Number,
    pageSize: Number,
    currentPage: Number,
  },
  data() {
    return {
      toJump: null,
    };
  },
  computed: {
    num() {
      return Math.ceil(this.total / this.pageSize);
    },
  },
  methods: {
    pre() {
      this.gotoPage(this.currentPage - 1);
    },
    next() {
      this.gotoPage(this.currentPage + 1);
    },
    gotoPage(index: number) {
      if (index !== this.currentPage && index >= 1 && index <= this.num) {
        this.$emit('gotoPage', index);
      }
    },
  },
});
</script>

<style scoped>
.v-pagination {
  text-align: right;
}
.button-pre, .button-next {
  display: inline-block;
  width: 74px;
  height: 38px;
  line-height: 38px;
  font-size: 12px;
  background: #fff;
  border: 1px solid#EEEEEE;
  color: #888888;
  text-align: center;
  text-decoration: none;
  margin: 0 2px;
}
.page-index {
  display: inline-block;
  width: 38px;
  height: 38px;
  line-height: 38px;
  text-align: center;
  color: #aaaaaa;
  border: 1px solid #EEEEEE;
  font-size: 12px;
  background: #fff;
  margin: 0 2px;
}
.page-index.current-page, .page-index:hover, .button-pre:hover, .button-next:hover {
  color: #fff;
  background: #dd5555;
}

.occupy {
  padding: 0 12px;
}
</style>

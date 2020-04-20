<template>
<div style="display: inline-block;">
  <template v-if="thumbVisible">
    <div class="img-block" v-for="(item, index) in imgs" :key="index" >
      <img  :src="item" class="pointer" v-img="{group: uniqueKey}" >
      <span v-if="removable" class="el-icon-error icon-remove pointer" @click.stop="handleRemove(index)"></span>
    </div>
    <slot name="append"></slot>
  </template>
  <a v-else href="javascript:;" v-show="imgs.length" @click="showOriginImg"><slot>查看</slot></a>
</div>
</template>

<script>
import Vue from 'vue';
import ImgScreen from 'v-img/lib/ImgScreen.vue';

const Screen = Vue.extend(ImgScreen);
let imgScreenInstance = new Screen();
imgScreenInstance.$mount();
document.body.appendChild(imgScreenInstance.$el);

let num = 1;
function getUniqueKey() {
  return num++;
}

export default {
  props: {
    // 传入的imgs 为图片url组成的数组，没有多余层级
    imgs: {
      type: Array,
      default() {
        return [];
      },
    },
    removable: {
      type: Boolean,
      default: false,
    },
    thumbVisible: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      uniqueKey: getUniqueKey(),
    };
  },
  methods: {
    handleRemove(index) {
      this.imgs.splice(index, 1);
      this.$emit('remove', index);
    },
    showOriginImg() {
      imgScreenInstance.images = this.imgs;
      imgScreenInstance.closed = false;
    },
  },
};
</script>

<style scoped>
.img-block {
  position: relative;
  display: inline-block;
  width: 32px;
  height: 32px;
  line-height: 32px;
  border: 1px solid #eee;
  margin-right: 8px;
  font-size: 0;
  text-align: center;
  vertical-align: middle;
}
.icon-remove {
  position: absolute;
  right: -8px;
  top: -8px;
  font-size: 16px;
  color: #e60012;
  background: #fff;
  border-radius: 50%;
}
.icon-remove:hover {
  opacity: 0.8;
}
.pointer {
  cursor: pointer;
}
</style>

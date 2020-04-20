import { DirectiveFunction } from 'vue';

interface BindFn {
  (): void;
}
interface RegisterNode {
  el: Element
  bindFn: BindFn
}

const nodeList: RegisterNode[] = [];


document.addEventListener('click', (event: MouseEvent) => {
  nodeList.forEach((item) => {
    if (item.el === event.target || item.el.contains(event.target as Node)) {
      return;
    }
    item.bindFn();
  });
});

const bindInit: DirectiveFunction = function (el, binding) {
  nodeList.push({
    el,
    bindFn: binding.value,
  });
};

/**
 * v-clickoutside
 * @desc 点击元素外面才会触发的事件
 * @example
 * ```vue
 * <div v-element-clickoutside="handleClose">
 * ```
 */
export default {
  bind: bindInit,

  unbind(el: Element) {
    const index = nodeList.findIndex(item => item.el === el);
    if (index >= 0) {
      nodeList.splice(index, 1);
    }
  },
};

import { debounce } from 'lodash';

export default {
  data() {
    return {
      activeFloor: 0,
    };
  },
  mounted() {
    document.addEventListener('scroll', this.checkActiveFloor);
  },
  beforeDestroy() {
    document.removeEventListener('scroll', this.checkActiveFloor);
  },
  methods: {
    toFloor(index) {
      let floorTop = this.$el.querySelector('#floor' + index).offsetTop;
      document.body.scrollTop = floorTop;
      document.documentElement.scrollTop = floorTop;
      this.activeFloor = index - 1;
    },
    checkActiveFloor: debounce(function() {
      let { scrollTop } = document.documentElement;
      let floors = document.querySelectorAll('.floor');
      let newActiveFloor = 0;
      for (let index = 0; index < floors.length; index++) {
        const { offsetTop } = floors[index];
        if (scrollTop > offsetTop) {
          newActiveFloor += 1;
        }
      }
      this.activeFloor = newActiveFloor;
    }, 200),
  },
};

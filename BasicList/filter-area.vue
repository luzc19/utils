<template>
<AreaSelector
  :level="level"
  :initData="areaIds"
  @change="handleAreaChange" />
</template>

<script>
import AreaSelector from '@/components/Area/AreaSelector.vue';

export default {
  props: {
    queryParams: {
      type: Object,
      required: true,
    },
    valueKey: {
      type: Array,
      default() {
        return ['provinceId', 'cityId', 'districtId'];
      },
      validator(value) {
        return value.length >= 1;
      },
    },
  },
  components: {
    AreaSelector,
  },
  data() {
    let [provinceKey, cityKey, districtKey] = this.valueKey;
    return {
      provinceKey,
      cityKey,
      districtKey,
      areaIds: [this.queryParams[provinceKey], this.queryParams[cityKey], this.queryParams[districtKey]],
    };
  },
  computed: {
    level() {
      return this.valueKey.length;
    },
  },
  methods: {
    handleAreaChange(area) {
      this.queryParams[this.provinceKey] = area.province ? area.province.provinceId : null;
      this.queryParams[this.cityKey] = area.city ? area.city.cityId : null;
      this.queryParams[this.districtKey] = area.district ? area.district.districtId : null;
    },
  },
};
</script>

<style scoped></style>

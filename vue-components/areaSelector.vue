<template>
<div style="display: inline-block;">
  <el-select v-model="currentProvince" placeholder="请选择省" :style="areaStyle" value-key="provinceId" :disabled="disabled" clearable >
    <el-option
      v-for="item in provinces"
      :key="item.provinceId"
      :label="item.provinceName"
      :value="item">
    </el-option>
  </el-select>
  <el-select v-model="currentCity" placeholder="市" v-show="level>1" :style="areaStyle" value-key="cityId" :disabled="disabled" clearable >
    <el-option
      v-for="item in cities"
      :key="item.cityId"
      :label="item.cityName"
      :value="item">
    </el-option>
  </el-select>
  <el-select v-model="currentDistrict" placeholder="县/区" v-show="level>2" :style="areaStyle" value-key="districtId" :disabled="disabled" clearable >
    <el-option
      v-for="item in districts"
      :key="item.districtId"
      :label="item.districtName"
      :value="item">
    </el-option>
  </el-select>
  <el-select v-model="currentTown" placeholder="镇/乡/街道" v-show="level>3" :style="areaStyle" value-key="townId" :disabled="disabled" clearable >
    <el-option
      v-for="item in towns"
      :key="item.townId"
      :label="item.townName"
      :value="item">
    </el-option>
  </el-select>
</div>
</template>
<script type="text/javascript">
import emitter from 'element-ui/src/mixins/emitter';
import { debounce } from 'lodash';
import area from './area';

export default {
  mixins: [emitter],
  props: {
    level: {
      type: Number,
      default: 4,
    },
    provinceId: {
      type: Number,
      default: 0,
    },
    cityId: {
      type: Number,
      default: 0,
    },
    districtId: {
      type: Number,
      default: 0,
    },
    townId: {
      type: Number,
      default: 0,
    },
    initData: {
      type: Array,
      default() {
        return [];
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  components: {

  },
  data() {
    return {
      provinces: [],
      cities: [],
      districts: [],
      towns: [],

      currentProvince: null,
      currentCity: null,
      currentDistrict: null,
      currentTown: null,

      initing: false,
    };
  },
  computed: {
    areaStyle() {
      return {
        width: (100 / this.level).toFixed(2) + '%',
      };
    },
  },
  created() {
    this.getProvinces();
    this.setCurrent();
  },
  methods: {
    getProvinces() {
      return area.getAllProvince().then((data) => {
        this.provinces = data;
      });
    },
    getCities(id) {
      return area.getCityList(id).then((data) => {
        this.cities = data;
      });
    },
    getDistricts(id) {
      return area.getDistrictList(id).then((data) => {
        this.districts = data;
      });
    },
    getTowns(id) {
      return area.getTownList(id).then((data) => {
        this.towns = data;
      });
    },
    setCurrent() {
      const promiseArr = [];
      const provinceId = this.initData[0] || 0;
      const cityId = this.initData[1] || 0;
      const districtId = this.initData[2] || 0;
      const townId = this.initData[3] || 0;
      this.initing = true;

      if (provinceId > 0) {
        promiseArr.push(this.getProvinces().then(() => {
          this.currentProvince = this.provinces.find(item => item.provinceId === provinceId) || null;
        }));
        promiseArr.push(this.getCities(provinceId).then(() => {
          this.currentCity = this.cities.find(item => item.cityId === cityId) || null;
        }));
      }

      if (cityId > 0) {
        promiseArr.push(this.getDistricts(cityId).then(() => {
          this.currentDistrict = this.districts.find(item => item.districtId === districtId) || null;
        }));
      }
      if (districtId > 0) {
        promiseArr.push(this.getTowns(districtId).then(() => {
          this.currentTown = this.towns.find(item => item.townId === townId) || null;
        }));
      }
      return Promise.all(promiseArr).then(() => {
        this.initing = false;
      }).catch(() => {
        this.initing = false;
      });
    },
    change: debounce(function () {
      const data = {
        province: this.currentProvince,
        city: this.currentCity,
        district: this.currentDistrict,
        town: this.currentTown,
        idMap: {
          provinceId: this.currentProvince ? this.currentProvince.provinceId : null,
          cityId: this.currentCity ? this.currentCity.cityId : null,
          districtId: this.currentDistrict ? this.currentDistrict.districtId : null,
          townId: this.currentTown ? this.currentTown.townId : null,
        },
      };
      this.$emit('change', data);
      this.dispatch('ElFormItem', 'el.form.change', [data]);
    }, 100),
  },
  watch: {
    currentProvince(val) {
      if (!this.initing) {
        if (val && this.level > 1) {
          this.getCities(val.provinceId);
        } else {
          this.cities = [];
        }
        this.currentCity = null;
        this.change();
      }
    },
    currentCity(val) {
      if (!this.initing) {
        if (val && this.level > 2) {
          this.getDistricts(val.cityId);
        } else {
          this.districts = [];
        }
        this.currentDistrict = null;
        this.change();
      }
    },
    currentDistrict(val) {
      if (!this.initing) {
        if (val && this.level > 3) {
          this.getTowns(val.districtId);
        } else {
          this.towns = [];
        }
        this.currentTown = null;
        this.change();
      }
    },
    currentTown() {
      if (!this.initing) {
        this.change();
      }
    },
    initData() {
      this.setCurrent();
    },
  },
};
</script>

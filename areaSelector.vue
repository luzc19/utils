<template>
<div class="area-selector" v-clickoutside="hide" >
  <div class="area-info" :class="{disabled: disabled}" @click="toggle">
    <span v-if="currentProvince">{{currentProvince.provinceName}}</span>
    <span v-if="currentCity"> / {{currentCity.cityName}}</span>
    <span v-if="currentDistrict"> / {{currentDistrict.districtName}}</span>
    <span v-if="currentTown"> / {{currentTown.townName}}</span>
    <span v-if="isEmpty" class="text-color-4 fs12">{{placeholder}}</span>
    &nbsp;
  </div>
  <div class="select-block" v-show="selectBoxVisible">
    <template v-if="isLogin">
      <div class="select-title">常用地址</div>
      <div class="common-area pointer" v-for="(item, index) in address" :key="`adds${index}`" @click="selectAddress(item)">
        <strong style="marginRight:15px">{{item.consignee}}</strong>
        <span :title="item | addressText">{{item | addressText}}</span>
      </div>
      <div class="common-area" v-if="!address.length" style="border:none">
        <small>暂无相关地址</small>
      </div>
      <div class="select-title">
        <span class="pointer" @click="showAddress = !showAddress">
          选择新地址
          <i v-if="showAddress" class="el-icon-arrow-up"></i>
          <i v-else class="el-icon-arrow-down"></i>
        </span>
      </div>
    </template>
    <div style="margin-bottom:5px;border:1px dotted #666;" v-show="showAddress || !isLogin">
      <ul class="tabs clearfix">
        <li class="tab-item" :class="{active: levelToSelect === 1}" @click="jumpTo(1)"><span v-if="level >= 1">省份</span></li>
        <li class="tab-item" :class="{active: levelToSelect === 2}" @click="jumpTo(2)"><span v-if="level >= 2">市区</span></li>
        <li class="tab-item" :class="{active: levelToSelect === 3}" @click="jumpTo(3)"><span v-if="level >= 3">区县</span></li>
        <li class="tab-item" :class="{active: levelToSelect === 4}" @click="jumpTo(4)"><span v-if="level >= 4">乡镇/街道</span></li>
      </ul>
      <div class="area-block clearfix" v-show="levelToSelect === 1">
        <div class="text-center" v-if="provinces.length === 0">请稍后...</div>
        <span class="area-item" v-for="(item, index) in provinces" :key="index" @click="selectProvince(item)">{{item.provinceName}}</span>
      </div>
      <div class="area-block clearfix"  v-show="levelToSelect === 2">
        <div class="text-center" v-if="cities.length === 0">请稍后...</div>
        <span class="area-item" v-for="(item, index) in cities" :key="index"  @click="selectCity(item)">{{item.cityName}}</span>
      </div>
      <div class="area-block clearfix"  v-show="levelToSelect === 3">
        <div class="text-center" v-if="districts.length === 0">请稍后...</div>
        <span class="area-item" v-for="(item, index) in districts" :key="index"  @click="selectDistrict(item)">{{item.districtName}}</span>
      </div>
      <div class="area-block clearfix"  v-show="levelToSelect === 4">
        <div class="text-center" v-if="towns.length === 0">请稍后...</div>
        <span class="area-item" v-for="(item, index) in towns" :key="index"  @click="selectTown(item)">{{item.townName}}</span>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';
import clickoutside from '@/directives/clickoutside';
import {
  getCommonAddress, getAllProvince, getCityList, getDistrictList, getTownList, Address, Province, City, District, Town,
} from '@/service/area';
import { getCookie } from '@/service/cookie';

@Component({
  directives: {
    clickoutside,
  },
  filters: {
    addressText(addsData: Address) {
      return `${addsData.province} · ${addsData.city} · ${addsData.district}${addsData.town}${addsData.address}`;
    },
  },
})
export default class AreaSelector extends Vue {
  @Prop({ default: 4 }) private level!: number;

  @Prop({ default: () => [] }) private initData!: number[];

  @Prop({ default: false }) private disabled!: boolean;

  @Prop({ default: '' }) private placeholder!: string;

  showAddress: boolean = false;

  address: Address[] = [];

  provinces: Province[] = [];

  cities: City[] = [];

  districts: District[] = [];

  towns: Town[] = [];

  currentProvince: Province | null = null;

  currentCity: City | null = null;

  currentDistrict: District | null = null;

  currentTown: Town | null = null;

  initing: boolean = false;

  levelToSelect: number = 1;

  selectBoxVisible: boolean = false;

  isLogin: boolean = getCookie('token').length > 0;

  get isEmpty() {
    const arr = [this.currentProvince, this.currentCity, this.currentDistrict, this.currentTown];
    for (let index = 0; index < this.level; index++) {
      if (arr[index] !== null) {
        return false;
      }
    }
    return true;
  }

  created() {
    this.getCommonAdds();
    this.getProvinces();
  }

  getCommonAdds() {
    if (!this.isLogin) return false;
    return getCommonAddress().then((res) => {
      this.address = res;
    });
  }

  getProvinces() {
    return getAllProvince().then((data) => {
      this.provinces = data;
    });
  }

  getCities(id: number) {
    return getCityList(id).then((data) => {
      this.cities = data;
    });
  }

  getDistricts(id: number) {
    return getDistrictList(id).then((data) => {
      this.districts = data;
    });
  }

  getTowns(id: number) {
    return getTownList(id).then((data) => {
      this.towns = data;
    });
  }

  @Watch('initData', { immediate: true })
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
    Promise.all(promiseArr).then(() => {
      this.initing = false;
    }).catch(() => {
      this.initing = false;
    });
  }

  change() {
    this.$emit('change', {
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
    });
  }

  selectAddress(item: Address) {
    this.levelToSelect = 1;
    this.cities = [];
    this.districts = [];
    this.towns = [];
    this.currentProvince = {
      provinceId: Number(item.province_id),
      provinceName: item.province,
    };
    this.currentCity = Object.assign({
      cityId: Number(item.city_id),
      cityName: item.city,
    }, this.currentProvince);
    this.currentDistrict = Object.assign({
      districtId: Number(item.district_id),
      districtName: item.district,
    }, this.currentCity);
    this.currentTown = Object.assign({
      townId: Number(item.town_id),
      townName: item.town,
    }, this.currentDistrict);
    this.change();
    this.hide();
  }

  selectProvince(item: Province) {
    this.currentProvince = item;
    this.cities = [];
    this.currentCity = null;
    this.currentDistrict = null;
    this.currentTown = null;
    this.getCities(item.provinceId);
    this.change();
    this.next();
  }

  selectCity(item: City) {
    this.currentCity = item;
    this.districts = [];
    this.currentDistrict = null;
    this.currentTown = null;
    this.getDistricts(item.cityId);
    this.change();
    this.next();
  }

  selectDistrict(item: District) {
    this.currentDistrict = item;
    this.towns = [];
    this.currentTown = null;
    this.getTowns(item.districtId);
    this.change();
    this.next();
  }

  selectTown(item: Town) {
    this.currentTown = item;
    this.change();
    this.next();
  }

  next() {
    this.levelToSelect += 1;
    if (this.levelToSelect > this.level) {
      this.hide();
      this.levelToSelect = 1;
    }
  }

  jumpTo(level: number) {
    if (this.levelToSelect > level) {
      this.levelToSelect = level;
    }
  }

  toggle() {
    if (this.disabled) return;
    this.selectBoxVisible = !this.selectBoxVisible;
  }

  show() {
    this.selectBoxVisible = true;
  }

  hide() {
    this.showAddress = false;
    this.selectBoxVisible = false;
  }
}
</script>

<style scoped>
.area-selector {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: 350px;
  line-height: 26px;
  background: #fff;
}
.area-info {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 40px 0 10px;
  border: 1px solid #eee;
  color: #555;
  cursor: pointer;
}
.area-info.disabled {
  background: #f3f3f3;
  cursor: not-allowed;
}
.area-info:after {
  position: absolute;
  right: 5%;
  top: 50%;
  margin-top: -6px;
  width: 7px;
  height: 7px;
  content: '';
  clear: both;
  display: block;
  border-right: 2px solid #c8c8c8;
  border-bottom: 2px solid #c8c8c8;
  transform: rotate(45deg);
}
.select-block {
  position: absolute;
  z-index: 9;
  width: 518px;
  /* min-height: 297px; */
  border: 1px solid #eee;
  background: #fff;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 3px 14px;
}

.select-title {
  font-size: 13px;
  color: #666;
}
.select-title,
.common-area{
  margin: 10px 20px;
}
.common-area {
  padding: 5px 11px;
  border: 1px solid #E6E6E6;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.tab-item {
  float: left;
  box-sizing: border-box;
  width: 25%;
  height: 45px;
  text-align: center;
  line-height: 45px;
  cursor: pointer;
  background: #fbfbfb;
  border-bottom: 1px solid #eee;
  color: #666;
}
.tab-item:not(:last-child) {
  border-right: 1px solid #eee;
}
.tab-item.active {
  border-bottom: 1px solid #fff;
  background: #fff;
}
.tab-item:hover {
  color: #333;
}

.area-block {
  padding: 18px 20px;
}
.area-item {
  float: left;
  height: 20px;
  line-height: 20px;
  min-width: 70px;
  margin: 5px 3px;
  cursor: pointer;
}
.area-item:hover {
  color: #dd5555;
}
</style>

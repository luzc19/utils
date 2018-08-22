<style scoped>
.area {
    width: 120px;

}
</style>
<template>
<div style="display: inline-block;">
    <el-select v-model="currentProvince" placeholder="请选择省" class="area" value-key="provinceID" :disabled="disabled">
        <el-option
            v-for="(item,index) in provinces"
            :key="item.provinceID"
            :label="item.provinceName"
            :value="item">
        </el-option>
    </el-select>
    <el-select v-model="currentCity" placeholder="市" v-show="level>1" class="area" value-key="cityID" :disabled="disabled">
        <el-option
            v-for="item in cities"
            :key="item.cityID"
            :label="item.cityName"
            :value="item">
        </el-option>
    </el-select>
    <el-select v-model="currentCounty" placeholder="县/区" v-show="level>2" class="area" value-key="countyID" :disabled="disabled">
        <el-option
            v-for="item in counties"
            :key="item.countyID"
            :label="item.countyName"
            :value="item">
        </el-option>
    </el-select>
    <el-select v-model="currentTown" placeholder="镇/乡/街道" v-show="level>3" class="area" value-key="townId" :disabled="disabled">
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
import area from '@/api/area.js'
import _ from 'lodash'

export default {
    props:{
        level: {
            type: Number,
            default: 4
        },
        provinceID:{
            type: Number,
            default: 0,
        },
        cityID:{
            type: Number,
            default: 0,
        },
        countyID:{
            type: Number,
            default: 0,
        },
        townId:{
            type: Number,
            default: 0,
        },
        initData: {
            type: Array,
            default:function (argument) {
                return [];
            }
        },
        disabled:{
            type: Boolean,
            default: false
        }
    },
    components:{

    },
    data(){
        return {
            provinces: [],
            cities: [],
            counties: [],
            towns: [],

            currentProvince:null,
            currentCity: null,
            currentCounty: null,
            currentTown: null,

            initing: false,
        };
    },
    computed:{

    },
    created: function (argument) {

        this.getProvinces();
        this.setCurrent();
    },
    methods:{
        getProvinces(id) {
            return area.getAllProvince().then((res)=>{
                this.provinces = res.data.model||[];
            })
        },
        getCities(id) {
            return area.findCities(id).then((res)=>{
                this.cities = res.data.model||[];
            })
        },
        getCounties(id){
            return area.findCounties(id).then((res)=>{
                this.counties = res.data.model||[];
            })
        },
        getTowns(id) {
            return area.findTowns(id).then((res)=>{
                this.towns = res.data.model||[];
            })
        },
        setCurrent(){
            let promiseArr = [];
            let provinceID = this.initData[0]||0;
            let cityID = this.initData[1]||0;
            let countyID = this.initData[2]||0;
            let townId = this.initData[3]||0;
            this.initing = true;

            if(provinceID>0){
                promiseArr.push(this.getProvinces().then((res)=>{
                    this.currentProvince = this.provinces.find(item=>{
                      return item.provinceID === provinceID;
                    }) || null;
                }));
                promiseArr.push(this.getCities(provinceID).then((res)=>{
                    this.currentCity = this.cities.find(item=>{
                      return item.cityID === cityID;
                    }) || null;
                }));
            }

            if(cityID>0){
                promiseArr.push(this.getCounties(cityID).then((res)=>{
                    this.currentCounty = this.counties.find(item=>{
                      return item.countyID === countyID;
                    }) || null;
                }));
            }
            if(countyID>0){
                promiseArr.push(this.getTowns(countyID).then((res)=>{
                    this.currentTown = this.towns.find(item=>{
                      return item.townId === townId;
                    }) || null;
                }));
            }
            return Promise.all(promiseArr).then((res)=>{
                this.initing = false;
            }).catch(()=>{
                this.initing = false;
            })
        },
        change:_.debounce(function(){
            this.$emit('change',{
                province: this.currentProvince,
                city: this.currentCity,
                county: this.currentCounty,
                town: this.currentTown
            })
        },100)
    },
    watch: {
        currentProvince(val) {
            if(!this.initing){
                val&&this.getCities(val.provinceID);
                this.currentCity = null;
                this.change();
            }

        },
        currentCity(val) {
            if(!this.initing){
                val&&this.getCounties(val.cityID);
                this.currentCounty = null;
                this.change();
            }
        },
        currentCounty(val) {
            if(this.level<4){
                return ;
            }
            if(!this.initing){
                val&&this.getTowns(val.countyID);
                this.currentTown = null;
                this.change();
            }
        },
        currentTown(val) {
            if(!this.initing){
                this.change();
            }
        },
        initData(val){
            this.setCurrent();
        },
    }
}
</script>

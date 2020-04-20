import axios from 'axios';

let cache = {};

function getAllProvince() {
  if (!cache.allProvince) {
    cache.allProvince = axios({
      url: '/common/address/allProvince',
      method: 'get',
    }).then(data => data.model || []);
  }
  return cache.allProvince;
}
function getCityList(provinceId) {
  if (!cache[`cityListOn${provinceId}`]) {
    cache[`cityListOn${provinceId}`] = axios({
      url: '/common/address/cityList',
      method: 'get',
      params: {
        provinceId,
      },
    }).then(data => data.model || []);
  }
  return cache[`cityListOn${provinceId}`];
}
function getDistrictList(cityId) {
  if (!cache[`districtListOn${cityId}`]) {
    cache[`districtListOn${cityId}`] = axios({
      url: '/common/address/districtList',
      method: 'get',
      params: {
        cityId,
      },
    }).then(data => data.model || []);
  }
  return cache[`districtListOn${cityId}`];
}
function getTownList(districtId) {
  if (!cache[`townListOn${districtId}`]) {
    cache[`townListOn${districtId}`] = axios({
      url: '/common/address/townList',
      method: 'get',
      params: {
        districtId,
      },
    }).then(data => data.model || []);
  }
  return cache[`townListOn${districtId}`];
}
// type 支持 Province City District 须大写开头
function getAreasTree(type = 'District') {
  if (!cache[`areasTree${type}`]) {
    cache[`areasTree${type}`] = axios({
      url: '/common/address/multilevelTree',
      method: 'get',
      params: {
        type,
      },
    }).then(data => data.model || []);
  }
  return cache[`areasTree${type}`];
}
export default {
  getAllProvince,
  getCityList,
  getDistrictList,
  getTownList,
  getAreasTree,
};

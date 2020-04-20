import { AxiosResponse } from 'axios';
import { apiInstance } from '@/service/http/apiInstance';
import { ResultDTO } from '@/service/http/ResultDTO';
import { showMessage } from '@/service/message';

export interface Address {
  id: number
  /**
   * 用户ID（oldId）
   */
  user_id: number
  /**
   * 添加日期
   */
  dates: string
  /**
   * 省份ID
   */
  province_id: string
  /**
   * 省份名称
   */
  province: string
  /**
   * 城市ID
   */
  city_id: string
  /**
   * 城市名称
   */
  city: string
  /**
   * 区/县ID
   */
  district_id: string
  /**
   * 区/县名称
   */
  district: string
  /**
   * 乡镇/街道ID
   */
  town_id: string
  /**
   * 乡镇/街道名称
   */
  town: string
  /**
   * 详细地址
   */
  address: string
  /**
   * 公司名称
   */
  company: string
  /**
   * 联系人
   */
  consignee: string
  /**
   * 联系电话
   */
  phone: string
  /**
   * 添加人电话（不使用）
   */
  add_phone: string
  /**
   * 是否默认地址
   */
  is_default: number
}
export interface Province {
  provinceId: number
  provinceName: string
}
export interface City {
  provinceId: number
  provinceName: string
  cityId: number
  cityName: string
}
export interface District {
  provinceId: number
  provinceName: string
  cityId: number
  cityName: string
  districtId: number
  districtName: string
}
export interface Town {
  provinceId: number
  provinceName: string
  cityId: number
  cityName: string
  districtId: number
  districtName: string
  townId: number
  townName: string
}

function successHandler(response: AxiosResponse<ResultDTO>) {
  if (response.data.success || response.data.code === 0) {
    return response.data.model || response.data.data;
  }
  showMessage(response.data.message);
  return Promise.reject(new Error(response.data.message));
}
function errorHandler(error: Error) {
  showMessage('服务器或者网络错误');
  return Promise.reject(error);
}

export function getCommonAddress(): Promise<Address[]> {
  return apiInstance.get('/Address/List').then(successHandler, errorHandler);
}

export function getAllProvince(): Promise<Province[]> {
  return apiInstance.get('/AreaPort/acquirePort', {
    params: {
      request_port: 'allProvince',
    },
  }).then(successHandler, errorHandler);
}

export function getCityList(provinceId: number): Promise<City[]> {
  return apiInstance.get('/AreaPort/acquirePort', {
    params: {
      request_port: 'cityList',
      provinceId,
    },
  }).then(successHandler, errorHandler);
}
export function getDistrictList(cityId: number): Promise<District[]> {
  return apiInstance.get('/AreaPort/acquirePort', {
    params: {
      request_port: 'districtList',
      cityId,
    },
  }).then(successHandler, errorHandler);
}
export function getTownList(districtId: number): Promise<Town[]> {
  return apiInstance.get('/AreaPort/acquirePort', {
    params: {
      request_port: 'townList',
      districtId,
    },
  }).then(successHandler, errorHandler);
}

export default {
  getCommonAddress,
  getAllProvince,
  getCityList,
  getDistrictList,
  getTownList,
};

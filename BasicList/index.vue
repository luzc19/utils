<template>
<div>
  <slot name="top"></slot>
  <div class="status-container" v-if="statusKey">
    <ul class="clearfix">
      <li class="status-item" v-for="item in statusItem.options" :key="item.value" :class="{active: queryParams[statusKey]===item.value}" @click="toggleStatus(item.value)">{{item.label}}</li>
    </ul>
  </div>
  <div :class="{'tab-frame': independent}">
    <div :class="{'tab-main': independent}">
      <form class="clearfix" @submit.prevent="query" v-if="queryItems.length">
        <template v-for="(queryItem, index) in activeQueryItems">
          <div class="query-item" :key="index" v-if="checkShowByStatus(queryItem)">
            <el-select class="query-name" v-model="activeQueryItems[index]" @visible-change="handleItemChange(arguments[0], queryItem)" value-key="name" :disabled="availableQueryItems.length<=3">
              <el-option v-for="item in pickOptions(queryItem)" :key="item.name" :value="item" :label="item.name"></el-option>
            </el-select>
            <el-input v-if="queryItem.type==='input'" class="query-input" v-model.trim="queryParams[queryItem.valueKey]" :placeholder="queryItem.placeholder" clearable></el-input>
            <el-select v-if="queryItem.type==='select'" class="query-input" v-model="queryParams[queryItem.valueKey]">
              <el-option v-for="item in queryItem.options" :value="item.value" :label="item.label" :key="item.label"></el-option>
            </el-select>
            <filter-date class="query-input" v-if="queryItem.type === 'date'" :queryParams="queryParams" :valueKey="queryItem.valueKey" :limitDays="queryItem.limitDays"></filter-date>
            <filter-area class="query-input" v-if="queryItem.type === 'area'" :queryParams="queryParams" :valueKey="queryItem.valueKey"></filter-area>
            <filter-org class="query-input" v-if="queryItem.type === 'org'" :queryParams="queryParams" :valueKey="queryItem.valueKey" :isAllTree="queryItem.isAllTree" :orgTypes="queryItem.orgTypes" :placeholder="queryItem.placeholder"></filter-org>
            <filter-org-sorting class="query-input" v-if="queryItem.type === 'orgSorting'" :queryParams="queryParams" :valueKey="queryItem.valueKey" :activeOnly="queryItem.activeOnly"></filter-org-sorting>
            <filter-autocomplete class="query-input" v-if="queryItem.type === 'autocomplete'" :queryParams="queryParams" :valueKey="queryItem.valueKey" :dataList="queryItem.dataList" :placeholder="queryItem.placeholder" :triggerOnfocus="queryItem.triggerOnfocus"></filter-autocomplete>
            <filter-supplier class="query-input" v-if="queryItem.type === 'supplier'" :queryParams="queryParams" :valueKey="queryItem.valueKey" ></filter-supplier>
            <filter-supplierId class="query-input" v-if="queryItem.type === 'supplierId'" :queryParams="queryParams" :valueKey="queryItem.valueKey" ></filter-supplierId>
            <filter-backend-category class="query-input" v-if="queryItem.type === 'backendCategory'" :queryParams="queryParams" :valueKey="queryItem.valueKey" ></filter-backend-category>
            <filter-enum class="query-input" v-if="queryItem.type === 'enum'" :queryParams="queryParams" :valueKey="queryItem.valueKey" :enumCode="queryItem.enumCode"></filter-enum>
          </div>
        </template>
        <div class="query-item fr">
          <div style="display:flex; justify-content: flex-end;margin-right: 5%;">
            <el-button type="primary" plain @click="addQueryItem" v-if="this.activeQueryItems.length < this.availableQueryItems.length">添加条件</el-button>
            <el-button native-type="submit" type="primary" class="op-button">查询</el-button>
            <template v-if="exportUrl">
              <!-- 没有限制权限则默认展示 -->
              <el-button v-if="exportPermission" type="primary" style="width: 150px;" @click="exportData" :disabled="!exportable" v-permission="exportPermission">导出</el-button>
              <el-button v-else type="primary" style="width: 150px;" @click="exportData" :disabled="!exportable">导出</el-button>
            </template>
            <template v-if="emailExportUrl">
              <el-button v-if="emailExportPermission" type="primary" style="width: 150px;" @click="showExportDialog" :disabled="!exportable" v-permission="emailExportPermission">邮件导出</el-button>
              <el-button v-else type="primary" style="width: 150px;" @click="showExportDialog" :disabled="!exportable">邮件导出</el-button>
            </template>
            <slot name="other"></slot>
          </div>
        </div>
      </form>
      <div style="margin-top: 20px;min-height: 300px;" v-loading="loading">
        <slot name="summary" :status="queryParams[statusKey]" :queryParams="queryParams" :queryedParams="queryedParams"></slot>
        <slot name="table" :status="queryParams[statusKey]" :listData="listData" :queryParams="queryParams" :queryedParams="queryedParams" :loading="loading"></slot>
      </div>
      <div class="text-right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="gotoPage"
          :current-page="queryParams.pageIndex"
          :page-sizes="[15, 20, 25, 30, 100]"
          :page-size="queryParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </div>
  </div>
  <emailExportDialog v-if="emailExportDialogVisible"
    :visible.sync="emailExportDialogVisible"
    :emailExportUrl="emailExportUrl"
    :queryParams="queryParamsWithoutEmpty"></emailExportDialog>
</div>
</template>

<script>
import { pickBy, isEqual } from 'lodash';
import message from '@/components/topMessage';
import toParamsStr from '@/components/toParamsStr';
import filterDate from './filter-date.vue';
import filterArea from './filter-area.vue';
import filterOrg from './filter-org.vue';
import filterOrgSorting from './filter-orgSorting.vue';
import filterAutocomplete from './filter-autocomplete.vue';
import filterSupplier from './filter-supplier.vue';
import filterSupplierId from './filter-supplierId.vue';
import filterBackendCategory from './filter-backendCategory.vue';
import filterEnum from './filter-enum.vue';
import emailExportDialog from './emailExportDialog.vue';

export default {
  name: 'BasicList',
  mixins: [],
  props: {
    independent: {
      type: Boolean,
      default: true,
    },
    dataUrl: {
      type: String,
      required: true,
    },
    exportUrl: {
      type: String,
    },
    emailExportUrl: {
      type: String,
    },
    exportPermission: {
      type: String,
    },
    emailExportPermission: {
      type: String,
    },
    freeExport: {
      type: Boolean,
      default: true,
    },
    listName: {
      validator: function (value) {
        return typeof value === 'string' && value.length > 1;
      },
    },
    queryItems: {
      // 支持类型 input select status date area org supplier
      type: Array,
      required: true,
    },
    keepByUrl: {
      // 是否把筛选参数记录在URL上，这样刷新后依然保留筛选参数
      type: Boolean,
      default: false,
    },
    keepByCache: {
      // 是否把筛选参数记录在sessionStorage，这样路由切换回来会依然保留参数
      type: Boolean,
      default: true,
    },
    method: {
      type: String,
      default: 'get',
    },
    defaultQuery: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: {
    filterDate,
    filterArea,
    filterOrg,
    filterOrgSorting,
    filterSupplier,
    filterSupplierId,
    filterAutocomplete,
    filterBackendCategory,
    filterEnum,
    emailExportDialog,
  },
  data() {
    let queryParams = {
      pageIndex: 1,
      pageSize: 15,
    };
    Object.assign(queryParams, this.defaultQuery);
    this.queryItems.forEach((item) => {
      Object.assign(queryParams, this.convert(item));
    });

    let statusItem = this.queryItems.find(item => item.type === 'status');
    let statusKey = null;
    if (statusItem) {
      statusKey = statusItem.valueKey;
    }

    // date 类型的参数可能有多个，这里只取第一个
    let dateItem = this.queryItems.find(item => item.type === 'date');
    let dateKey = null;
    if (dateItem) {
      dateKey = dateItem.valueKey;
    }
    
    let cacheQueryParams = sessionStorage.getItem(this.listName + 'Params');
    if (this.keepByCache && cacheQueryParams) {
      try {
        Object.assign(queryParams, JSON.parse(cacheQueryParams));
        sessionStorage.removeItem(this.listName + 'Params');
      } catch (error) {
        console.warn(error);
      }
    }

    const { query } = this.$route;
    if (this.keepByUrl) {
      Object.keys(queryParams).forEach((key) => {
        if (query[key]) {
          queryParams[key] = Number.isNaN(Number(query[key])) ? query[key] : Number(query[key]);
        }
      });
    }

    return {
      statusKey,
      statusItem,
      dateKey,
      dateItem,
      queryParams,
      queryedParams: {},
      totalCount: null,
      listData: [],
      loading: false,
      currentTime: +new Date(),
      paramsMatchResult: false,
      activeQueryItems: [],
      emailExportDialogVisible: false,
    };
  },
  computed: {
    queryItemsWithoutStatus() {
      return this.queryItems.filter(item => item.type !== 'status');
    },
    availableQueryItems() {
      return this.queryItemsWithoutStatus.filter(item => this.checkShowByStatus(item));
    },
    queryParamsWithoutEmpty() {
      return pickBy(this.queryParams, val => val !== '' && val != null);
    },
    exportable() {
      // 导出前需要先查询确认
      return this.totalCount > 0 && this.paramsMatchResult;
    },
  },
  watch: {
    queryParams: {
      handler() {
        this.paramsMatchResult = false;
      },
      deep: true,
    },
  },
  created() {
    this.gotoPage(this.queryParams.pageIndex);
    this.setActiveQueryItems();
  },
  beforeDestroy() {
    if (this.keepByCache) {
      sessionStorage.setItem(this.listName + 'Params', JSON.stringify(this.queryParams));
      sessionStorage.setItem(this.listName + 'ActiveQueryItems', JSON.stringify(this.activeQueryItems));
    }
  },
  methods: {
    setActiveQueryItems() {
      const cacheActiveQueryItems = JSON.parse(sessionStorage.getItem(this.listName + 'ActiveQueryItems') || '[]');
      if (cacheActiveQueryItems.length) {
        this.activeQueryItems = this.queryItemsWithoutStatus.filter(item => cacheActiveQueryItems.findIndex(cacheItem => isEqual(item.valueKey, cacheItem.valueKey)) > -1);
      } else {
        // 默认显示前3项和有值的项
        this.activeQueryItems = this.availableQueryItems.filter((item, index) => index < 3 || (item.defaultValue !== null && item.defaultValue !== undefined));
      }
    },
    convert(item) {
      let queryParams = {};
      if (Array.isArray(item.valueKey)) {
        item.valueKey.forEach((key, index) => {
          queryParams[key] = item.defaultValue && item.defaultValue[index] !== undefined ? item.defaultValue[index] : null;
        });
      } else {
        queryParams[item.valueKey] = item.defaultValue !== undefined ? item.defaultValue : null;
      }
      return queryParams;
    },
    pickOptions(currentItem) {
      return this.queryItemsWithoutStatus.filter((item) => {
        let isActive = this.activeQueryItems.findIndex(activeItem => activeItem.name === item.name) >= 0;
        // 留下可选的 且 还没激活的或者是自身的
        return this.checkShowByStatus(item) && (!isActive || item.name === currentItem.name);
      });
    },
    toggleStatus(status) {
      if (this.loading) return;
      this.queryParams[this.statusKey] = status;
      this.queryItems.filter(item => item.showByStatus !== undefined).forEach((queryItem) => {
        Object.assign(this.queryParams, this.convert(queryItem));
      });
      this.query();
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.query();
    },
    gotoPage(index) {
      this.queryParams.pageIndex = index;
      if (this.keepByUrl) {
        this.$router.replace(`?${toParamsStr(this.queryParamsWithoutEmpty)}&_=${+new Date()}`);
      }
      this.getListData();
    },
    query() {
      this.gotoPage(1);
    },
    getListData() {
      if (this.loading) return;
      this.loading = true;
      this.$axios({
        url: this.dataUrl,
        method: this.method,
        params: this.method.toLocaleLowerCase() === 'get' ? this.queryParamsWithoutEmpty : {},
        data: this.method.toLocaleLowerCase() === 'post' ? this.queryParamsWithoutEmpty : {},
        errorTips: true,
      }).then((data) => {
        this.loading = false;
        this.paramsMatchResult = true;
        Object.assign(this.queryedParams, this.queryParams);
        this.$emit('query', this.queryParamsWithoutEmpty);
        this.totalCount = 0;
        this.listData = [];
        if (data.success && data.model) {
          this.totalCount = data.model.totalCount;
          this.listData = data.model.list || [];
        }
      }).catch(() => {
        this.loading = false;
        this.paramsMatchResult = true;
        Object.assign(this.queryedParams, this.queryParams);
        this.totalCount = 0;
        this.listData = [];
      });
    },
    checkShowByStatus(queryItem) {
      if (!this.statusKey) return true;
      return queryItem.showByStatus === undefined 
            || queryItem.showByStatus === this.queryParams[this.statusKey]
            || (Array.isArray(queryItem.showByStatus) && queryItem.showByStatus.includes(this.queryParams[this.statusKey]));
    },
    handleItemChange(visible, queryItem) {
      if (visible && queryItem && queryItem.valueKey) {
        Object.assign(this.queryParams, this.convert(queryItem));
      }
    },
    addQueryItem() {
      if (this.activeQueryItems.length >= this.queryItemsWithoutStatus.length) return;
      this.activeQueryItems.push({
        name: '',
        type: 'input',
        valueKey: '',
        defaultValue: null,
      });
    },
    exportData() {
      const MAX_SIZE = 10000;
      if (this.totalCount > MAX_SIZE) {
        message({
          type: 'warning',
          message: '当前数据量已超出导出范围，请选择1万以内的数据量',
        });
        return;
      }
      // 导出限制
      // 如果列表有时间范围选项，则要求必选时间范围，避免一次查询太多内容导致数据库压力太大
      // 如果没有时间范围选项，则认为导出接口支持全量的导出
      if (!this.freeExport) {
        const MAX_DAYS_TIME = 90 * 24 * 3600 * 1000;
        const isDateValid = this.queryItems.filter(item => item.type === 'date').map((item) => {
          let keys = item.valueKey || ['startDate', 'endDate'];
          return keys.map(key => +new Date(this.queryParams[key] || ''));
        }).find(dateValues => dateValues[1] - dateValues[0] < MAX_DAYS_TIME);
        if (!isDateValid) {
          message({
            type: 'warning',
            message: '只能导出90天以内的数据',
          });
          return;
        }
      }
      let completeExportUrl = this.toCompleteUrl(this.exportUrl, this.queryParamsWithoutEmpty);
      window.open(completeExportUrl);
    },
    toCompleteUrl(url = '', params) {
      let resultUrl = url;
      // 开头
      if (resultUrl.indexOf('/') === 0) {
        resultUrl = '/api' + resultUrl;
      } else if (resultUrl.indexOf('http') !== 0) {
        resultUrl = '/api/' + resultUrl;
      }
      // 结尾
      if (resultUrl.indexOf('?') === -1) {
        resultUrl += '?';
      } else {
        resultUrl += '&';
      }
      return resultUrl + toParamsStr(params);
    },
    showExportDialog() {
      this.emailExportDialogVisible = true;
    },
  },
};
</script>

<style>
.query-name .el-input.is-disabled .el-input__inner {
  background: #fff;
}
.query-name .el-input.is-disabled .el-input__suffix {
  display: none;
}
.query-name .el-input input {
  text-overflow: ellipsis;
}
</style>
<style scoped>
.status-container {
  position: sticky;
  top: 0;
  background: #fafafa;
  z-index: 9;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 0 10px #ddd;
  padding: 0 25px;
}
.status-item {
  display: inline-block;
  cursor: pointer;
  width: 80px;
  padding: 8px;
  text-align: center;
  border-bottom: 2px solid transparent;
}
.status-item.active {
  color: #06f;
  border-color: #06f;
  background: #F0F6FC;
}
.query-item {
  width: 33.33%;
  margin-bottom: 8px;
  display: inline-block;
}
.query-name {
  float: left;
  width: 25%;
  line-height: 32px;
  text-align: right;
}
.query-input {
  width: 70%;
}
.op-button {
  width: 150px;
}
</style>

<template>
<BasicList :dataUrl="dataUrl" :listName="PAGENAME" :queryItems="queryItems" >
  <table class="table cty-table" slot="table" slot-scope="{ status, listData, loading, queryParams, queryedParams }">
    <thead>
      <tr>
        <th>订单编号</th>
        <th>客户名称</th>
        <th>客户地区</th>
        <th>所属组织</th>
        <th>创建时间</th>
        <th>订单金额</th>
        <th>支付时间</th>
        <th>支付方式</th>
        <th>订单状态</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td colspan="10">
          status的值等于传入的queryItems中type=status的值，可用于根据status显示隐藏不同的列
        </td>
      </tr>
      <tr>
        <td colspan="10">
          {{queryParams}}
          <br>
          queryParams列表查询用到的所有参数
        </td>
      </tr>
      <tr>
        <td colspan="10">{{queryedParams}}</td>
      </tr>
      <tr>
        <td colspan="10">{{loading}}
          <br>
          loading在查询请求发出后为true，数据返回后设为false
        </td>
      </tr>
      <tr v-for="(item) in listData" :key="item.orderId">
        <td>{{item.orderNo}}</td>
        <td>{{item.orderUserName}}</td>
        <td>{{item.bizProvinceName}} {{item.bizCityName}} {{item.bizDistrictName}}</td>
        <td>{{item.bizOrgName}}</td>
        <td>{{item.orderTime | formatTime}}</td>
        <td>{{item.totalPrice | formatBigNum}}</td>
        <td>{{item.payTime | formatTime}}</td>
        <td>{{item.payType}}</td>
        <td>
          {{item.orderStatus}}
        </td>
        <td>
          {{status}}
          <router-link :to="'/Order/Detail?orderId='+item.orderId">
            查看
          </router-link>
        </td>
      </tr>
      <tr v-if="listData.length===0&&!loading">
        <td colspan="19" class="text-center">暂无数据</td>
      </tr>
    </tbody>
  </table>
</BasicList>
</template>

<script>
import BasicList from '@/components/BasicList/index.vue';
// 以订单列表为例实现
// PAGENAME 要区别于其他列表，唯一
const PAGENAME = 'orderList'; // 必填，字符数必须大于1

export default {
  mixins: [],
  components: {
    BasicList,
  },
  data() {
    return {
      PAGENAME,
      currentTime: +new Date(),
      dataUrl: '/trade/order/page',
      // queryItem 支持类型 status input select date area org
      // type 必填
      // valueKey 必填 筛选请求的参数key

      // defaultValue 默认为null 筛选请求的参数默认值，为 null 或 '' 时不发送这个参数
      // valueKey 和 defaultValue的数据类型必须一致，会一一对应设置默认值，详见以下例子
      // name 当type不是status时，必填。type是status时忽略name
      // showByStatus 根据status类型的queryItem的选项值进行显示隐藏切换，status类型不可用此参数
      // options 每个选项的value不能设置为undefined

      // 各类型详解
      // status  显示在顶部 使用tab切换 其他类型使用表单控件 此时options必填，只能有一个status类型
      // input   普通输入框显示
      // select  普通下拉框显示 此时options必填
      // date    要求valueKey 必须为数组且有2个值，表示开始结束时间的key。如果有defaultValue，必须为数组且有2个值
      // area    要求valueKey 必须为数组且有3个值，表示省市县的id的key。如果有defaultValue，必须为数组且有3个值
      // org     普通下拉框显示，提供组织筛选。可选额外参数activeOnly 表示是否只能选择当前选中组织
      // orgSorting  两个下拉框显示，提供组织与分拣中心联动筛选。可选额外参数activeOnly 表示是否只能选择当前选中组织
      // supplier 供应商autocomplete功能，得到供应商名称
      // supplierId 供应商autocomplete功能，得到供应商Id
      // autocomplete 承运商autocomplete功能，得到承运商名称和承运商Id 或 承运商名称
      // backendCategory 级联选择器，选择一个后端品类
      queryItems: [
        {
          type: 'status', 
          name: '状态',
          valueKey: 'testStatus',
          defaultValue: '10,11',
          options: [
            { value: '10,11', label: '未处理' },
            { value: null, label: '全部' },
          ],
        },
        {
          name: '订单选项',
          type: 'select',
          valueKey: 'orderSsssss',
          options: [
            { value: 1, label: '全部' },
            { value: 2, label: '待确认' },            
          ],
        },
        {
          name: '订单编号2',
          type: 'input',
          valueKey: 'orderNo2',
        },
        {
          name: '订单状态',
          type: 'select',
          valueKey: 'orderStatus',
          defaultValue: 10,
          options: [
            { value: null, label: '全部' },
            { value: 10, label: '待确认' },
          ],
        },
        {
          name: '下单时间',
          type: 'date', // date类型要求valueKey 必须为数组且有2个值，表示开始结束时间的key
          valueKey: ['beginOrderTime', 'endOrderTime'],
          // defaultValue: [], 默认值也必须为2个值，对应valueKey，每个值的格式为 2019-01-09 17:56:11
          limitDays: 90, // 限制开始和结束时间的最大范围，不设置则不限制
        },

        {
          name: '地区',
          type: 'area', // area类型要求valueKey必须为数组且有3个值，表示省市县的 id 的key
          valueKey: ['bizProvinceId', 'bizCityId', 'bizDistrictId'],
          // defaultValue: [1,2,3] 对应查询参数会设置为 bizProvinceId:1, bizCityId:2, bizDistrictId:3
        },
        {
          name: '所属组织',
          type: 'org',
          valueKey: 'lookUpOrgId', // 统一默认是lookUpOrgId，不用传
          isAllTree: false, // 是否获取全部组织树，默认是false，可不传。 false: 根据当前登陆人获取组织树， true获取全部
          orgTypes: [1, 3], // 获取的组织类型 默认是 [1,3], 1-中心单元 2-部门单元 3-作业单元
        },
        {
          name: '分拣中心',
          type: 'orgSorting', 
          valueKey: ['bizOrgId', 'sortingCenterId'], // 数组或字符串。 数组：组织key和分拣中心key。 字符串：分拣中心key
        },
        {
          name: '审核人',
          type: 'input',
          valueKey: 'auditer',
          showByStatus: 1, // 可以根据 status 的值显示隐藏当前筛选项 值必须全等于 status 选项中的某个值，可以是数组表示多个状态下都显示
        },
        {
          name: '锁单人',
          type: 'input',
          valueKey: 'locker',
          showByStatus: '10,11',
        },
        {
          name: '承运商',
          type: 'autocomplete', 
          valueKey: 'carrierName', // 数组或字符串。 数组：承运商名称key和承运商名称IDkey。 字符串：承运商名称key
          dataList: [], // 传给组件的承运商的数据列表,拿到数据后通过push添加进去
          placeholder: '请输入内容',
        },
        {
          name: '所属品类',
          type: 'backendCategory', 
          valueKey: 'searchCategoryPath',
        },
      ],
    };
  },
  methods: {

  },
};
</script>

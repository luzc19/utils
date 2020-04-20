// 转化为 xx=yy&aa=bb 形式
function toParamsStr(params) {
  let paramsStr = '';
  Object.keys(params).forEach((key) => {
    paramsStr += `&${key}=${params[key]}`;
  });
  paramsStr = paramsStr.slice(1);
  return paramsStr;
}

export default toParamsStr;

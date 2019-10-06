// 转化为 xx=yy&aa=bb 形式
function toParamsStr(params){
    let paramsStr = '';
    for(let key in params){
        paramsStr += '&' + key + '=' + params[key];
    }
    paramsStr = paramsStr.slice(1);
    return paramsStr
}

export default toParamsStr;

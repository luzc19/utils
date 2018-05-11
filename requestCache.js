// 缓存请求，以便减少重复的请求
// 参数name 定义描述返回的数据
// 参数request 必须为函数且返回一个promise对象
function requestCache(name, request) {
    let promiseInstance = null;
    let info = sessionStorage.getItem(name)

    return function () {
        if(promiseInstance){
            return promiseInstance;
        }
        else if(info !== null){
            return promiseInstance = Promise.resolve(JSON.parse(info));
        }
        else{
            return promiseInstance = request().then((data)=>{
                sessionStorage.setItem(name,JSON.stringify(data));
                return data;
            }).catch((error)=>{
                promiseInstance = null; //释放cache，重新请求信息
                return Promise.reject(error)
            })
        }
    }
}

export default requestCache;

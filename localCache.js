/**
 * 简单的封装localStorage的使用
 * 默认针对数组进行操作
 */
let localCache = {
    set:function (key, value) {
        localStorage.setItem(key,JSON.stringify(value));
    },
    push:function (key, value) {
        let arr = this.get(key);
        arr.push(value);
        this.set(key, arr);
    },
    unshift: function (key,value) {
        let arr = this.get(key);
        arr.unshift(value);
        this.set(key, arr);
    },
    get:function (key) {
        let str = localStorage.getItem(key);
        return str?JSON.parse(str):[];
    },
    remove:function (key) {
        localStorage.removeItem(key);
    }
}

export default localCache

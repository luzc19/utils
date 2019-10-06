var getUrlArg = function (name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    return r != null? decodeURI(r[2]):null;
};

export default getUrlArg;

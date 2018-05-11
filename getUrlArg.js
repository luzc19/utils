var getUrlArg = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    return r != null? decodeURI(r[2]):null;
};

export default getUrlArg;

function press(dataURL, quality, limitWidth) {
    // 判断是否jpg 图，如果不是则忽略参数不压缩返回
    if(dataURL.slice(0,20).indexOf('jpeg') == -1){
        return Promise.resolve(dataURL);
    }
    return new Promise(function (resolve,reject) {
        let img = new Image();
        img.onload = function(event){
            let sWidth = this.width;
            let sHeight = this.height;
            let scale = sWidth/sHeight;


            let dWidth = sWidth;
            let dHeight = sHeight;
            if(limitWidth && dWidth>limitWidth){
                dWidth = limitWidth;
                dHeight = dWidth/scale;
            }

            let canvas = document.createElement('canvas');
            canvas.width = dWidth;
            canvas.height = dHeight;
            let ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0,0, sWidth,sHeight,0,0,dWidth,dHeight);

            resolve(canvas.toDataURL('image/jpeg',quality||1));
            canvas = null;
            ctx = null;
        }
        img.onerror = function (argument) {
            reject('图片解析失败')
        }
        img.src = dataURL;
    })
}
export default press;

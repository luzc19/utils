/**
 * 仿照moment的接口，简单实现 formatDate
 * 
 */
let moment = function (dateStamp) {
  let leftPad = function (num) {
    if(num<10){
      return '0'+num
    }else{
      return ''+num;
    }
  }
  let date = new Date(dateStamp);

  return {
    format: function (pattern) {
      let str = typeof pattern==='string'?pattern:'yyyy-MM-dd';
      if(!isNaN(date.getTime())){
        return str.replace(/yyyy/i, leftPad(date.getFullYear()))
                   .replace(/MM/, leftPad(date.getMonth()+1))
                   .replace(/dd/i, leftPad(date.getDate()))
                   .replace(/hh/i, leftPad(date.getHours()))
                   .replace('mm', leftPad(date.getMinutes()))
                   .replace(/ss/i, leftPad(date.getSeconds()))
      }else{
        return '';
      }
    }
  }
}

export default moment;

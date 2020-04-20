/**
 * 仿照moment的接口，简单实现 formatDate
 *
 */
const moment = function (dateStamp) {
  const leftPad = function (num) {
    return num < 10 ? `0${num}` : `${num}`;
  };
  const date = new Date(dateStamp);

  return {
    format(pattern) {
      const str = typeof pattern === 'string' ? pattern : 'yyyy-MM-dd';
      if (!Number.isNaN(date.getTime())) {
        return str.replace(/yyyy/i, leftPad(date.getFullYear()))
          .replace(/MM/, leftPad(date.getMonth() + 1))
          .replace(/dd/i, leftPad(date.getDate()))
          .replace(/hh/i, leftPad(date.getHours()))
          .replace('mm', leftPad(date.getMinutes()))
          .replace(/ss/i, leftPad(date.getSeconds()));
      }
      return '';
    },
  };
};

export default moment;

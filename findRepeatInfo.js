/** *
 * 查找数组中重复的项
 * @param {array} arr 需要查重的数组
 * @param {function} getKey 会传入数组元素作为参数，须返回唯一值以校验是否重复
 * 
 * 返回重复的项组成的数组
 * 每一个重复项会封装出如下信息
 * prevIndex 第一个出现的索引
 * currIndex 当前重复项的索引
 * data 当前项
 */

function findRepeatInfo(arr, getKey) {
  let result = [];
  let cache = {};

  arr.forEach((item, index) => {
    let key = getKey(item);
    if (cache[key]) {
      result.push({
        prevIndex: cache[key].currIndex,
        currIndex: index,
        data: item,
      });
    } else {
      cache[key] = {
        prevIndex: null,
        currIndex: index,
        data: item,
      };
    }
  });
  return result;
}

export default findRepeatInfo;

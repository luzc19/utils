// 获取所有末端叶子节点，深度优先遍历
export default function getChildren(arr, key) {
  let result = [];
  arr.forEach((item) => {
    if (item[key] && item[key].length) {
      result = result.concat(getChildren(item[key]));
    } else {
      result.push(item)
    }
  });
  return result;
}

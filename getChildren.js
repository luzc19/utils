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
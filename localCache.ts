/**
 * 简单的封装localStorage的使用
 */
export function set(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}
export function get(key: string) {
  const str: string | null = localStorage.getItem(key);
  return str ? JSON.parse(str) : null;
}
export function remove(key: string) {
  localStorage.removeItem(key);
}

export const setCache = set;
export const getCache = get;
export const removeCache = remove;

export default {
  set,
  get,
  remove,
};

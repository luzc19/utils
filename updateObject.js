import { keys, pick } from 'lodash';

function updateObject(target, source) {
  if (typeof target == 'object' && typeof source == 'object' && source != null && target != null) {
    let keyArr = keys(target);
    let dataSource = pick(source, keyArr);
    return Object.assign(target, dataSource);
  }
  return target;
}

export default updateObject;

function updateObject(target, source) {
    if(typeof target == 'object' && typeof source == 'object' && source != null && target != null){
        for(let key in target){
            if(source[key]!==undefined){
                target[key] = source[key]
            }
        }
    }
    return target;
}
export default updateObject
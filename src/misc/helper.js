export function getName(name){
    const list = name.toUpperCase().split(' ');
    if(list.length>1){
        return list[0][0]+list[1][0];
    }
    return list[0][0];
    
}
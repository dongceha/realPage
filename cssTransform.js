function cssTransform(el, type, val) {
  if (!el.transform) {
    el.transform = {}
  }
  // 参数的长度 > 2 即为赋值
  if (arguments.length == 3) {
    el.transform[type] = val;
    var css = '';
    for (key in el.transform) {
      switch (key) {
        case 'translateX':
        case 'translateY':
          css += key + '(' + el.transform[key] + 'px)'
          break;
        case 'scaleX':
        case 'scaleY':
          css += key + '(' + el.transform[key] + ')'
          break;
        case 'rotate':
          css += key + '(' + el.transform[key] + 'deg)'
          break;
        default:
          break;
      }
    }
    el.style.transform = css;
  } else {
    var val = el.transform[type];
    if (val == undefined) {
      switch (type) {
        case 'scaleX':
        case 'scaleY':
        case 'scale':
          val = 1
          break;
        default:
          val = 0
          break;
      }
    }
    return val;
  }
}
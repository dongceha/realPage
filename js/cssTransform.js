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
        case "translateZ":
          css += key + '(' + el.transform[key] + 'px)'
          break;
        case 'scaleX':
        case 'scaleY':
        case "scale":
          css += key + '(' + el.transform[key] + ')'
          break;
        case "rotate":
        case "rotateX":
        case "rotateY":
        case "rotateZ":
        case "skewX":
        case "skewY":
          css += key + '(' + el.transform[key] + 'deg)'
          break;
        default:
          break;
      }
    }
    el.style.WebkitTransform = el.style.transform = css;
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

function dcScroll(wrap, callBack) {
  var child = wrap.children[0];
  var startPoint = 0;
  var startY = 0;
  var minY = wrap.clientHeight - child.offsetHeight;
  var step = 1;
  var lastY = 0;
  var lastTime = 0;
  var lastDis = 0;
  var lastTimeDis = 1;
  var isMove = true;
  var isFirst = true;
  var Tween = {
    easeOut: function (t, b, c, d) {
      return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    backOut: function (t, b, c, d, s) {
      if (typeof s == 'undefined') {
        s = 1.70158;
      }
      return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    }
  };
  cssTransform(child, "translateZ", 0.01);
  wrap.addEventListener(
    'touchstart',
    function (e) {
      minY = wrap.clientHeight - child.offsetHeight;
      console.log(minY);
      console.log(wrap.clientHeight);
      console.log(child.offsetHeight)
      clearInterval(child.scroll);
      if (callBack && callBack.start) {
        callBack.start();
      }
      startPoint = {
        pageY: e.changedTouches[0].pageY,
        pageX: e.changedTouches[0].pageX
      };
      startY = cssTransform(child, "translateY");
      step = 1;
      lastY = startPoint.pageY;
      lastTime = new Date().getTime();
      lastDis = 0;
      lastTimeDis = 1;
      isMove = true;
      isFirst = true;
    }
  );
  wrap.addEventListener(
    'touchmove',
    function (e) {
      if (!isMove) {
        return;
      }
      var nowPoint = e.changedTouches[0];
      var disX = nowPoint.pageX - startPoint.pageX;
      var disY = nowPoint.pageY - startPoint.pageY;
      if (isFirst) {
        isFirst = false;
        if (Math.abs(disY) < Math.abs(disX)) {
          isMove = false;
          return;
        }
      }
      var t = startY + disY;
      var nowTime = new Date().getTime();
      if (t > 0) {
        step = 1 - t / wrap.clientHeight;
        t = parseInt(t * step);
      }
      if (t < minY) {
        var over = minY - t;
        step = 1 - over / wrap.clientHeight;
        over = parseInt(over * step);
        t = minY - over;
      }
      lastDis = nowPoint.pageY - lastY;
      lastTimeDis = nowTime - lastTime;
      lastY = nowPoint.pageY;
      lastTime = nowTime;
      cssTransform(child, "translateY", t);
      if (callBack && callBack.in) {
        callBack.in();
      }
    }
  );
  wrap.addEventListener(
    'touchend',
    function () {
      var speed = (lastDis / lastTimeDis) * 120;
      speed = isNaN(speed) ? 0 : speed;
      var t = cssTransform(child, "translateY");
      var target = t + speed;
      var type = "easeOut";
      var time = Math.abs(speed * .9);
      time = time < 300 ? 300 : time;
      if (target > 0) {
        target = 0;
        type = "backOut";
      }
      if (target < minY) {
        target = minY;
        type = "backOut";
      }
      move(target, time, type);
      if (callBack && callBack.end) {
        callBack.end();
      }
    }
  );
  /*
  	start 手指按下
  	in 滑动中
  	end 手指抬起
  	over 滑动结束
  */
  function move(target, time, type) {
    var t = 0;
    var b = cssTransform(child, "translateY");
    var c = target - b;
    var d = Math.ceil(time / 20);
    clearInterval(child.scroll);
    child.scroll = setInterval(
      function () {
        t++;
        if (t > d) {
          clearInterval(child.scroll);
          if (callBack && callBack.over) {
            callBack.over();
          }
        } else {
          var top = Tween[type](t, b, c, d);
          cssTransform(child, "translateY", top);
          if (callBack && callBack.in) {
            callBack.in();
          }
        }
      }, 20
    );
  }
}
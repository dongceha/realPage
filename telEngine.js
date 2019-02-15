var xxTpl = `<tr data-magid="<%msgId%>">
            <td><@1@></td>
            <td class="omit"><%title%></td>
            <td class="omit"><%forumName%></td>
            <td><%forum%></td>
            <td class="omit"><%sender%></td>
            <td class="omit"><%source%></td>
            <td class="omit"><%groupName%></td>
            <td><%receiverCount%></td>
            <td class="focus"><%receiver%><div class="description hide"><span></span><div><span>手机号：</span><%receivers%></div></div></td>
            <td><%createTime%></td>
            <td><%actualPushTime%></td>
            <td>
            <span class="look">查看效果</span>
            <span class="detail">查看详情</span>
            </td>
            </tr>`;
/**
 *  模板引擎
 *  @param tpl {string} template 模板
 *  @param obj {object} 展示的数据
 *  @param variate1 {number} 序号1
 *  @param variate2 {number} 序号2
 *  @param separator {string} 当数据中有数组时的分隔符
 */
function tplEngine(tpl, obj, variate1, variate2, separator) {
  if (variate1 || variate1 === 0) {
    var tpl = tpl.replace(/<@1@>/g, function (a, b) {
      return variate1
    })
  }
  if (variate2 || variate2 === 0) {
    var tpl = tpl.replace(/<@2@>/g, function (a, b) {
      return variate2
    })
  }
  if (!separator && separator !== 0) {
    separator = ','
  }
  var tpl = tpl.replace(/<%([^%>]+)?%>/g, function (a, b) {
    var b = b.trim()
    if (/\./.test(b)) {
      var arr = b.split('.')
      if (obj[arr[0]][arr[1]] instanceof Array) {
        return obj[arr[0]][arr[1]].join(separator)
      } else {
        //console.log(obj[arr[0]][arr[1]]);
        if (obj[arr[0]][arr[1]] == 0 || obj[arr[0]][arr[1]]) {
          return obj[arr[0]][arr[1]]
        } else {
          return ''
        }
      }
    } else {
      if (obj[b] instanceof Array) {
        return obj[b].join(separator)
      } else {

        if (obj[b] == 0 || obj[b]) {
          return obj[b]
        } else {
          return ' '
        }
      }
    }
  })
  return tpl
}
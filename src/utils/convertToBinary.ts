// @ts-nocheck
export default function convertToBinary(entry) {
    var obj = {
      dn: entry.dn.toString(),
      controls: []
    };
    entry.attributes.forEach(function (a) {
      var item = a.buffers;
      if (item && item.length) {
        if (item.length > 1) {
          obj[a.type] = item.slice();
        } else {
          obj[a.type] = item[0];
        }
      } else {
        obj[a.type] = [];
      }
    });
    entry.controls.forEach(function (element, index, array) {
      obj.controls.push(element.json);
    });
    return obj;
  }
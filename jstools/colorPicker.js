
function colorPicker(fieldname, domtarget, value, label, callback ) {

  var xtarget = document.getElementById(domtarget);
  if (xtarget == undefined) {
    console.warn('Dom item not found for id :'+domtarget);
    return;
  }

  function unhex(hex) {
    return parseInt("0x" + hex, 16);
  }

  function convColor(color) {
    let col = String(color).replace('#', '');
    let formcolor = {};
    formcolor.rouge = unhex(col.substr(0,2));
    formcolor.vert = unhex(col.substr(2,2));
    formcolor.bleu = unhex(col.substr(4,2));
    return formcolor;
  }

  let xlabel = document.createElement('label');
  xlabel.innerHTML = label + ' : ';

  let xinput = document.createElement('input');
  xinput.setAttribute('type', 'color');
  xinput.setAttribute('id', 'pjs_'+fieldname);
  xinput.value = value;
  xlabel.append(xinput);
  xtarget.append(xlabel);

  let rgb = convColor(value);
  callback(rgb);

  xinput.addEventListener('change', function(evt) {
    let rgb = convColor(this.value);
    callback(rgb);
  }, false);
}

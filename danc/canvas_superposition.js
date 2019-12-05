// https://github.com/gregja/ninjaOnMeetup

var canvas1 = document.getElementById('mycanvas1');
var context1 = canvas1.getContext('2d');
context1.imageSmoothingEnabled = true;
canvas1.setAttribute('style', 'z-index:1; position: absolute; left: 10px; top: 10px;');
var canvas2 = document.getElementById('mycanvas2');
var context2 = canvas2.getContext('2d');
context2.imageSmoothingEnabled = true;
canvas2.setAttribute('style', 'z-index:0; position: absolute; left: 10px; top: 10px;');


module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:!0});
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var t=function(e,i){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i])})(e,i)};function e(e,i){if("function"!=typeof i&&null!==i)throw new TypeError("Class extends value "+String(i)+" is not a constructor or null");function n(){this.constructor=e}t(e,i),e.prototype=null===i?Object.create(i):(n.prototype=i.prototype,new n)}var i=function(){return(i=Object.assign||function(t){for(var e,i=1,n=arguments.length;i<n;i++)for(var r in e=arguments[i])Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t}).apply(this,arguments)};function n(t,e,i,n){return new(i||(i=Promise))((function(r,o){function s(t){try{u(n.next(t))}catch(t){o(t)}}function a(t){try{u(n.throw(t))}catch(t){o(t)}}function u(t){var e;t.done?r(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(s,a)}u((n=n.apply(t,e||[])).next())}))}function r(t,e){var i,n,r,o,s={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return o={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function a(o){return function(a){return function(o){if(i)throw new TypeError("Generator is already executing.");for(;s;)try{if(i=1,n&&(r=2&o[0]?n.return:o[0]?n.throw||((r=n.return)&&r.call(n),0):n.next)&&!(r=r.call(n,o[1])).done)return r;switch(n=0,r&&(o=[2&o[0],r.value]),o[0]){case 0:case 1:r=o;break;case 4:return s.label++,{value:o[1],done:!1};case 5:s.label++,n=o[1],o=[0];continue;case 7:o=s.ops.pop(),s.trys.pop();continue;default:if(!(r=s.trys,(r=r.length>0&&r[r.length-1])||6!==o[0]&&2!==o[0])){s=0;continue}if(3===o[0]&&(!r||o[1]>r[0]&&o[1]<r[3])){s.label=o[1];break}if(6===o[0]&&s.label<r[1]){s.label=r[1],r=o;break}if(r&&s.label<r[2]){s.label=r[2],s.ops.push(o);break}r[2]&&s.ops.pop(),s.trys.pop();continue}o=e.call(t,s)}catch(t){o=[6,t],n=0}finally{i=r=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,a])}}}function o(t,e){for(var i=0,n=e.length,r=t.length;i<n;i++,r++)t[r]=e[i];return t}String.prototype.includes||(String.prototype.includes=function(t,e){return"number"!=typeof e&&(e=0),!(e+t.length>this.length)&&-1!==this.indexOf(t,e)}),Array.prototype.find||Object.defineProperty(Array.prototype,"find",{value:function(t){if(null==this)throw new TypeError('"this" is null or not defined');var e=Object(this),i=e.length>>>0;if("function"!=typeof t)throw new TypeError("predicate must be a function");for(var n=arguments[1],r=0;r<i;){var o=e[r];if(t.call(n,o,r,e))return o;r++}}});var s=function(t){for(var e=[],i=1;i<arguments.length;i++)e[i-1]=arguments[i];return e.some((function(e){return Object.prototype.toString.call(t).slice(8,-1).toLowerCase()===e}))},a=function(t){return[].filter.call(t,(function(t){return"\n"!==t})).join("")},u=function(t){if("string"!=typeof t)return!1;if("transparent"===(t=t.toLocaleLowerCase().trim()))return!1;if(/^rgba/.test(t)){var e=/([^\s,]+)\)$/.exec(t);if(0===(null===(i=e)?0:"object"==typeof i?NaN:"number"==typeof i?i:"string"==typeof i?"%"===i[i.length-1]?Number(i.slice(0,-1))/100:Number(i):NaN))return!1}var i;return!0},h=function(){function t(){this.subs=[]}return t.prototype.addSub=function(t){this.subs.includes(t)||this.subs.push(t)},t.prototype.notify=function(){this.subs.forEach((function(t){t.update()}))},t}(),c="__proto__"in{};function l(t,e,i,n){Object.defineProperty(t,e,{value:i,enumerable:!!n,writable:!0,configurable:!0})}var f=Array.prototype,d=Object.create(f);["push","pop","shift","unshift","sort","splice","reverse"].forEach((function(t){d[t]=function(){for(var e=[],i=0;i<arguments.length;i++)e[i]=arguments[i];var n=f[t].apply(this,e),r=this.__luckyOb__;return["push","unshift","splice"].includes(t)&&r.walk(this),r.dep.notify(),n}}));var p=function(){function t(t){this.dep=new h,l(t,"__luckyOb__",this),Array.isArray(t)&&(c?t.__proto__=d:Object.getOwnPropertyNames(d).forEach((function(e){l(t,e,d[e])}))),this.walk(t)}return t.prototype.walk=function(t){Object.keys(t).forEach((function(e){m(t,e,t[e])}))},t}();function g(t){if(t&&"object"==typeof t)return"__luckyOb__"in t?t.__luckyOb__:new p(t)}function m(t,e,i){var n=new h,r=Object.getOwnPropertyDescriptor(t,e);if(!r||!1!==r.configurable){var o=r&&r.get,s=r&&r.set;o&&!s||2!==arguments.length||(i=t[e]);var a=g(i);Object.defineProperty(t,e,{get:function(){var e=o?o.call(t):i;return h.target&&(n.addSub(h.target),a&&a.dep.addSub(h.target)),e},set:function(e){e!==i&&(i=e,o&&!s||(s?s.call(t,e):i=e,a=g(e),n.notify()))}})}}var v=0,b=function(){function t(t,e,i,n){void 0===n&&(n={}),this.id=v++,this.$lucky=t,this.expr=e,this.deep=!!n.deep,this.getter="function"==typeof e?e:function(t){t+=".";for(var e=[],i="",n=0;n<t.length;n++){var r=t[n];if(/\[|\./.test(r))e.push(i),i="";else{if(/\W/.test(r))continue;i+=r}}return function(t){return e.reduce((function(t,e){return t[e]}),t)}}(e),this.cb=i,this.value=this.get()}return t.prototype.get=function(){h.target=this;var t=this.getter.call(this.$lucky,this.$lucky);return this.deep&&function(t){var e=function(t){s(t,"array","object")&&Object.keys(t).forEach((function(i){var n=t[i];e(n)}))};e(t)}(t),h.target=null,t},t.prototype.update=function(){var t=this.get(),e=this.value;this.value=t,this.cb.call(this.$lucky,t,e)},t}(),y=function(){function t(t){var e=this;this.htmlFontSize=16,this.rAF=function(){},this.boxWidth=0,this.boxHeight=0,this.setHTMLFontSize(),"string"==typeof t?t={el:t}:1===t.nodeType&&(t={el:"",divElement:t}),t=t,this.config=t,this.setDpr(),this.initWindowFunction(),t.flag||(t.flag="WEB"),Object.prototype.hasOwnProperty.call(t,"ob")||(t.ob=!0),t.el&&(t.divElement=document.querySelector(t.el)),t.divElement&&(t.canvasElement=document.createElement("canvas"),t.divElement.appendChild(t.canvasElement)),this.resetWidthAndHeight(),t.canvasElement&&(t.ctx=t.canvasElement.getContext("2d"),t.canvasElement.setAttribute("package","lucky-canvas@1.5.4"),t.canvasElement.addEventListener("click",(function(t){return e.handleClick(t)})),t.canvasElement.addEventListener("mousemove",(function(t){return e.handleMouseMove(t)})),t.canvasElement.addEventListener("mousedown",(function(t){return e.handleMouseDown(t)})),t.canvasElement.addEventListener("mouseup",(function(t){return e.handleMouseUp(t)}))),this.ctx=t.ctx,t.ctx?this.boxWidth&&this.boxHeight||console.error("无法获取到宽度或高度"):console.error("无法获取到 CanvasContext2D")}return t.prototype.init=function(t){this.setDpr(),this.setHTMLFontSize(),this.resetWidthAndHeight(),this.zoomCanvas()},t.prototype.handleClick=function(t){},t.prototype.handleMouseDown=function(t){},t.prototype.handleMouseUp=function(t){},t.prototype.handleMouseMove=function(t){},t.prototype.conversionAxis=function(t,e){return[0,0]},t.prototype.setDpr=function(){var t=this.config;t.dpr||(window?window.dpr=t.dpr=window.devicePixelRatio||1:t.dpr||console.error(t,"未传入 dpr 可能会导致绘制异常"))},t.prototype.setHTMLFontSize=function(){window&&(this.htmlFontSize=+window.getComputedStyle(document.documentElement).fontSize.slice(0,-2))},t.prototype.resetWidthAndHeight=function(){var t=this.config,e=0,i=0;t.divElement&&(e=t.divElement.offsetWidth,i=t.divElement.offsetHeight),this.boxWidth=this.getLength(t.width)||e,this.boxHeight=this.getLength(t.height)||i,t.divElement&&(t.divElement.style.overflow="hidden",t.divElement.style.width=this.boxWidth+"px",t.divElement.style.height=this.boxHeight+"px")},t.prototype.initWindowFunction=function(){var t=this.config;if(window)return this.rAF=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(t){window.setTimeout(t,1e3/60)},t.setTimeout=window.setTimeout,t.setInterval=window.setInterval,t.clearTimeout=window.clearTimeout,void(t.clearInterval=window.clearInterval);if(t.rAF)this.rAF=t.rAF;else if(t.setTimeout){var e=t.setTimeout;this.rAF=function(t){return e(t,16.7)}}else this.rAF=function(t){return setTimeout(t,16.7)}},t.prototype.zoomCanvas=function(){var t=this.config,e=this.ctx,i=t.canvasElement,n=t.dpr,r=[this.boxWidth*n,this.boxHeight*n],o=r[0],s=r[1],a=function(t){return(t*n-t)/(t*n)*(n/2)*100};i&&(i.width=o,i.height=s,i.style.width=o+"px",i.style.height=s+"px",i.style.transform="scale("+1/n+") translate("+-a(o)+"%, "+-a(s)+"%)",e.scale(n,n))},t.prototype.loadImg=function(t,e,i){var n=this;return void 0===i&&(i="$resolve"),new Promise((function(r,o){if(t||o("=> '"+e.src+"' 不能为空或不合法"),"WEB"===n.config.flag){var s=new Image;s.src=t,s.onload=function(){return r(s)},s.onerror=function(){return o("=> '"+e.src+"' 图片加载失败")}}else e[i]=r}))},t.prototype.drawImage=function(t,e,i,n,r){var o,s=this.config,a=this.ctx;return["WEB","MP-WX"].includes(s.flag)?o=t:["UNI-H5","UNI-MP","TARO-H5","TARO-MP"].includes(s.flag)&&(o=t.path),a.drawImage(o,e,i,n,r)},t.prototype.getLength=function(t){return s(t,"number")?t:s(t,"string")?this.changeUnits(t):0},t.prototype.changeUnits=function(t,e){var i=this;return void 0===e&&(e=1),Number(t.replace(/^([-]*[0-9.]*)([a-z%]*)$/,(function(t,n,r){var o={"%":function(t){return t*(e/100)},px:function(t){return 1*t},rem:function(t){return t*i.htmlFontSize}}[r];if(o)return o(n);var s=i.config.unitFunc;return s?s(n,r):n})))},t.prototype.$set=function(t,e,i){t&&"object"==typeof t&&m(t,e,i)},t.prototype.$computed=function(t,e,i){var n=this;Object.defineProperty(t,e,{get:function(){return i.call(n)}})},t.prototype.$watch=function(t,e,i){void 0===i&&(i={}),"object"==typeof e&&(e=(i=e).handler);var n=new b(this,t,e,i);return i.immediate&&e.call(this,n.value),function(){}},t}(),w=function(t){return Math.PI/180*t},x=function(t,e){return[+(Math.cos(t)*e).toFixed(8),+(Math.sin(t)*e).toFixed(8)]},z=function(t,e){var i=-t/e;return[i,-i*t+e]},I=function(t,e,i,n,r,o){var s;if(void 0===o&&(o=!0),Math.abs(r-n).toFixed(8)>=w(180).toFixed(8)){var a=(r+n)/2;return o?(I(t,e,i,n,a,o),I(t,e,i,a,r,o)):(I(t,e,i,a,r,o),I(t,e,i,n,a,o)),!1}o||(n=(s=[r,n])[0],r=s[1]);var u=x(n,i),h=u[0],c=u[1],l=x(r,i),f=l[0],d=l[1],p=z(h,c),g=p[0],m=p[1],v=z(f,d),b=v[0],y=v[1],k=(y-m)/(g-b),S=(b*m-g*y)/(b-g);isNaN(k)&&(Math.abs(h)===+i.toFixed(8)&&(k=h),Math.abs(f)===+i.toFixed(8)&&(k=f)),g===1/0||g===-1/0?S=b*k+y:b!==1/0&&b!==-1/0||(S=g*k+m),e.lineTo(h,c),t.indexOf("MP")>0?e.quadraticCurveTo(k,S,f,d):e.arcTo(k,S,f,d,i)},k=function(t,e,i,n,r,o,s,a){i||(i=s);var u=w(90/Math.PI/n*s),h=w(90/Math.PI/i*s),c=r+u,l=o-u,f=r+h,d=o-h;e.beginPath(),e.fillStyle=a,e.moveTo.apply(e,x(c,n)),I(t,e,n,c,l,!0),d>f?I(t,e,i,f,d,!1):e.lineTo.apply(e,x((r+o)/2,s/2/Math.abs(Math.sin((r-o)/2)))),e.closePath(),e.fill()},S=function(t,e,i,n,r,o,s){var a=Math.min(n,r);o>a/2&&(o=a/2),t.beginPath(),t.fillStyle=s,t.moveTo(e+o,i),t.lineTo(e+o,i),t.lineTo(e+n-o,i),t.quadraticCurveTo(e+n,i,e+n,i+o),t.lineTo(e+n,i+r-o),t.quadraticCurveTo(e+n,i+r,e+n-o,i+r),t.lineTo(e+o,i+r),t.quadraticCurveTo(e,i+r,e,i+r-o),t.lineTo(e,i+o),t.quadraticCurveTo(e,i,e+o,i),t.closePath(),t.fill()},C={easeIn:function(t,e,i,n){return t>=n&&(t=n),i*(t/=n)*t+e},easeOut:function(t,e,i,n){return t>=n&&(t=n),-i*(t/=n)*(t-2)+e}},T={easeIn:function(t,e,i,n){return t>=n&&(t=n),-i*Math.cos(t/n*(Math.PI/2))+i+e},easeOut:function(t,e,i,n){return t>=n&&(t=n),i*Math.sin(t/n*(Math.PI/2))+e}},W={easeIn:function(t,e,i,n){return t>=n&&(t=n),0==t?e:i*Math.pow(2,10*(t/n-1))+e},easeOut:function(t,e,i,n){return t>=n&&(t=n),t==n?e+i:i*(1-Math.pow(2,-10*t/n))+e}},O={easeIn:function(t,e,i,n){return t>=n&&(t=n),-i*(Math.sqrt(1-(t/=n)*t)-1)+e},easeOut:function(t,e,i,n){return t>=n&&(t=n),i*Math.sqrt(1-(t=t/n-1)*t)+e}},_=Object.freeze({__proto__:null,quad:C,cubic:{easeIn:function(t,e,i,n){return t>=n&&(t=n),i*(t/=n)*t*t+e},easeOut:function(t,e,i,n){return t>=n&&(t=n),i*((t=t/n-1)*t*t+1)+e}},quart:{easeIn:function(t,e,i,n){return t>=n&&(t=n),i*(t/=n)*t*t*t+e},easeOut:function(t,e,i,n){return t>=n&&(t=n),-i*((t=t/n-1)*t*t*t-1)+e}},quint:{easeIn:function(t,e,i,n){return t>=n&&(t=n),i*(t/=n)*t*t*t*t+e},easeOut:function(t,e,i,n){return t>=n&&(t=n),i*((t=t/n-1)*t*t*t*t+1)+e}},sine:T,expo:W,circ:O}),E=function(t){function o(e,i){var n;void 0===i&&(i={});var r=t.call(this,e)||this;return r.blocks=[],r.prizes=[],r.buttons=[],r.defaultConfig={},r._defaultConfig={gutter:"0px",offsetDegree:0,speed:20,speedFunction:"quad",accelerationTime:2500,decelerationTime:2500,stopRange:.8},r.defaultStyle={},r._defaultStyle={fontSize:"18px",fontColor:"#000",fontStyle:"sans-serif",fontWeight:"400",lineHeight:"",background:"rgba(0,0,0,0)",wordWrap:!0,lengthLimit:"90%"},r.Radius=0,r.prizeRadius=0,r.prizeDeg=0,r.prizeRadian=0,r.rotateDeg=0,r.maxBtnRadius=0,r.startTime=0,r.endTime=0,r.stopDeg=0,r.endDeg=0,r.FPS=16.6,r.blockImgs=[[]],r.prizeImgs=[[]],r.btnImgs=[[]],e.ob&&(r.initData(i),r.initWatch()),r.initComputed(),null===(n=e.beforeCreate)||void 0===n||n.call(r),r.init({blockImgs:r.blocks.map((function(t){return t.imgs})),prizeImgs:r.prizes.map((function(t){return t.imgs})),btnImgs:r.buttons.map((function(t){return t.imgs}))}),r}return e(o,t),o.prototype.initData=function(t){this.$set(this,"blocks",t.blocks||[]),this.$set(this,"prizes",t.prizes||[]),this.$set(this,"buttons",t.buttons||[]),this.$set(this,"defaultConfig",t.defaultConfig||{}),this.$set(this,"defaultStyle",t.defaultStyle||{}),this.$set(this,"startCallback",t.start),this.$set(this,"endCallback",t.end)},o.prototype.initComputed=function(){var t=this;this.$computed(this,"_defaultConfig",(function(){return i({gutter:"0px",offsetDegree:0,speed:20,speedFunction:"quad",accelerationTime:2500,decelerationTime:2500,stopRange:.8},t.defaultConfig)})),this.$computed(this,"_defaultStyle",(function(){return i({fontSize:"18px",fontColor:"#000",fontStyle:"sans-serif",fontWeight:"400",background:"rgba(0,0,0,0)",wordWrap:!0,lengthLimit:"90%"},t.defaultStyle)}))},o.prototype.initWatch=function(){var t=this;this.$watch("blocks",(function(e){return t.init({blockImgs:e.map((function(t){return t.imgs}))})}),{deep:!0}),this.$watch("prizes",(function(e){return t.init({prizeImgs:e.map((function(t){return t.imgs}))})}),{deep:!0}),this.$watch("buttons",(function(e){return t.init({btnImgs:e.map((function(t){return t.imgs}))})}),{deep:!0}),this.$watch("defaultConfig",(function(){return t.draw()}),{deep:!0}),this.$watch("defaultStyle",(function(){return t.draw()}),{deep:!0}),this.$watch("startCallback",(function(){return t.init({})})),this.$watch("endCallback",(function(){return t.init({})}))},o.prototype.init=function(e){var i,n,r=this;t.prototype.init.call(this);var o=this.config,s=this.ctx;this.Radius=Math.min(this.boxWidth,this.boxHeight)/2,null===(i=o.beforeInit)||void 0===i||i.call(this),s.translate(this.Radius,this.Radius),this.draw(),this.draw(),Object.keys(e).forEach((function(t){var i=t,n={blockImgs:"blocks",prizeImgs:"prizes",btnImgs:"buttons"}[i],o=e[i];o&&o.forEach((function(t,e){t&&t.forEach((function(t,o){r.loadAndCacheImg(n,e,i,o,(function(){r.draw()}))}))}))})),null===(n=o.afterInit)||void 0===n||n.call(this)},o.prototype.handleClick=function(t){var e,i=this.ctx;i.beginPath(),i.arc(0,0,this.maxBtnRadius,0,2*Math.PI,!1),i.isPointInPath(t.offsetX,t.offsetY)&&(this.startTime||null===(e=this.startCallback)||void 0===e||e.call(this,t))},o.prototype.loadAndCacheImg=function(t,e,i,o,s){return n(this,void 0,void 0,(function(){var n,a,u=this;return r(this,(function(r){return(n=this[t][e])&&n.imgs&&(a=n.imgs[o])?(this[i][e]||(this[i][e]=[]),this.loadImg(a.src,a).then((function(t){u[i][e][o]=t,s.call(u)})).catch((function(i){console.error(t+"["+e+"].imgs["+o+"] "+i)})),[2]):[2]}))}))},o.prototype.computedWidthAndHeight=function(t,e,i,n){if(!e.width&&!e.height)return[t.width,t.height];if(e.width&&!e.height){var r=this.getWidth(e.width,i);return[r,t.height*(r/t.width)]}if(!e.width&&e.height){var o=this.getHeight(e.height,n);return[t.width*(o/t.height),o]}return[this.getWidth(e.width,i),this.getHeight(e.height,n)]},o.prototype.draw=function(){var t,e,i=this,n=this,r=n.config,o=n.ctx,s=n._defaultConfig,h=n._defaultStyle;null===(t=r.beforeDraw)||void 0===t||t.call(this,o),o.clearRect(-this.Radius,-this.Radius,2*this.Radius,2*this.Radius),this.prizeRadius=this.blocks.reduce((function(t,e,n){return u(e.background)&&(o.beginPath(),o.fillStyle=e.background,o.arc(0,0,t,0,2*Math.PI,!1),o.fill()),e.imgs&&e.imgs.forEach((function(e,r){if(i.blockImgs[n]){var s=i.blockImgs[n][r];if(s){var a=i.computedWidthAndHeight(s,e,2*t,2*t),u=a[0],h=a[1],c=[i.getOffsetX(u),i.getHeight(e.top,2*t)-t],l=c[0],f=c[1];o.save(),e.rotate&&o.rotate(w(i.rotateDeg)),i.drawImage(s,l,f,u,h),o.restore()}}})),t-i.getLength(e.padding&&e.padding.split(" ")[0])}),this.Radius),this.prizeDeg=360/this.prizes.length,this.prizeRadian=w(this.prizeDeg);var c=w(-90+this.rotateDeg+s.offsetDegree),l=function(t){return i.getOffsetX(o.measureText(t).width)},f=function(t,e,n){var r=t.lineHeight||h.lineHeight||t.fontSize||h.fontSize;return i.getHeight(t.top,e)+(n+1)*i.getLength(r)};o.save(),this.prizes.forEach((function(t,e){var n=c+e*i.prizeRadian,d=i.prizeRadius-i.maxBtnRadius,p=t.background||h.background;u(p)&&function(t,e,i,n,r,o,s,a){s?k(t,e,i,n,r,o,s,a):(e.beginPath(),e.fillStyle=a,e.moveTo(0,0),e.arc(0,0,n,r,o,!1),e.closePath(),e.fill())}(r.flag,o,i.maxBtnRadius,i.prizeRadius,n-i.prizeRadian/2,n+i.prizeRadian/2,i.getLength(s.gutter),p);var g=Math.cos(n)*i.prizeRadius,m=Math.sin(n)*i.prizeRadius;o.translate(g,m),o.rotate(n+w(90)),t.imgs&&t.imgs.forEach((function(t,n){if(i.prizeImgs[e]){var r=i.prizeImgs[e][n];if(r){var o=i.computedWidthAndHeight(r,t,i.prizeRadian*i.prizeRadius,d),s=o[0],a=o[1],u=[i.getOffsetX(s),i.getHeight(t.top,d)],h=u[0],c=u[1];i.drawImage(r,h,c,s,a)}}})),t.fonts&&t.fonts.forEach((function(t){var e=t.fontColor||h.fontColor,n=t.fontWeight||h.fontWeight,r=i.getLength(t.fontSize||h.fontSize),u=t.fontStyle||h.fontStyle;o.fillStyle=e,o.font=n+" "+(r>>0)+"px "+u;var c=[],p=String(t.text);if(Object.prototype.hasOwnProperty.call(t,"wordWrap")?t.wordWrap:h.wordWrap){p=a(p);for(var g="",m=0;m<p.length;m++){g+=p[m];var v=o.measureText(g).width,b=(i.prizeRadius-f(t,d,c.length))*Math.tan(i.prizeRadian/2)*2-i.getLength(s.gutter);v>i.getWidth(t.lengthLimit||h.lengthLimit,b)&&(c.push(g.slice(0,-1)),g=p[m])}g&&c.push(g),c.length||c.push(p)}else c=p.split("\n");c.filter((function(t){return!!t})).forEach((function(e,i){o.fillText(e,l(e),f(t,d,i))}))})),o.rotate(w(360)-n-w(90)),o.translate(-g,-m)})),o.restore(),this.buttons.forEach((function(t,e){var n=i.getHeight(t.radius);i.maxBtnRadius=Math.max(i.maxBtnRadius,n),u(t.background)&&(o.beginPath(),o.fillStyle=t.background,o.arc(0,0,n,0,2*Math.PI,!1),o.fill()),t.pointer&&u(t.background)&&(o.beginPath(),o.fillStyle=t.background,o.moveTo(-n,0),o.lineTo(n,0),o.lineTo(0,2*-n),o.closePath(),o.fill()),t.imgs&&t.imgs.forEach((function(t,r){if(i.btnImgs[e]){var o=i.btnImgs[e][r];if(o){var s=i.computedWidthAndHeight(o,t,2*n,2*n),a=s[0],u=s[1],h=[i.getOffsetX(a),i.getHeight(t.top,n)],c=h[0],l=h[1];i.drawImage(o,c,l,a,u)}}})),t.fonts&&t.fonts.forEach((function(t){var e=t.fontColor||h.fontColor,r=t.fontWeight||h.fontWeight,s=i.getLength(t.fontSize||h.fontSize),a=t.fontStyle||h.fontStyle;o.fillStyle=e,o.font=r+" "+(s>>0)+"px "+a,String(t.text).split("\n").forEach((function(e,i){o.fillText(e,l(e),f(t,n,i))}))}))})),null===(e=r.afterDraw)||void 0===e||e.call(this,o)},o.prototype.play=function(){this.startTime||(this.startTime=Date.now(),this.prizeFlag=void 0,this.run())},o.prototype.stop=function(t){this.prizeFlag=t<0?-1:t%this.prizes.length,-1===this.prizeFlag&&(this.rotateDeg=this.prizeDeg/2-this._defaultConfig.offsetDegree,this.draw())},o.prototype.run=function(t){void 0===t&&(t=0);var e=this,i=e.rAF,n=e.prizeFlag,r=e.prizeDeg,o=e.rotateDeg,s=e._defaultConfig,a=Date.now()-this.startTime;if(a>=s.accelerationTime&&void 0!==n){this.FPS=a/t,this.endTime=Date.now(),this.stopDeg=o;for(var u=(Math.random()*r-r/2)*this.getLength(s.stopRange),h=0;++h;){var c=360*h-n*r-o-s.offsetDegree+u;if(_[s.speedFunction].easeOut(this.FPS,this.stopDeg,c,s.decelerationTime)-this.stopDeg>s.speed){this.endDeg=c;break}}return this.slowDown()}this.rotateDeg=(o+_[s.speedFunction].easeIn(a,0,s.speed,s.accelerationTime))%360,this.draw(),i(this.run.bind(this,t+1))},o.prototype.slowDown=function(){var t,e=this,n=e.rAF,r=e.prizes,o=e.prizeFlag,s=e.stopDeg,a=e.endDeg,u=e._defaultConfig,h=Date.now()-this.endTime;if(-1!==o){if(h>=u.decelerationTime)return this.startTime=0,void(null===(t=this.endCallback)||void 0===t||t.call(this,i({},r.find((function(t,e){return e===o})))));this.rotateDeg=_[u.speedFunction].easeOut(h,s,a,u.decelerationTime)%360,this.draw(),n(this.slowDown.bind(this))}else this.startTime=0},o.prototype.getWidth=function(t,e){return void 0===e&&(e=this.prizeRadian*this.prizeRadius),s(t,"number")?t:s(t,"string")?this.changeUnits(t,e):0},o.prototype.getHeight=function(t,e){return void 0===e&&(e=this.prizeRadius),s(t,"number")?t:s(t,"string")?this.changeUnits(t,e):0},o.prototype.getOffsetX=function(t){return-t/2},o.prototype.conversionAxis=function(t,e){var i=this.config;return[t/i.dpr-this.Radius,e/i.dpr-this.Radius]},o}(y),P=function(t){function h(e,i){var n;void 0===i&&(i={});var r=t.call(this,e)||this;r.rows=3,r.cols=3,r.blocks=[],r.prizes=[],r.buttons=[],r.defaultConfig={},r._defaultConfig={gutter:5,speed:20,accelerationTime:2500,decelerationTime:2500},r.defaultStyle={},r._defaultStyle={borderRadius:20,fontColor:"#000",fontSize:"18px",fontStyle:"sans-serif",fontWeight:"400",lineHeight:"",background:"rgba(0,0,0,0)",shadow:"",wordWrap:!0,lengthLimit:"90%"},r.activeStyle={},r._activeStyle={background:"#ffce98",shadow:"",fontStyle:"",fontWeight:"",fontSize:"",lineHeight:"",fontColor:""},r.cellWidth=0,r.cellHeight=0,r.startTime=0,r.endTime=0,r.currIndex=0,r.stopIndex=0,r.endIndex=0,r.demo=!1,r.timer=0,r.FPS=16.6,r.prizeFlag=-1,r.cells=[],r.blockImgs=[[]],r.btnImgs=[[]],r.prizeImgs=[],e.ob&&(r.initData(i),r.initWatch()),r.initComputed(),null===(n=e.beforeCreate)||void 0===n||n.call(r);var o=r.buttons.map((function(t){return t.imgs}));return r.button&&o.push(r.button.imgs),r.init({blockImgs:r.blocks.map((function(t){return t.imgs})),prizeImgs:r.prizes.map((function(t){return t.imgs})),btnImgs:o}),r}return e(h,t),h.prototype.initData=function(t){this.$set(this,"rows",Number(t.rows)||3),this.$set(this,"cols",Number(t.cols)||3),this.$set(this,"blocks",t.blocks||[]),this.$set(this,"prizes",t.prizes||[]),this.$set(this,"buttons",t.buttons||[]),this.$set(this,"button",t.button),this.$set(this,"defaultConfig",t.defaultConfig||{}),this.$set(this,"defaultStyle",t.defaultStyle||{}),this.$set(this,"activeStyle",t.activeStyle||{}),this.$set(this,"startCallback",t.start),this.$set(this,"endCallback",t.end)},h.prototype.initComputed=function(){var t=this;this.$computed(this,"_defaultConfig",(function(){var e=i({gutter:5,speed:20,accelerationTime:2500,decelerationTime:2500},t.defaultConfig);return e.gutter=t.getLength(e.gutter),e.speed=e.speed/40,e})),this.$computed(this,"_defaultStyle",(function(){return i({borderRadius:20,fontColor:"#000",fontSize:"18px",fontStyle:"sans-serif",fontWeight:"400",background:"rgba(0,0,0,0)",shadow:"",wordWrap:!0,lengthLimit:"90%"},t.defaultStyle)})),this.$computed(this,"_activeStyle",(function(){return i({background:"#ffce98",shadow:""},t.activeStyle)}))},h.prototype.initWatch=function(){var t=this;this.$watch("blocks",(function(e){return t.init({blockImgs:e.map((function(t){return t.imgs}))})}),{deep:!0}),this.$watch("prizes",(function(e){return t.init({prizeImgs:e.map((function(t){return t.imgs}))})}),{deep:!0}),this.$watch("buttons",(function(e){var i=e.map((function(t){return t.imgs}));return t.button&&i.push(t.button.imgs),t.init({btnImgs:i})}),{deep:!0}),this.$watch("button",(function(){var e=t.buttons.map((function(t){return t.imgs}));return t.button&&e.push(t.button.imgs),t.init({btnImgs:e})}),{deep:!0}),this.$watch("rows",(function(){return t.init({})})),this.$watch("cols",(function(){return t.init({})})),this.$watch("defaultConfig",(function(){return t.draw()}),{deep:!0}),this.$watch("defaultStyle",(function(){return t.draw()}),{deep:!0}),this.$watch("activeStyle",(function(){return t.draw()}),{deep:!0}),this.$watch("startCallback",(function(){return t.init({})})),this.$watch("endCallback",(function(){return t.init({})}))},h.prototype.init=function(e){var i,n,r=this;t.prototype.init.call(this);var o=this,s=o.config;o.ctx,o.button,null===(i=s.beforeInit)||void 0===i||i.call(this),this.draw(),Object.keys(e).forEach((function(t){var i=t,n=e[i],o={blockImgs:"blocks",prizeImgs:"prizes",btnImgs:"buttons"}[i];n&&n.forEach((function(t,e){t&&t.forEach((function(t,n){r.loadAndCacheImg(o,e,i,n,(function(){r.draw()}))}))}))})),null===(n=s.afterInit)||void 0===n||n.call(this)},h.prototype.handleClick=function(t){var e=this,i=this.ctx;o(o([],this.buttons),[this.button]).forEach((function(n){var r;if(n){var o=e.getGeometricProperty([n.x,n.y,n.col||1,n.row||1]),s=o[0],a=o[1],u=o[2],h=o[3];i.beginPath(),i.rect(s,a,u,h),i.isPointInPath(t.offsetX,t.offsetY)&&(e.startTime||("function"==typeof n.callback&&n.callback.call(e,n),null===(r=e.startCallback)||void 0===r||r.call(e,t,n)))}}))},h.prototype.loadAndCacheImg=function(t,e,i,o,s){return n(this,void 0,void 0,(function(){var n,a,u,h=this;return r(this,(function(r){return n=this[t][e],"buttons"===t&&!this.buttons.length&&this.button&&(n=this.button),n&&n.imgs&&(a=n.imgs[o])?(this[i][e]||(this[i][e]=[]),u=[this.loadImg(a.src,a),a.activeSrc&&this.loadImg(a.activeSrc,a,"$activeResolve")],Promise.all(u).then((function(t){var n=t[0],r=t[1];h[i][e][o]={defaultImg:n,activeImg:r},s.call(h)})).catch((function(i){console.error(t+"["+e+"].imgs["+o+"] "+i)})),[2]):[2]}))}))},h.prototype.computedWidthAndHeight=function(t,e,i){if(!e.width&&!e.height)return[t.width,t.height];if(e.width&&!e.height){var n=this.getWidth(e.width,i.col);return[n,t.height*(n/t.width)]}if(!e.width&&e.height){var r=this.getHeight(e.height,i.row);return[t.width*(r/t.height),r]}return[this.getWidth(e.width,i.col),this.getHeight(e.height,i.row)]},h.prototype.draw=function(){var t,e,i=this,n=this,r=n.config,h=n.ctx,c=n._defaultConfig,l=n._defaultStyle,f=n._activeStyle;null===(t=r.beforeDraw)||void 0===t||t.call(this,h),h.clearRect(0,0,this.boxWidth,this.boxHeight),this.cells=o(o([],this.prizes),this.buttons),this.button&&this.cells.push(this.button),this.cells.forEach((function(t){t.col=t.col||1,t.row=t.row||1})),this.prizeArea=this.blocks.reduce((function(t,e){var n=t.x,r=t.y,o=t.w,a=t.h,c=function(t){var e,i=(null===(e=t.padding)||void 0===e?void 0:e.replace(/px/g,"").split(" ").map((function(t){return~~t})))||[0],n=0,r=0,o=0,a=0;switch(i.length){case 1:n=r=o=a=i[0];break;case 2:n=r=i[0],o=a=i[1];break;case 3:n=i[0],o=a=i[1],r=i[2];break;default:n=i[0],r=i[1],o=i[2],a=i[3]}var u={paddingTop:n,paddingBottom:r,paddingLeft:o,paddingRight:a};for(var h in u)u[h]=Object.prototype.hasOwnProperty.call(t,h)&&s(t[h],"string","number")?~~String(t[h]).replace(/px/g,""):u[h];return[n,r,o,a]}(e),f=c[0],d=c[1],p=c[2],g=c[3],m=e.borderRadius?i.getLength(e.borderRadius):0,v=e.background||l.background;return u(v)&&S(h,n,r,o,a,m,i.handleBackground(n,r,o,a,v)),{x:n+p,y:r+f,w:o-p-g,h:a-f-d}}),{x:0,y:0,w:this.boxWidth,h:this.boxHeight}),this.cellWidth=(this.prizeArea.w-c.gutter*(this.cols-1))/this.cols,this.cellHeight=(this.prizeArea.h-c.gutter*(this.rows-1))/this.rows,this.cells.forEach((function(t,e){var n=i.getGeometricProperty([t.x,t.y,t.col,t.row]),o=n[0],s=n[1],c=n[2],d=n[3],p=!1;(void 0===i.prizeFlag||i.prizeFlag>-1)&&(p=e===i.currIndex%i.prizes.length>>0);var g=p?f.background:t.background||l.background;if(u(g)){var m=(p?f.shadow:t.shadow||l.shadow).replace(/px/g,"").split(",")[0].split(" ").map((function(t,e){return e<3?Number(t):t}));4===m.length&&(h.shadowColor=m[3],h.shadowOffsetX=m[0]*r.dpr,h.shadowOffsetY=m[1]*r.dpr,h.shadowBlur=m[2],m[0]>0?c-=m[0]:(c+=m[0],o-=m[0]),m[1]>0?d-=m[1]:(d+=m[1],s-=m[1])),S(h,o,s,c,d,i.getLength(t.borderRadius?t.borderRadius:l.borderRadius),i.handleBackground(o,s,c,d,g)),h.shadowColor="rgba(0, 0, 0, 0)",h.shadowOffsetX=0,h.shadowOffsetY=0,h.shadowBlur=0}var v="prizeImgs";e>=i.prizes.length&&(v="btnImgs",e-=i.prizes.length),t.imgs&&t.imgs.forEach((function(n,r){if(i[v][e]){var a=i[v][e][r];if(a){var u=p&&a.activeImg||a.defaultImg;if(u){var h=i.computedWidthAndHeight(u,n,t),c=h[0],l=h[1],f=[o+i.getOffsetX(c,t.col),s+i.getHeight(n.top,t.row)],d=f[0],g=f[1];i.drawImage(u,d,g,c,l)}}}})),t.fonts&&t.fonts.forEach((function(e){var n=p&&f.fontStyle?f.fontStyle:e.fontStyle||l.fontStyle,r=p&&f.fontWeight?f.fontWeight:e.fontWeight||l.fontWeight,u=p&&f.fontSize?i.getLength(f.fontSize):i.getLength(e.fontSize||l.fontSize),c=p&&f.lineHeight?f.lineHeight:e.lineHeight||l.lineHeight||e.fontSize||l.fontSize;h.font=r+" "+(u>>0)+"px "+n,h.fillStyle=p&&f.fontColor?f.fontColor:e.fontColor||l.fontColor;var d=[],g=String(e.text);if(Object.prototype.hasOwnProperty.call(e,"wordWrap")?e.wordWrap:l.wordWrap){g=a(g);for(var m="",v=0;v<g.length;v++){m+=g[v],h.measureText(m).width>i.getWidth(e.lengthLimit||l.lengthLimit,t.col)&&(d.push(m.slice(0,-1)),m=g[v])}m&&d.push(m),d.length||d.push(g)}else d=g.split("\n");d.forEach((function(n,r){h.fillText(n,o+i.getOffsetX(h.measureText(n).width,t.col),s+i.getHeight(e.top,t.row)+(r+1)*i.getLength(c))}))}))})),null===(e=r.afterDraw)||void 0===e||e.call(this,h)},h.prototype.handleBackground=function(t,e,i,n,r){var o=this.ctx;return r.includes("linear-gradient")&&(r=function(t,e,i,n,r,o){var s=/linear-gradient\((.+)\)/.exec(o)[1].split(",").map((function(t){return t.trim()})),a=s.shift(),u=[0,0,0,0];if(a.includes("deg")){var h=function(t){return Math.tan(t/180*Math.PI)};(a=a.slice(0,-3)%360)>=0&&a<45?u=[e,i+r,e+n,i+r-n*h(a-0)]:a>=45&&a<90?u=[e,i+r,e+n-r*h(a-45),i]:a>=90&&a<135?u=[e+n,i+r,e+n-r*h(a-90),i]:a>=135&&a<180?u=[e+n,i+r,e,i+n*h(a-135)]:a>=180&&a<225?u=[e+n,i,e,i+n*h(a-180)]:a>=225&&a<270?u=[e+n,i,e+r*h(a-225),i+r]:a>=270&&a<315?u=[e,i,e+r*h(a-270),i+r]:a>=315&&a<360&&(u=[e,i,e+n,i+r-n*h(a-315)])}else a.includes("top")?u=[e,i+r,e,i]:a.includes("bottom")?u=[e,i,e,i+r]:a.includes("left")?u=[e+n,i,e,i]:a.includes("right")&&(u=[e,i,e+n,i]);var c=t.createLinearGradient.apply(t,u.map((function(t){return t>>0})));return s.reduce((function(t,e,i){var n=e.split(" ");return 1===n.length?t.addColorStop(i,n[0]):2===n.length&&t.addColorStop.apply(t,n),t}),c)}(o,t,e,i,n,r)),r},h.prototype.play=function(){var t=this.config.clearInterval;this.startTime||(t(this.timer),this.startTime=Date.now(),this.prizeFlag=void 0,this.run())},h.prototype.stop=function(t){this.prizeFlag=t<0?-1:t%this.prizes.length,-1===this.prizeFlag&&(this.currIndex=0,this.draw())},h.prototype.run=function(t){void 0===t&&(t=0);var e=this,i=e.rAF,n=e.currIndex,r=e.prizes,o=e.prizeFlag,s=e.startTime,a=e._defaultConfig,u=Date.now()-s;if(u>=a.accelerationTime&&void 0!==o){this.FPS=u/t,this.endTime=Date.now(),this.stopIndex=n;for(var h=0;++h;){var c=r.length*h+o-(n>>0);if(C.easeOut(this.FPS,this.stopIndex,c,a.decelerationTime)-this.stopIndex>a.speed){this.endIndex=c;break}}return this.slowDown()}this.currIndex=(n+C.easeIn(u,.1,a.speed,a.accelerationTime))%r.length,this.draw(),i(this.run.bind(this,t+1))},h.prototype.slowDown=function(){var t,e=this,n=e.rAF,r=e.prizes,o=e.prizeFlag,s=e.stopIndex,a=e.endIndex,u=e._defaultConfig,h=Date.now()-this.endTime;if(-1!==o){if(h>u.decelerationTime)return this.startTime=0,void(null===(t=this.endCallback)||void 0===t||t.call(this,i({},r.find((function(t,e){return e===o})))));this.currIndex=C.easeOut(h,s,a,u.decelerationTime)%r.length,this.draw(),n(this.slowDown.bind(this))}else this.startTime=0},h.prototype.walk=function(){var t=this,e=this.config,i=e.setInterval;(0,e.clearInterval)(this.timer),this.timer=i((function(){t.currIndex+=1,t.draw()}),1300)},h.prototype.getGeometricProperty=function(t){var e=t[0],i=t[1],n=t[2],r=t[3],o=this.cellWidth,s=this.cellHeight,a=this._defaultConfig.gutter,u=[this.prizeArea.x+(o+a)*e,this.prizeArea.y+(s+a)*i];return n&&r&&u.push(o*n+a*(n-1),s*r+a*(r-1)),u},h.prototype.getWidth=function(t,e){return void 0===e&&(e=1),s(t,"number")?t:s(t,"string")?this.changeUnits(t,this.cellWidth*e+this._defaultConfig.gutter*(e-1)):0},h.prototype.getHeight=function(t,e){return void 0===e&&(e=1),s(t,"number")?t:s(t,"string")?this.changeUnits(t,this.cellHeight*e+this._defaultConfig.gutter*(e-1)):0},h.prototype.getOffsetX=function(t,e){return void 0===e&&(e=1),(this.cellWidth*e+this._defaultConfig.gutter*(e-1)-t)/2},h.prototype.conversionAxis=function(t,e){var i=this.config;return[t/i.dpr,e/i.dpr]},h}(y);exports.LuckyGrid=P,exports.LuckyWheel=E;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.getImage = getImage;
var windowWidth = wx.getSystemInfoSync().windowWidth;

var rpx2px = exports.rpx2px = function rpx2px(value) {
  if (typeof value === 'string') value = Number(value.replace(/[a-z]*/g, ''));
  return windowWidth / 750 * value;
};

var changeUnits = exports.changeUnits = function changeUnits(value) {
  return Number(value.replace(/^(\-*[0-9.]*)([a-z%]*)$/, function (value, num, unit) {
    switch (unit) {
      case 'px':
        num *= 1;
        break;
      case 'rpx':
        num = rpx2px(num);
        break;
      default:
        num *= 1;
        break;
    }
    return num;
  }));
};

var resolveImage = exports.resolveImage = function resolveImage(e, img, canvas) {
  var srcName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'src';
  var resolveName = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '$resolve';

  var imgObj = canvas.createImage();
  imgObj.onload = function () {
    img[resolveName](imgObj);
  };
  imgObj.src = img[srcName];
};

function getImage() {
  var _this = this;

  return new Promise(function (resolve, reject) {
    wx.canvasToTempFilePath({
      canvas: _this.canvas,
      success: function success(res) {
        return resolve(res);
      },
      fail: function fail(err) {
        return reject(err);
      }
    });
  });
}

/***/ }),
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _luckyCanvasCjs = __webpack_require__(0);

var _utils = __webpack_require__(1);

Component({
  properties: {
    width: { type: String, value: '600rpx' },
    height: { type: String, value: '600rpx' },
    rows: { type: String, optionalTypes: [Number], value: '3' },
    cols: { type: String, optionalTypes: [Number], value: '3' },
    blocks: { type: Array, value: [] },
    prizes: { type: Array, value: [] },
    buttons: { type: Array, value: [] },
    defaultConfig: { type: Object, value: {} },
    defaultStyle: { type: Object, value: {} },
    activeStyle: { type: Object, value: {} },
    start: { type: Function, value: function value() {} },
    end: { type: Function, value: function value() {} }
  },
  data: {
    isShow: false,
    luckyImg: '',
    showCanvas: true
  },
  observers: {
    'prizes.**': function prizes(newData, oldData) {
      this.$lucky && (this.$lucky.prizes = newData);
    },
    'buttons.**': function buttons(newData, oldData) {
      this.$lucky && (this.$lucky.buttons = newData);
    }
  },
  ready: function ready() {
    var _this = this;

    wx.createSelectorQuery().in(this).select('#lucky-grid').fields({
      node: true, size: true
    }).exec(function (res) {
      if (!res[0] || !res[0].node) {
        console.error('lucky-canvas 获取不到 canvas 标签');
        return;
      }
      var canvas = _this.canvas = res[0].node;
      var dpr = _this.dpr = wx.getSystemInfoSync().pixelRatio;
      var ctx = _this.ctx = canvas.getContext('2d');
      var data = _this.data;
      canvas.width = res[0].width * dpr;
      canvas.height = res[0].height * dpr;
      ctx.scale(dpr, dpr);
      _this.$lucky = new _luckyCanvasCjs.LuckyGrid({
        flag: 'MP-WX',
        ctx: ctx,
        dpr: dpr,
        width: res[0].width,
        height: res[0].height,
        // rAF: canvas.requestAnimationFrame, // 帧动画真机调试会报错!
        setTimeout: setTimeout,
        clearTimeout: clearTimeout,
        setInterval: setInterval,
        clearInterval: clearInterval,
        unitFunc: function unitFunc(num, unit) {
          return (0, _utils.changeUnits)(num + unit);
        }
      }, {
        rows: data.rows,
        cols: data.cols,
        blocks: data.blocks,
        prizes: data.prizes,
        buttons: data.buttons,
        defaultConfig: data.defaultConfig,
        defaultStyle: data.defaultStyle,
        activeStyle: data.activeStyle,
        start: function start() {
          for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
            rest[_key] = arguments[_key];
          }

          _this.triggerEvent.apply(_this, ['start'].concat(rest));
        },
        end: function end() {
          for (var _len2 = arguments.length, rest = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            rest[_key2] = arguments[_key2];
          }

          _this.triggerEvent.apply(_this, ['end'].concat(rest));
          _utils.getImage.call(_this).then(function (res) {
            _this.setData({ luckyImg: res.tempFilePath });
          });
        }
      });
      // 为了保证 onload 回调准确
      _this.setData({ isShow: true });
    });
  },

  methods: {
    imgBindload: function imgBindload(e) {
      var _e$currentTarget$data = e.currentTarget.dataset,
          name = _e$currentTarget$data.name,
          index = _e$currentTarget$data.index,
          i = _e$currentTarget$data.i;

      var img = this.data[name][index].imgs[i];
      (0, _utils.resolveImage)(e, img, this.canvas);
    },
    imgBindloadActive: function imgBindloadActive(e) {
      var _e$currentTarget$data2 = e.currentTarget.dataset,
          name = _e$currentTarget$data2.name,
          index = _e$currentTarget$data2.index,
          i = _e$currentTarget$data2.i;

      var img = this.data[name][index].imgs[i];
      (0, _utils.resolveImage)(e, img, this.canvas, 'activeSrc', '$activeResolve');
    },
    luckyImgLoad: function luckyImgLoad() {
      this.showCanvas = false;
    },
    handleClickOfImg: function handleClickOfImg(e) {
      var _this2 = this;

      var _e$changedTouches$ = e.changedTouches[0],
          x = _e$changedTouches$.clientX,
          y = _e$changedTouches$.clientY;

      wx.createSelectorQuery().in(this).select('.lucky-img').fields({
        rect: true
      }).exec(function (res) {
        var _res$ = res[0],
            left = _res$.left,
            top = _res$.top;

        _this2.toPlay(x - left, y - top);
      });
    },
    handleClickOfCanvas: function handleClickOfCanvas(e) {
      var _e$changedTouches$2 = e.changedTouches[0],
          x = _e$changedTouches$2.x,
          y = _e$changedTouches$2.y;

      this.toPlay(x, y);
    },
    toPlay: function toPlay(x, y) {
      var _this3 = this;

      var ctx = this.ctx;
      this.data.buttons.forEach(function (btn) {
        if (!btn) return;
        ctx.beginPath();
        ctx.rect.apply(ctx, _this3.$lucky.getGeometricProperty([btn.x, btn.y, btn.col || 1, btn.row || 1]));
        if (!ctx.isPointInPath(x * _this3.dpr, y * _this3.dpr)) return;
        // 隐藏图片并显示canvas
        _this3.showCanvas = true;
        _this3.setData({ luckyImg: '' });
        // 触发 lucky-canvas 的抽奖逻辑
        _this3.$lucky.startCallback();
      });
    },
    play: function play() {
      var _$lucky;

      (_$lucky = this.$lucky).play.apply(_$lucky, arguments);
    },
    stop: function stop() {
      var _$lucky2;

      (_$lucky2 = this.$lucky).stop.apply(_$lucky2, arguments);
    }
  }
});

/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map
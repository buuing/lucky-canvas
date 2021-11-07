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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("lucky-canvas");

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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _luckyCanvas = __webpack_require__(0);

var _utils = __webpack_require__(1);

Component({
  properties: {
    width: { type: String, value: '600rpx' },
    height: { type: String, value: '600rpx' },
    blocks: { type: Array, value: [] },
    prizes: { type: Array, value: [] },
    buttons: { type: Array, value: [] },
    defaultConfig: { type: Object, value: {} },
    defaultStyle: { type: Object, value: {} },
    start: { type: Function, value: function value() {} },
    end: { type: Function, value: function value() {} }
  },
  data: {
    isShow: false,
    luckyImg: '',
    showCanvas: true
  },
  observers: {
    'blocks.**': function blocks(newData, oldData) {
      this.$lucky && (this.$lucky.blocks = newData);
    },
    'prizes.**': function prizes(newData, oldData) {
      this.$lucky && (this.$lucky.prizes = newData);
    },
    'buttons.**': function buttons(newData, oldData) {
      this.$lucky && (this.$lucky.buttons = newData);
    }
  },
  ready: function ready() {
    var _this = this;

    wx.createSelectorQuery().in(this).select('#lucky-wheel').fields({
      node: true, size: true
    }).exec(function (res) {
      if (!res[0] || !res[0].node) {
        return console.error('lucky-canvas 获取不到 canvas 标签');
      }
      var canvas = _this.canvas = res[0].node;
      var dpr = _this.dpr = wx.getSystemInfoSync().pixelRatio;
      var ctx = _this.ctx = canvas.getContext('2d');
      var data = _this.data;
      canvas.width = res[0].width * dpr;
      canvas.height = res[0].height * dpr;
      ctx.scale(dpr, dpr);
      _this.$lucky = new _luckyCanvas.LuckyWheel({
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
        beforeCreate: function beforeCreate() {
          var Radius = Math.min(this.config.width, this.config.height) / 2;
          // 设置坐标轴
          ctx.translate(Radius, Radius);
        },
        beforeInit: function beforeInit() {
          // 重置坐标轴
          ctx.translate(-this.Radius, -this.Radius);
        },

        unitFunc: function unitFunc(num, unit) {
          return (0, _utils.changeUnits)(num + unit);
        }
      }, {
        blocks: data.blocks,
        prizes: data.prizes,
        buttons: data.buttons,
        defaultConfig: data.defaultConfig,
        defaultStyle: data.defaultStyle,
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
      var ctx = this.ctx;
      ctx.beginPath();
      ctx.arc(0, 0, this.$lucky.maxBtnRadius, 0, Math.PI * 2, false);
      if (!ctx.isPointInPath(x * this.dpr, y * this.dpr)) return;
      // 隐藏图片并显示canvas
      this.showCanvas = true;
      this.setData({ luckyImg: '' });
      // 触发 lucky-canvas 的抽奖逻辑
      this.$lucky.startCallback();
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
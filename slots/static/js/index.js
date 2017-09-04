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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Animate = __webpack_require__(1);

var _Animate2 = _interopRequireDefault(_Animate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 引入 Game 模块

// 调用代码
var APP = {
    // 模拟数据
    source: {
        prizeResultArray: [-170, -500, -500] // 每个抽奖结果之间距离 110，最小值 -60，最大值 -1150
    },
    params: [{
        dom: document.getElementsByClassName('superheros-list01')[0], // 动画对象，必须
        property: 'top', // 动画属性，必需
        startPos: -60, // 动画开始位置，必需
        endPos: -1050, // 动画终止的位置，必需
        duration: 500, // 动画持续时间，非必需
        easing: 'linear', // 动画速率，非必需
        counts: 5 // 动画循环次数，非必需
    }, {
        dom: document.getElementsByClassName('superheros-list02')[0], // 动画对象，必须
        property: 'top',
        startPos: -60,
        endPos: -1050,
        duration: 500,
        easing: 'linear',
        counts: 6
    }, {
        dom: document.getElementsByClassName('superheros-list03')[0], // 动画对象，必须
        property: 'top',
        startPos: -60,
        endPos: -1050,
        duration: 500,
        easing: 'linear',
        counts: 7
    }],
    // 初始化
    init: function init() {
        this.bindEventFn();
        this.gameInstance();
    },
    game: [],
    // 抽奖实例
    gameInstance: function gameInstance() {
        var _this = this;

        // 声明 game 数组，并将 Game 的实例化按顺序压入 game 数组
        this.params.forEach(function (item, index) {
            _this.game[index] = new _Animate2.default(item);
        });
    },
    // 点击事件绑定
    bindEventFn: function bindEventFn() {
        // 在点击事件中逐个执行 game 数组里的方法
        document.getElementById('start').addEventListener('click', this.slotRunFn);
    },
    slotRunFn: function slotRunFn() {
        APP.game.forEach(function (item, index) {
            // game 实例接受两个参数，必需的 targetPos 和非必需的 callback
            // 执行最后一个动画对象的时候，传入回调
            if (index === 2) {
                item.run(APP.source.prizeResultArray[index], function () {
                    alert('你与大奖擦肩而过');
                });
            } else {
                item.run(APP.source.prizeResultArray[index]);
            }
        });
    }
};

APP.init();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Tween = __webpack_require__(2);

var _Tween2 = _interopRequireDefault(_Tween);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// 动画方法
var Animate = function () {
    function Animate(dom) {
        _classCallCheck(this, Animate);

        this.dom = dom; // 运动节点
        this.startTime = 0; // 动画开始时间
        this.startPos = 0; // 动画开始位置
        this.endPos = 0; // 节点目标位置
        this.property = null; // 动画属性
        this.easing = null; // 动画速度曲线
        this.duration = null; // 持续时间
    }

    _createClass(Animate, [{
        key: 'start',
        value: function start(property, startPos, endPos, duration, easing, callback) {
            var _this = this;

            this.property = property; // 动画属性
            this.startPos = startPos; // 获取 dom 节点初始位置
            this.endPos = endPos; // dom 节点目标位置

            this.startTime = new Date().getTime(); // 动画启动时间
            this.duration = duration; // 动画持续时间
            this.easing = _Tween2.default[easing]; // 动画速度算法

            var timeId = setInterval(function () {
                // 启动定时器
                if (_this.step() === false) {
                    // 如果动画结束，清除定时器
                    clearInterval(timeId); // 清除定时器
                    callback && callback(); // 如果有回调函数，则执行回调函数
                }
                // 每隔20毫秒执行 step() 函数，如果时间越大，则动画帧数越小
                _this.step();
            }, 20);
        }
    }, {
        key: 'step',
        value: function step() {
            var t = new Date().getTime(); // 获取动画当前时间

            if (t >= this.startTime + this.duration) {
                // 当前时间大于动画开始时间加上动画持续时间之和
                this.update(this.endPos); // 最后一次修正动画的位置
                return false; // 结束动画
            }

            var pos = this.easing(t - this.startTime, this.startPos, this.endPos - this.startPos, this.duration); // 执行动画函数
            this.update(pos); // 更新 dom 节点位置
        }
    }, {
        key: 'update',
        value: function update(pos) {
            this.dom.style[this.property] = pos + 'px'; // 修改 dom 节点相应属性值
        }
    }]);

    return Animate;
}();

// 设定动画方法的执行


var Game = function () {
    function Game(obj) {
        _classCallCheck(this, Game);

        // 如果 obj 参数不是一个对象，打印错误
        if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
            console.error('参数错误');
            return false;
        }
        // 检查必要参数
        if (!obj['dom'] && !obj['property'] && obj['startPos'] && obj['endPos']) {
            console.error('缺乏必要参数');
            return false;
        }

        this.counter = 0; // 计数器
        this.dom = obj['dom']; // 动画对象
        this.property = obj['property']; // 动画属性
        this.startPos = obj['startPos']; // 动画起点
        this.endPos = obj['endPos']; // 动画终点

        this.duration = obj['duration'] ? obj['duration'] : 500; // 动画持续时间，默认值为 500s
        this.easing = obj['easing'] ? obj['easing'] : 'linear'; // 动画速度曲线，默认值为 linear
        this.counts = obj['counts'] ? obj['counts'] : 10; // 动画循环次数，默认值为 10
    }

    _createClass(Game, [{
        key: 'run',
        value: function run(targetPos, callback) {
            var _this2 = this;

            // 检查参数
            if (!targetPos) {
                console.error('缺乏必要参数');
                return false;
            }
            if (callback && typeof callback !== 'function') {
                console.error('参数类型错误');
            }
            var animate = new Animate(this.dom);
            // 执行动画
            animate.start(this.property, this.startPos, this.endPos, this.duration, this.easing, function () {
                // 计时器开始计数
                _this2.counter++;
                // 当计时器大于或者等于指定的动画循环次数时，停止执行动画。
                if (_this2.counter >= _this2.counts) {
                    // 计时器清零
                    _this2.counter = 0;
                    // 在最后一次动画循环中将移动目标节点到指定位置
                    animate.start(_this2.property, _this2.startPos, targetPos, 800, 'easeOut');
                    // 执行回调
                    if (callback) {
                        setTimeout(function () {
                            callback();
                        }, 1200);
                    }
                    return false;
                };
                // 执行动画循环，将动画对象的位置重置到初始状态
                _this2.dom.style[_this2.property] = _this2.startPos + 'px';
                _this2.run(targetPos, callback);
            });
        }
    }]);

    return Game;
}();

// 导出 Game 模块


exports.default = Game;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var Tween = {
    linear: function linear(t, b, c, d) {
        //匀速
        return c * t / d + b;
    },
    easeIn: function easeIn(t, b, c, d) {
        //加速曲线
        return c * (t /= d) * t + b;
    },
    easeOut: function easeOut(t, b, c, d) {
        //减速曲线
        return -c * (t /= d) * (t - 2) + b;
    },
    easeBoth: function easeBoth(t, b, c, d) {
        //加速减速曲线
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        }
        return -c / 2 * (--t * (t - 2) - 1) + b;
    },
    easeInStrong: function easeInStrong(t, b, c, d) {
        //加加速曲线
        return c * (t /= d) * t * t * t + b;
    },
    easeOutStrong: function easeOutStrong(t, b, c, d) {
        //减减速曲线
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeBothStrong: function easeBothStrong(t, b, c, d) {
        //加加速减减速曲线
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t + b;
        }
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    elasticIn: function elasticIn(t, b, c, d, a, p) {
        //正弦衰减曲线（弹动渐入）
        if (t === 0) {
            return b;
        }
        if ((t /= d) == 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    elasticOut: function elasticOut(t, b, c, d, a, p) {
        //正弦增强曲线（弹动渐出）
        if (t === 0) {
            return b;
        }
        if ((t /= d) == 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    elasticBoth: function elasticBoth(t, b, c, d, a, p) {
        if (t === 0) {
            return b;
        }
        if ((t /= d / 2) == 2) {
            return b + c;
        }
        if (!p) {
            p = d * (0.3 * 1.5);
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        if (t < 1) {
            return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        }
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
    },
    backIn: function backIn(t, b, c, d, s) {
        //回退加速（回退渐入）
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    backOut: function backOut(t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 1.10158; //回缩的距离
        }
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    backBoth: function backBoth(t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        if ((t /= d / 2) < 1) {
            return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
        }
        return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
    },
    bounceIn: function bounceIn(t, b, c, d) {
        //弹球减振（弹球渐出）
        return c - Tween['bounceOut'](d - t, 0, c, d) + b;
    },
    bounceOut: function bounceOut(t, b, c, d) {
        if ((t /= d) < 1 / 2.75) {
            return c * (7.5625 * t * t) + b;
        } else if (t < 2 / 2.75) {
            return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
        } else if (t < 2.5 / 2.75) {
            return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
        }
        return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
    },
    bounceBoth: function bounceBoth(t, b, c, d) {
        if (t < d / 2) {
            return Tween['bounceIn'](t * 2, 0, c, d) * 0.5 + b;
        }
        return Tween['bounceOut'](t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    }
};

exports.default = Tween;

/***/ })
/******/ ]);
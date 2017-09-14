/*极客学院前端组*/
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* 极客前端出品
** name  : 超级英雄老虎机
** author: 戴锦如
** email : jeocat@163.com
*/

/* Animate 类实现了一个对象从某个位置到目的位置的动画过渡效果
** run() 方法是 Animate 类的开放接口
** run() 方法接受 property,startPos,endPos,duration,easing,callback(可选)，并初始化相关参数，通过定时器执行 _step() 方法
** _step() 方法，每次执行都会调用 _update() 方法更新动画对象的位置，可以理解为动画帧
*/
var Animate = function () {
    function Animate(dom) {
        _classCallCheck(this, Animate);

        this.dom = dom; // 动画对象
    }

    _createClass(Animate, [{
        key: 'run',
        value: function run(property, startPos, endPos, duration, easing, callback) {
            var _this = this;

            this.property = property; // 初始化动画属性
            this.startPos = startPos; // 初始化动画开始位置
            this.endPos = endPos; // 初始化动画结束位置
            this.startTime = new Date().getTime(); // 初始化动画开始时间
            this.duration = duration; // 初始化动画持续时间
            this.easing = this._Tween(easing); // 初始化动画速度曲线
            // 启动定时器
            var timeId = setInterval(function () {
                // _step() 方法会在动画结束的时候返回 false
                if (_this._step() === false) {
                    // 清除定时器
                    clearInterval(timeId);
                    // 执行回调函数
                    callback && typeof callback === 'function' && callback();
                }
                // 每隔20毫秒执行 _step() 方法，如果时间越大，则动画帧数越小，因此不宜过大
                _this._step();
            }, 20);
        }
    }, {
        key: '_step',
        value: function _step() {
            // 获取当前时间
            var t = new Date().getTime();
            // 当前时间大于动画开始时间加上动画持续时间之和
            if (t >= this.startTime + this.duration) {
                // 最后一次修正动画对象的位置
                this._update(this.endPos);
                // 结束动画
                return false;
            }
            // 获取动画速度曲线返回的值
            var pos = this.easing(t - this.startTime, this.startPos, this.endPos - this.startPos, this.duration);
            // 更新动画对象位置 
            this._update(pos);
        }
    }, {
        key: '_update',
        value: function _update(pos) {
            // 更新动画对象的 style 属性值
            this.dom.style[this.property] = pos + 'px';
        }
    }, {
        key: '_Tween',
        value: function _Tween(easing) {
            var Tween = {
                //匀速
                linear: function linear(t, b, c, d) {
                    return c * t / d + b;
                },
                //加速曲线
                easeIn: function easeIn(t, b, c, d) {
                    return c * (t /= d) * t + b;
                },
                //减速曲线
                easeOut: function easeOut(t, b, c, d) {
                    return -c * (t /= d) * (t - 2) + b;
                },
                //加速减速曲线
                easeBoth: function easeBoth(t, b, c, d) {
                    if ((t /= d / 2) < 1) {
                        return c / 2 * t * t + b;
                    }
                    return -c / 2 * (--t * (t - 2) - 1) + b;
                },
                //加加速曲线
                easeInStrong: function easeInStrong(t, b, c, d) {
                    return c * (t /= d) * t * t * t + b;
                },
                //减减速曲线
                easeOutStrong: function easeOutStrong(t, b, c, d) {
                    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
                },
                //加加速减减速曲线
                easeBothStrong: function easeBothStrong(t, b, c, d) {
                    if ((t /= d / 2) < 1) {
                        return c / 2 * t * t * t * t + b;
                    }
                    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
                }
            };
            return Tween[easing];
        }
    }]);

    return Animate;
}();

/* 
 ** Game 类是对 Animate 类的进一步封装，提供动画的循环和重置，及动画结束之后的回调函数
 ** run() 方法是 Game 类的开放接口
 ** run() 方法接受 targetPos（最后一次循环的动画结束位置）,callback（可选）回调
 */


var Game = function () {
    function Game(obj) {
        _classCallCheck(this, Game);

        this.counter = 0; // 初始化计数器
        this.dom = document.getElementsByClassName(obj['dom'])[0]; // 初始化动画对象
        this.property = obj['property'] ? obj['property'] : 'bottom'; // 初始化动画属性
        this.startPos = obj['startPos']; // 初始化动画开始位置
        this.endPos = obj['endPos']; // 初始化动画结束位置

        this.duration = obj['duration'] ? obj['duration'] : 500; // 初始化动画持续时间，默认值为 500s
        this.easing = obj['easing'] ? obj['easing'] : 'linear'; // 初始化动画速度曲线，默认值为 'linear'
        this.counts = obj['counts'] ? obj['counts'] : 10; // 初始化动画循环次数，默认值为 10

        this._style(); // 初始化动画对象位置
        this.animate = new Animate(this.dom); // 实例化 Animate 类
    }

    _createClass(Game, [{
        key: 'run',
        value: function run(targetPos, callback) {
            var _this2 = this;

            // 执行动画
            this.animate.run(this.property, this.startPos, this.endPos, this.duration, this.easing, function () {
                // 计数器开始计数
                _this2.counter++;
                // 当计数器大于或者等于动画循环次数时，停止执行动画。
                if (_this2.counter >= _this2.counts) {
                    // 计数器清零
                    _this2.counter = 0;
                    // 在最后一次动画循环中移动动画对象到结束位置
                    _this2.animate.run(_this2.property, _this2.startPos, targetPos, 800, 'easeOut');
                    // 执行回调函数
                    if (callback && typeof callback === 'function') {
                        setTimeout(function () {
                            callback();
                        }, 1500);
                    }
                    return false;
                };
                // 在每一次动画循环最后重置动画对象到开始位置
                _this2.dom.style[_this2.property] = _this2.startPos + 'px';
                // 再次执行动画循环
                _this2.run(targetPos, callback);
            });
        }
    }, {
        key: '_style',
        value: function _style() {
            // 初始化样式
            this.dom.style[this.property] = this.startPos + 'px';
        }
    }]);

    return Game;
}();

/* 
 ** SlotMachine 类初始化动画执行的具体参数，封装调用动画的行为
 ** run() 方法是 其开放接口，接受动画最终循环的结束位置和回调函数
 */


var SlotMachine = function () {
    function SlotMachine(params) {
        _classCallCheck(this, SlotMachine);

        this.dom = params['dom']; // 动画对象（数组）
        this.animate = params['animate']; // 动画参数
        this.game = []; // 初始化 game 数组
        this._gameInstance();
    }

    _createClass(SlotMachine, [{
        key: 'run',
        value: function run(targetPosArray, callback) {
            // 遍历 game 对象
            this.game.forEach(function (item, index, array) {
                // 参数转换为数组
                // 执行最后一个对象的动画的时候，传入回调
                if (index === array.length - 1) {
                    item.run(targetPosArray[index], function () {
                        callback && typeof callback === 'function' && callback();
                    });
                    // 其他对象的动画正常执行
                } else {
                    item.run(targetPosArray[index]);
                }
            });
        }
        // 该方法的用途是将动画对象和动画参数传到 Game 类并实例化

    }, {
        key: '_gameInstance',
        value: function _gameInstance() {
            var _this3 = this;

            // 让 counts 数组长度跟 dom 长度一样，超出部分被截取，少于部分补充为 undefined
            this.animate['counts'].length = this.dom.length;
            // 根据参数实例化 Game 并逐条压入 game 数组
            this.dom.forEach(function (item, index) {
                // 组合 dom 和 counts的单个元素 为对象
                var dom = { dom: item, counts: _this3.animate['counts'][index] };
                // 合并 dom 和 animate 对象，最后得出
                var params = Object.assign({}, _this3.animate, dom);
                // 合并后的对象传入 Game 类并实例化，存储到 this.game 数组
                _this3.game[index] = new Game(params);
            });
        }
    }]);

    return SlotMachine;
}();
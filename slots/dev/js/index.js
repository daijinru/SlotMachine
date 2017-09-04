/* 极客前端出品
** name  : 老虎机
** author: 戴锦如
** email : jeocat@163.com
*/ 

// 动画执行实现
class Game {
    constructor(obj) {

        // 如果 obj 参数不是一个对象，打印错误
        if (typeof obj !== 'object') { 
            console.error('参数错误');
            return false;
        }
        // 检查必要参数
        if (!obj['dom'] && !obj['property'] && obj['startPos'] && obj['endPos']) {
            console.error('缺乏必要参数')
            return false;
        }

        this.counter            = 0; // 计数器
        this.dom                = obj['dom']; // 动画对象
        this.property           = obj['property']; // 动画属性
        this.startPos           = obj['startPos']; // 动画起点
        this.endPos             = obj['endPos']; // 动画终点

        this.duration           = obj['duration'] ? obj['duration'] : 500; // 动画持续时间，默认值为 500s
        this.easing             = obj['easing'] ? obj['easing'] : 'linear'; // 动画速度曲线，默认值为 linear
        this.counts             = obj['counts'] ? obj['counts'] : 10; // 动画循环次数，默认值为 10
    }

    run(targetPos,callback) {
        // 检查参数
        if (!targetPos) {
            console.error('缺乏必要参数')
            return false;
        }
        if (callback && typeof callback !== 'function') {
            console.error('参数类型错误');
        }
        const animate = new Animate(this.dom);
        // 执行动画
        animate.start(this.property, this.startPos, this.endPos, this.duration, this.easing, () => {
            // 计时器开始计数
            this.counter++;
            // 当计时器大于或者等于指定的动画循环次数时，停止执行动画。
            if (this.counter >= this.counts) {
                // 计时器清零
                this.counter = 0;
                // 在最后一次动画循环中将移动目标节点到指定位置
                animate.start(this.property, this.startPos, targetPos, 800, 'easeOut');
                // 执行回调
                if (callback) {
                    setTimeout(() => {
                        callback();
                    },1500)
                }
                return false;
            };
            // 执行动画循环， 将动画对象的位置重置到初始状态
            this.dom.style[this.property] = this.startPos + 'px';
            this.run(targetPos,callback);
        })
    }
}

// 动画效果实现
class Animate {
    constructor(dom) {
        this.dom            = dom; // 运动节点
        this.startTime      = 0; // 动画开始时间
        this.startPos       = 0; // 动画开始位置
        this.endPos         = 0; // 节点目标位置
        this.property       = null; // 动画属性
        this.easing         = null; // 动画速度曲线
        this.duration       = null; // 持续时间
    }

    start(property, startPos, endPos, duration, easing, callback) {

        this.property       = property; // 动画属性
        this.startPos       = startPos; // 获取 dom 节点初始位置
        this.endPos         = endPos; // dom 节点目标位置

        this.startTime      = new Date().getTime(); // 动画启动时间
        this.duration       = duration; // 动画持续时间
        this.easing         = Tween[easing]; // 动画速度算法

         // 启动定时器
        const timeId = setInterval(() => {
            // 如果动画结束，清除定时器
            if (this._step() === false) {
                // 清除定时器
                clearInterval(timeId);
                // 清除定时器
                callback && callback();
            }
            // 每隔20毫秒执行 step() 函数，如果时间越大，则动画帧数越小
            this._step();
        }, 20);
    }

    _step() {
        // 获取动画当前时间
        const t = new Date().getTime(); 
        // 当前时间大于动画开始时间加上动画持续时间之和
        if (t >= this.startTime + this.duration) { 
            // 最后一次修正动画的位置
            this._update(this.endPos); 
            // 结束动画
            return false; 
        }
        // 执行动画函数
        const pos = this.easing(t - this.startTime, this.startPos, this.endPos - this.startPos, this.duration);
        // 更新 dom 节点位置 
        this._update(pos); 
    }

    _update(pos) {
        // 修改 dom 节点相应属性值
        this.dom.style[this.property] = pos + 'px'; 
    }
}

// 动画速率曲线（仅供参考）
const Tween = {
    linear: function(t, b, c, d) { //匀速
        return c * t / d + b;
    },
    easeIn: function(t, b, c, d) { //加速曲线
        return c * (t /= d) * t + b;
    },
    easeOut: function(t, b, c, d) { //减速曲线
        return -c * (t /= d) * (t - 2) + b;
    },
    easeBoth: function(t, b, c, d) { //加速减速曲线
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        }
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },
    easeInStrong: function(t, b, c, d) { //加加速曲线
        return c * (t /= d) * t * t * t + b;
    },
    easeOutStrong: function(t, b, c, d) { //减减速曲线
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeBothStrong: function(t, b, c, d) { //加加速减减速曲线
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t + b;
        }
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    elasticIn: function(t, b, c, d, a, p) { //正弦衰减曲线（弹动渐入）
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
    elasticOut: function(t, b, c, d, a, p) { //正弦增强曲线（弹动渐出）
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
    elasticBoth: function(t, b, c, d, a, p) {
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
            return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) *
                Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        }
        return a * Math.pow(2, -10 * (t -= 1)) *
            Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
    },
    backIn: function(t, b, c, d, s) { //回退加速（回退渐入）
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    backOut: function(t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 1.10158; //回缩的距离
        }
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    backBoth: function(t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        if ((t /= d / 2) < 1) {
            return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        }
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },
    bounceIn: function(t, b, c, d) { //弹球减振（弹球渐出）
        return c - Tween['bounceOut'](d - t, 0, c, d) + b;
    },
    bounceOut: function(t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
        }
        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
    },
    bounceBoth: function(t, b, c, d) {
        if (t < d / 2) {
            return Tween['bounceIn'](t * 2, 0, c, d) * 0.5 + b;
        }
        return Tween['bounceOut'](t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    }
}

// 程序调用逻辑
class App {
    constructor(button,params) {

        if (!button && !params) {
            console.error('参数缺失');
            return false;
        }

        this.params = params;
        this.button = button;
        this.game   = []; // 初始化 game 数组

        this._gameInstance();
    }
    // 初始化
    
    // 根据参数实例化 Game 并逐条压入 this.game
    _gameInstance() {
        this.params.forEach((item, index) => {
            this.game[index] = new Game(item);
        })
    }

    run(prizeResultArray,callback) {
        this.game.forEach((item, index) => {
            // game 实例接受两个参数，必需的 targetPos 和非必需的 callback
            // 执行最后一个动画对象的时候，传入回调
            if (index === (prizeResultArray.length - 1)) {
                item.run(prizeResultArray[index], () => {
                    callback && typeof callback === 'function' && callback();
                })
            } else {
                item.run(prizeResultArray[index]);
            }
        })
    }
}

// -------------- 分界线 -----------------

const app = new App(document.getElementById('start'),[{
    dom: document.getElementsByClassName('superheros-list01')[0], // 动画对象，必须
    property: 'top', // 动画属性，必需
    startPos: -60, // 动画开始位置，必需
    endPos: -1050, // 动画终止的位置，必需
    counts: 5 // 动画循环次数，非必需
},{
    dom: document.getElementsByClassName('superheros-list02')[0], // 动画对象，必须
    property: 'top',
    startPos: -60,
    endPos: -1050,
    counts: 6
},{
    dom: document.getElementsByClassName('superheros-list03')[0], // 动画对象，必须
    property: 'top',
    startPos: -60,
    endPos: -1050,
    counts: 7
}])

const prizeResultArray = [-170, -500, -500];

document.getElementById('start').addEventListener('click',function(){
    app.run(prizeResultArray,function(){
        console.log('hello')
    })
})
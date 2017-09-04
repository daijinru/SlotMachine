import Tween from './Tween.js';

// Animate 动画
class Animate {
    constructor(dom) {
        this.dom            = dom; // 运动节点
        this.startTime      = 0; // 动画开始时间
        this.startPos       = 0; // 动画开始位置
        this.endPos         = 0; // 节点目标位置
        this.property       = null; // 节点 style 属性名
        this.easing         = null; // 动画速度曲线
        this.duration       = null; // 持续时间
    }

    start(property, startPos, endPos, duration, easing, callback) {

        this.property       = property; // dom节点被改变的css属性名
        this.startPos       = startPos; // 获取dom节点初始位置
        this.endPos         = endPos; // dom节点目标位置

        this.startTime      = new Date().getTime(); // 动画启动时间
        this.duration       = duration; // 动画持续时间
        this.easing         = Tween[easing]; // 动画速度算法

        const timeId = setInterval(() => { // 启动定时器
            if (this.step() === false) { // 如果动画结束，清除定时器
                clearInterval(timeId); // 清除定时器
                callback && callback(); // 执行回调函数
            }
            // 每隔20秒执行 step() 函数
            this.step();
        }, 20);
    }

    step() {
        const t = new Date().getTime(); // 获取动画当前时间

        if (t >= this.startTime + this.duration) { // 当前时间大于动画开始时间加上动画持续时间之和
            this.update(this.endPos); // 最后一次修正动画的位置
            return false; // 结束动画
        }

        const pos = this.easing(t - this.startTime, this.startPos, this.endPos - this.startPos, this.duration); // 执行动画函数
        this.update(pos); // 更新dom节点位置
    }

    update(pos) {
        this.dom.style[this.property] = pos + 'px'; // 修改dom节点相应属性值
    }
}

// 执行动画方法
class Game {
    constructor(obj) {

        // 如果 obj 参数不是一个对象，打印错误
        if (typeof obj !== 'object') { 
            console.error('参数错误');
            return false;
        }
        // 对必要参数进行检查
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
        this.targetPos          = obj['targetPos'] ? obj['targetPos'] : obj['startPos']; // 动画执行到最后一个循环后停止到指定位置，默认值为 0
        this.counts             = obj['counts'] ? obj['counts'] : 10; // 动画循环次数，默认值为 10

        this.callback           = obj['callback'] ? obj['callback'] : void(0); // 初始化回调
    }

    run() {
        // 计时器清零
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
                animate.start(this.property, this.startPos, this.targetPos, 800, 'easeOut');
                // 执行回调
                if (this.callback) {
                    setTimeout(() => {
                        this.callback();
                    },1500)
                }
                return false;
            };
            // 执行动画循环
            this.dom.style[this.property] = this.startPos + 'px';
            this.run();
        })
    }
}

export default Game
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
class Animate {
    constructor(dom) {
        // 实例化检验类
        this.validate = new VALIDATE({
            property    : 'string.isRequired',
            startPos    : 'number.isRequired',
            endPos      : 'number.isRequired',
            duration    : 'number.isRequired',
            easing      : 'string.isRequired',
            callback    : 'function.notRequired',
            dom         : 'object.isRequired'
        })
        this.validate.start({dom});          // 检验动画对象

        this.dom            = dom;           // 动画对象
        this.startTime      = 0;             // 动画开始时间
        this.startPos       = 0;             // 动画开始位置
        this.endPos         = 0;             // 动画结束位置
        this.property       = null;          // 动画属性
        this.easing         = null;          // 动画速度曲线
        this.duration       = null;          // 动画持续时间
    }

    run(property, startPos, endPos, duration, easing, callback) {
        // 检验参数
        this.validate.start({property,startPos,endPos,duration,easing,callback});

        this.property       = property;                     // 初始化动画属性
        this.startPos       = startPos;                     // 初始化动画开始位置
        this.endPos         = endPos;                       // 初始化动画结束位置

        this.startTime      = new Date().getTime();         // 初始化动画开始时间
        this.duration       = duration;                     // 初始化动画持续时间
        this.easing         = this._Tween(easing);          // 初始化动画速度曲线

        // 启动定时器
        const timeId = setInterval(() => {
            // _step() 方法会在动画结束的时候返回 false
            if (this._step() === false) {
                // 清除定时器
                clearInterval(timeId);
                // 执行回调函数
                callback && callback();
            }
            // 每隔20毫秒执行 _step() 方法，如果时间越大，则动画帧数越小，因此不宜过大
            this._step();
        }, 20);
    }
    
    _step() {
        // 获取当前时间
        const t = new Date().getTime(); 
        // 当前时间大于动画开始时间加上动画持续时间之和
        if (t >= this.startTime + this.duration) { 
            // 最后一次修正动画对象的位置
            this._update(this.endPos); 
            // 结束动画
            return false; 
        }
        // 获取动画速度曲线返回的值
        const pos = this.easing(t - this.startTime, this.startPos, this.endPos - this.startPos, this.duration);
        // 更新动画对象位置 
        this._update(pos); 
    }

    _update(pos) {
        // 更新动画对象的 style 属性值
        this.dom.style[this.property] = pos + 'px'; 
    }

    _Tween(easing) {
        const Tween = {
            //匀速
            linear: function(t, b, c, d) { 
                return c * t / d + b;
            },
            //加速曲线
            easeIn: function(t, b, c, d) { 
                return c * (t /= d) * t + b;
            },
            //减速曲线
            easeOut: function(t, b, c, d) { 
                return -c * (t /= d) * (t - 2) + b;
            },
            //加速减速曲线
            easeBoth: function(t, b, c, d) { 
                if ((t /= d / 2) < 1) {
                    return c / 2 * t * t + b;
                }
                return -c / 2 * ((--t) * (t - 2) - 1) + b;
            },
            //加加速曲线
            easeInStrong: function(t, b, c, d) { 
                return c * (t /= d) * t * t * t + b;
            },
            //减减速曲线
            easeOutStrong: function(t, b, c, d) { 
                return -c * ((t = t / d - 1) * t * t * t - 1) + b;
            },
            //加加速减减速曲线
            easeBothStrong: function(t, b, c, d) { 
                if ((t /= d / 2) < 1) {
                    return c / 2 * t * t * t * t + b;
                }
                return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
            }
        }
        return Tween[easing]
    }
}

/* Game 类是对 Animate 类的进一步封装，提供动画的循环和重置，及动画结束之后的回调函数
** run() 方法是 Game 类的开放接口
** run() 方法接受 targetPos（最后一次循环的动画结束位置）,callback（可选）回调
*/ 
class Game {
    constructor(obj) {

        // 实例化检验类
        this.validate = new VALIDATE({
            obj         : 'object.isRequired',
            property    : 'string.isRequired',
            startPos    : 'number.isRequired',
            endPos      : 'number.isRequired',
            dom         : 'object.isRequired',
            targetPos   : 'number.isRequired',
            callback    : 'function.notRequired'
        })
        // 检验参数
        this.validate.start({
            obj         : obj,
            dom         : obj['dom'],
            property    : obj['property'],
            startPos    : obj['startPos'],
            endPos      : obj['endPos']
        })

        this.counter            = 0;                                        // 初始化计数器
        this.dom                = obj['dom'];                               // 初始化动画对象
        this.property           = obj['property'];                          // 初始化动画属性
        this.startPos           = obj['startPos'];                          // 初始化动画开始位置
        this.endPos             = obj['endPos'];                            // 初始化动画结束位置

        this.duration           = obj['duration'] ? obj['duration'] : 500;  // 初始化动画持续时间，默认值为 500s
        this.easing             = obj['easing'] ? obj['easing'] : 'linear'; // 初始化动画速度曲线，默认值为 'linear'
        this.counts             = obj['counts'] ? obj['counts'] : 10;       // 初始化动画循环次数，默认值为 10
    }

    run(targetPos,callback) {
        // 检查参数
        this.validate.start({targetPos,callback});
        // 实例化 Animate 类并传入动画对象
        const animate = new Animate(this.dom);
        // 执行动画
        animate.run(this.property, this.startPos, this.endPos, this.duration, this.easing, () => {
            // 计数器开始计数
            this.counter++;
            // 当计数器大于或者等于动画循环次数时，停止执行动画。
            if (this.counter >= this.counts) {
                // 计数器清零
                this.counter = 0;
                // 在最后一次动画循环中移动动画对象到结束位置
                animate.run(this.property, this.startPos, targetPos, 800, 'easeOut');
                // 执行回调函数
                if (callback) {
                    setTimeout(() => {
                        callback();
                    },1500)
                }
                return false;
            };
            // 在每一次动画循环最后重置动画对象到开始位置
            this.dom.style[this.property] = this.startPos + 'px';
            // 再次执行动画循环
            this.run(targetPos,callback);
        })
    }
}

/* 校验类
*/ 

class VALIDATE {
    constructor(params) {
        this.params = params;
    }

    start(state) {
        //遍历校验规则
        Object.getOwnPropertyNames(state).forEach(val => {                              
            let stateType  = typeof state[val];                                         //当前类型
            let propsType  = this.params[val].split('.')[0];                            //规则类型
            let required   = this.params[val].split('.')[1];                            //规则参数是否必传
            let isRequired = required  === 'isRequired'           ? true : false;       //验证当前参数是否必传
            let isPropType = propsType === typeof state[val] ? true : false;            //验证当前类型与规则类型是否相等
            let errorType  = `${val} type should be ${propsType} but ${stateType}`;     //类型错误抛出异常值
            let errorIsQu  = `${val} isRequired!'`;                                     //必传参数抛出类型异常值
            //如果为必传参数但是没有传值
            if(isRequired  && !state[val]){                                    
                throw new Error (errorIsQu);
            }
            //如果当前类型与规则类型不等
            if(!isPropType && state[val]){  
                throw new Error (errorType);
            }
        });
    }
}

/* App 类初始化动画执行的具体参数，封装调用动画的行为
** run() 方法是 App 类的开放接口，接受动画最终循环的结束位置和回调函数
*/ 
class App {
    constructor(params) {

        // 实例化检验类
        this.validate = new VALIDATE({
            params          : 'object.isRequired',
            dom             : 'object.isRequired',
            property        : 'string.isRequired',
            startPos        : 'number.isRequired',
            endPos          : 'number.isRequired',
            targetPosArray  : 'object.isRequired',
            callback        : 'function.notRequired',
        })
        // 检查参数
        params.forEach(item => {
            this.validate.start({
                params      : item,
                dom         : item['dom'],
                property    : item['property'],
                startPos    : item['startPos'],
                endPos      : item['endPos'],
            })
        })
        
        this.params = params; // 初始化参数
        this.game   = [];     // 初始化 game 数组
        this._gameInstance(); 
    }

    run(targetPosArray,callback) {
        // 检查参数
        this.validate.start({targetPosArray,callback});
        // 遍历 game 数组
        this.game.forEach((item, index) => {
            // 执行最后一个对象的动画的时候，传入回调
            if (index === (targetPosArray.length - 1)) {
                item.run(targetPosArray[index], () => {
                    callback && typeof callback === 'function' && callback();
                })
            // 其他对象的动画正常执行
            } else {
                item.run(targetPosArray[index]);
            }
        })
    }

    _gameInstance() {
        // 根据参数实例化 Game 并逐条压入 game 数组
        this.params.forEach((item, index) => {
            this.game[index] = new Game(item);
        })
    }
}

/* 我们来模拟一次吧！
** 实例化 App类，每一个实例都传入相关参数
** 通过点击事件触发 App 实例的 run() 方法
*/
const app = new App([{
    dom: document.getElementsByClassName('superheros-list01')[0],   // 动画对象，必须
    property: 'top',                                                // 动画属性，必需
    startPos: -60,                                                  // 动画开始位置，必需
    endPos: -1050,                                                  // 动画终止的位置，必需
    counts: 5                                                       // 动画循环次数，非必需
},{
    dom: document.getElementsByClassName('superheros-list02')[0],
    property: 'top',
    startPos: -60,
    endPos: -1050,
    counts: 6
},{
    dom: document.getElementsByClassName('superheros-list03')[0],
    property: 'top',
    startPos: -60,
    endPos: -1050,
    counts: 7
}])

/* 假设[1,1,1] [2,2,2] ... [10,10,10] 是为中奖，其它不中奖
** 因此需要对抽奖序列号进行滑动距离的换算，例如在这个例子当中将 [1,1,1] 换算成 [-60,-60,-60];两个抽奖结果之间相距 110
*/ 

// 设定一个锁，避免重复触发动画
window.lock = false;
document.getElementById('start').addEventListener('click',function(){
    if (window.lock) return;
    // 加锁
    window.lock = true;
    // 模拟一次随机数组
    const sourceArray = [10,10,10].map(item => {
        // 避免出现为 0 的情况，Math.random() * (max - min) + min
        return Math.floor(Math.random() * (item - 1) + 1)
    });
    // 转换 sourceArray 数组为动画对象最终循环的位置
    const prizeArray = sourceArray.map(item => {
        return 50 - item * 110
    });
    // 传入参数，执行动画
    app.run(prizeArray,function(){

        // 判断 prizeArray 内的数字是否全部相等
        const isPrize = prizeArray.some(item => {
            return item !== prizeArray[0]
        })
        // 反馈用户
        isPrize === true ? alert('很抱歉，没有中奖') : alert('恭喜中奖了！你可以去买彩票了！')
        // 解锁
        window.lock = false;
    })
})










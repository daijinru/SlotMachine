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
        this.dom            = dom;                          // 动画对象
    }

    run(property, startPos, endPos, duration, easing, callback) {
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
                callback && typeof callback === 'function' && callback();
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
        this.counter            = 0;                                        // 初始化计数器
        this.dom                = obj['dom'];                               // 初始化动画对象
        this.property           = obj['property'];                          // 初始化动画属性
        this.startPos           = obj['startPos'];                          // 初始化动画开始位置
        this.endPos             = obj['endPos'];                            // 初始化动画结束位置

        this.duration           = obj['duration'] ? obj['duration'] : 500;  // 初始化动画持续时间，默认值为 500s
        this.easing             = obj['easing'] ? obj['easing'] : 'linear'; // 初始化动画速度曲线，默认值为 'linear'
        this.counts             = obj['counts'] ? obj['counts'] : 10;       // 初始化动画循环次数，默认值为 10

        this.animate            = new Animate(this.dom);                    // 实例化 Animate 类
    }

    run(targetPos,callback) {
        // 实例化 Animate 类并传入动画对象
        // const animate = new Animate(this.dom);
        // 执行动画
        this.animate.run(this.property, this.startPos, this.endPos, this.duration, this.easing, () => {
            // 计数器开始计数
            this.counter++;
            // 当计数器大于或者等于动画循环次数时，停止执行动画。
            if (this.counter >= this.counts) {
                // 计数器清零
                this.counter = 0;
                // 在最后一次动画循环中移动动画对象到结束位置
                this.animate.run(this.property, this.startPos, targetPos, 800, 'easeOut');
                // 执行回调函数
                if (callback && typeof callback === 'function') {
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
            let stateType  = typeof state[val];                                         // 当前类型
            let propsType  = this.params[val].split('.')[0];                            // 规则类型
            let required   = this.params[val].split('.')[1];                            // 规则参数是否必传
            let isRequired = required  === 'isRequired'           ? true : false;       // 验证当前参数是否必传
            let isPropType = propsType === typeof state[val] ? true : false;            // 验证当前类型与规则类型是否相等
            let errorType  = `${val} type should be ${propsType} but ${stateType}`;     // 类型错误抛出异常值
            let errorIsQu  = `${val} isRequired!'`;                                     // 必传参数抛出类型异常值
            // 如果该参数不存在，则跳过
            if (!val) {
                return
            }
            // 如果为必传参数但是没有传值
            if(isRequired  && !state[val]){                                    
                throw new Error (errorIsQu);
            }
            // 如果当前类型与规则类型不等
            if(!isPropType && state[val]){  
                throw new Error (errorType);
            }
        });
    }
}

/* SlotMachine 类初始化动画执行的具体参数，封装调用动画的行为
** run() 方法是 其开放接口，接受动画最终循环的结束位置和回调函数
*/ 
class SlotMachine {
    constructor(params) {

        this.dom        = params['dom'];        // 动画对象（数组）
        this.animate    = params['animate'];    // 动画参数
        this.game       = [];                   // 初始化 game 数组
        this._gameInstance();

        // 实例化检验类
        this.validate = new VALIDATE({
            params          : 'object.isRequired',
            dom             : 'object.isRequired',
            property        : 'string.isRequired',
            startPos        : 'number.isRequired',
            endPos          : 'number.isRequired',
            duration        : 'number.notRequired',
            easing          : 'string.notRequired',
            counts          : 'object.notRequired',
            callback        : 'function.notRequired',
        })
        // 检查参数
        this.validate.start({
            params          : params,
            dom             : this.dom,
            property        : this.animate['property'],
            startPos        : this.animate['startPos'],
            endPos          : this.animate['endPos'],
            duration        : this.animate['duration'],
            easing          : this.animate['easing'],
            counts          : this.animate['counts']
        })
    }

    run(params,callback) {
        // 检查参数
        this.validate.start({params,callback});
        // 产生 targetPos 数组
        const prizeArray = this._prizeArray(params);
        // 遍历 game 对象
        this.game.forEach((item, index) => {
            // 参数转换为数组
            // 执行最后一个对象的动画的时候，传入回调
            if (index === (prizeArray.length - 1)) {
                item.run(prizeArray[index], () => {
                    callback && typeof callback === 'function' && callback();
                })
            // 其他对象的动画正常执行
            } else {
                item.run(prizeArray[index]);
            }
        })
    }

    _gameInstance() {
        // 让 counts 数组长度跟 dom 长度一样，超出部分被截取，少于部分补充为 undefined
        this.animate['counts'].length = this.dom.length;
        // 根据参数实例化 Game 并逐条压入 game 数组
        this.dom.forEach((item, index) => {
            // 组合 dom 和 counts的单个元素 为对象
            const dom = {dom:item,counts:this.animate['counts'][index]};
            // 合并 dom 和 animate 对象
            const array = Object.assign({}, this.animate, dom);
            // 合并后的对象传入 Game 类并实例化，存储到 this.game 数组
            this.game[index] = new Game(array);
        })
    }

    _prizeArray(source) {
        const { isPrize, prize, prizeAmount } = source;
        const { endPos, startPos } = this.animate;
        const dom = this.dom;
        // 判断是否中奖
        if (isPrize === true && prize > 0 && prize <= prizeAmount) {
            // 如果中奖，产生全相等的数组
            const prizeNumber = [];
            for (let i = 1;i <= this.dom.length;i ++) {
                prizeNumber.push(prize);
            }
            return transformArray(prizeNumber)
        } else {
            // 如果没有中奖，需要产生不全相等的随机数组
            return transformArray(randomArray())
        }

        function transformArray(array) {
            // 根据动画位置最大值和最小值，以及奖品数量计算间隔值，因此最大值，最小值和奖品数量是相关的。
            const interval = (endPos - startPos)/(prizeAmount - 1);
            // 转换奖品数组为动画对象最后循环的运动距离
            return array.map(item => {
                return (startPos + interval * (item - 1))
            })
        }

        function randomArray() {
            // 产生元素都在1 ~ prizeAmount
            let sourceArray = [];
            for (let i = 1;i <= dom.length;i ++) {
                sourceArray.push(prizeAmount);
            }
            // 产生随机值
            sourceArray = sourceArray.map(item => {
                return Math.floor(Math.random() * (item - 1) + 1)
            })
            // 不幸产生了全相等的数组，如果有一个不相等，则返回 true
            const notEqual = sourceArray.some(item => {
                return item !== sourceArray[0]
            })
            // 如果 notEqual === true，返回 sourceArray;
            if (notEqual) {
                return sourceArray
            } else {
                return randomArray()
            }
        }
    }
}
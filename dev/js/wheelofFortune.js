const TWEEN = function(easing) {
    /**
     * [Tween description]
     * @return 	{function} 	_tween['easing']    返回函数
     * @param 	{string} 	easing 	            动画曲线
     * @param 	{number} 	t                   当前时间
     * @param 	{number} 	b                   开始位置
     * @param 	{number} 	c                   终点位置 	
     * @param 	{number} 	d                   持续时间，在使用 requestAnimationFrame 情况下，60*d/s
     */
    const _Tween = {
        linear: function(t, b, c, d) {
            return c * t / d + b;
        },
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOut: function(t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        }
    }
    return _Tween[easing];
}

class WheelofFortune {
    constructor(params) {
        this.element            = document.getElementById(params['element']);     // 动画对象
        this.counts             = params['counts'];                               // 动画循环次数
        this.total              = params['total'];                                // 奖品总数
        this.duration           = params['duration'];                             // 动画持续时长
        this.easing             = TWEEN(params['easing'] || 'easeInOut');         // 动画速度曲线
        this.callback           = params['callback'] || null;                     // 回调函数

        this.startTime          = 0;                                              // 计数器,每秒递增60次
        this.startPosition      = 0;                                              // 动画开始位置
        this.cycle              = 360;                                            // 转盘圆周

        this.quantity           = this.cycle / this.total;                        // 每一份奖品所占的角度
        this.endPosition        = 0;                                              // 转盘动画停止位置

        this.cachePosition      = 0;                                              // 缓存上一次位置
    }

    move(prize) {
        // 设置奖品序列所在的角度
        this.prize          = prize;
        /**
         * 现实中的转盘每次转动都是从它停下的位置开始
         * 为了让转盘转动到目标位置，需要将换算后的角度减去上一次它停下的位置
         * (总圈数 - 1) * 360 + 奖品序列号 * 单份奖品角度 - 修正度数 = 最终停止角度
         */
        this.endPosition    = this.cycle * (this.counts - 1) + this.prize * this.quantity - (this.prize - 1) * this.quantity;
    }

    start() {
        /**
         * this.prize <= 0 奖品序列号不能小于 1
         * this.prize > this.total 奖品序列号不能大于商品总数
         */
        if (this.prize <= 0 || this.prize > this.total) {
            console.error('ERROR: @param {number} prize Min:0,Max>counter');
            return;
        }
        /**
         * window.requestAnimationFrame 每秒执行60次
         * 每次执行 this._easing() 返回的值赋值到 this.rotate 函数，更新动画对象的位置
         * 每次执行中计数器 this.startTime + 1，因此每秒其值递增60次
         */
        this.rotate         = this._easing();
        this.startTime      = this.startTime + 1;
        // 当计数达到限制时长的时候
        if (this.startTime  <= this.duration) {
            /**
             * requestAnimationFrame 是 window 提供的动画对象（具有以下特性)
             * 会改变传入函数的 this 指向
             * 循环速度是每秒60帧，例如转动6秒，则计数器应该设置为360
             * 具体请参考 https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame
             */
            window.requestAnimationFrame(this.start.bind(this));
        } else {
            // 重置计数器
            this.startTime     = 0;
            // 缓存上一次最终位置
            this.cachePosition = this.endPosition + this.cachePosition;
            // 执行回调
            this.callback && typeof this.callback === 'function' && this.callback(this.prize);
        }
    }
    /**
     * this._easing() 返回的是 this.easing()函数
     * this.easing()函数在实例化中根据 easing 参数返回相应的 TWEEN 函数
     */
    _easing() {
        return this.easing(this.startTime, this.startPosition, this.endPosition, this.duration);
    }
    /**
     * ES6 Class 提供的 set 方法
     * @param {number} DEG 是 this._easing() 返回的值
     */
    set rotate(DEG) {
        // 模拟现实中的转盘
        this.element.style.transform = `rotate(${DEG + this.cachePosition}deg)`;
    }
}
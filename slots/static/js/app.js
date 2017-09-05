/*极客学院前端组*/
'use strict';

/* 我们来模拟一次调用吧！
 ** 传入相关参数，设定好动画的一些必要参数
 */
var slotmachine = new SlotMachine({
    dom: [document.getElementsByClassName('superheros-list01')[0], // 必要的动画对象
    document.getElementsByClassName('superheros-list02')[0], document.getElementsByClassName('superheros-list03')[0]],
    animate: {
        property: 'top', // 必要的动画属性
        startPos: -60, // 必要的动画开始位置
        endPos: -1050, // 必要的动画结束位置
        counts: [5, 6, 7] // 必要的动画循环次数
    }
});
// slotmachine.run() 方法必须参数是 isPrize:bool,prize:number,prizeAmount:number
var sourceFromServer = { isPrize: false, prize: 8, prizeAmount: 10 };

var animatelock = false;
document.getElementById('start').addEventListener('click', function () {
    // 这里应该添加锁，避免在动画运行的时候重复触发
    if (animatelock) return;
    animatelock = true;
    // 开始游戏
    slotmachine.run(sourceFromServer, function () {
        animatelock = false;
    });
});
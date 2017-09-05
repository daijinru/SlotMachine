/*极客学院前端组*/
'use strict';

/* 我们来模拟一次调用吧！
 ** 实例化 App类，每一个实例都传入相关参数
 ** 通过点击事件触发 App 实例的 run() 方法
 */
var slotmachine = new SlotMachine({
    dom: [document.getElementsByClassName('superheros-list01')[0], document.getElementsByClassName('superheros-list02')[0], document.getElementsByClassName('superheros-list03')[0]],
    animate: {
        property: 'top',
        startPos: -60,
        endPos: -1050,
        counts: [5, 6, 7]
    }
});
// 这是参数
var sourceFromServer = { isPrize: false, prize: 8, prizeAmount: 10 };
window.animatelock = false;
document.getElementById('start').addEventListener('click', function () {
    // 这里应该添加锁，避免在动画运行的时候重复触发
    if (window.animatelock) return;
    window.animatelock = true;
    slotmachine.run(sourceFromServer, function () {
        window.animatelock = false;
    });
});
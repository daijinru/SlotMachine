/* 我们来模拟一次调用吧！
 ** 传入相关参数，设定好动画的一些必要参数
 */
const slotmachine = new SlotMachine({
    dom: [
        'superheros-list01', // 必要的动画对象
        'superheros-list02',
        'superheros-list03',
    ],
    animate: {
        startPos: -60,      // 必要的动画开始位置
        endPos: -1050      // 必要的动画结束位置
    }
})
// slotmachine.run() 方法
// isPrize:bool 是否中奖,prize:number 奖品序号,prizeAmount:number 奖品数量
const sourceFromServer = { isPrize: false, prize: 8, prizeAmount: 10 };
document.getElementById('start').addEventListener('click', function() {
    // 这里应该添加锁，避免在动画运行的时候重复触发
    // 开始游戏
    slotmachine.run(sourceFromServer,function(){
        console.log('抽奖结束')
    })
})
/* 我们来模拟一次调用吧！
 ** 实例化 App类，每一个实例都传入相关参数
 ** 通过点击事件触发 App 实例的 run() 方法
 */
const slotmachine = new SlotMachine([{
    dom: document.getElementsByClassName('superheros-list01')[0], // 动画对象，必须
    property: 'top', // 动画属性，必需
    startPos: -60, // 动画开始位置，必需
    endPos: -1050, // 动画终止的位置，必需
    counts: 5 // 动画循环次数，非必需
}, {
    dom: document.getElementsByClassName('superheros-list02')[0],
    property: 'top',
    startPos: -60,
    endPos: -1050,
    counts: 7
}, {
    dom: document.getElementsByClassName('superheros-list03')[0],
    property: 'top',
    startPos: -60,
    endPos: -1050,
    counts: 9
}])

/* 这是最简单的示例
 */
const prizeArray = [-500, -500, -500];
document.getElementById('start').addEventListener('click', function() {
    slotmachine.run(prizeArray);
})

/* 假设服务器返回了一个对象，包含是否中奖 isPrize，和奖品序号 prizeNumber
 ** isPrize 告诉我们用户是否中奖，如果中奖了，prizeNumber 的值是 1 ～ 10
 ** 如果没有中奖，那么 prizeNumber 为 0，并且我们需要产生随机数组传入 slotmachine 使用，告诉用户没有中奖。
 ** 中奖的规则是出现 3 个相同的超级英雄，没有中奖则 3 个不全相同。
 */

// 处理服务器数据，产生数组
// const prizeArray = function(source) {
//     const { isPrize, prizeNumber } = source;
//     // 判断是否中奖
//     if (isPrize === true && prizeNumber > 0 && prizeNumber <= 10) {
//         // 如果中奖，产生全相等的数组
//         return transformArray([prizeNumber, prizeNumber, prizeNumber])
//     } else {
//         // 如果没有中奖，需要产生不全相等的随机数组
//         return transformArray(randomArray())
//     }

//     function transformArray(array) {
//         return array.map(item => {
//             return 50 - item * 110
//         })
//     }

//     function randomArray() {
//         // 产生元素都在1-10的随机数组
//         const sourceArray = [10, 10, 10].map(item => {
//             return Math.floor(Math.random() * (item - 1) + 1)
//         })
//         // 不幸产生了全相等的数组，如果有一个不相等，则返回 true
//         const notEqual = sourceArray.some(item => {
//             return item !== sourceArray[0]
//         })
//         // 如果 notEqual === true，返回 sourceArray;
//         if (notEqual) {
//             return sourceArray
//         } else {
//             return randomArray()
//         }
//     }
// }

// // 这是服务器数据
// const sourceFromServer = { isPrize: true, prizeNumber: 8 };

// // 设定一个锁，避免重复触发动画
// let animatelock = false;
// document.getElementById('start').addEventListener('click', function() {
//     if (animatelock) return;
//     animatelock = true;
//     // 开始抽奖
//     slotmachine.run(prizeArray(sourceFromServer),function() {
//         sourceFromServer.isPrize === true ? console.log('恭喜中奖！') : console.log('没有中奖！')
//         animatelock = false;
//     });
// })
import Game from './components/Animate.js'; // 引入 Game 模块

// 调用代码
const APP = {
    // 模拟数据
    source: {
        prizeResultArray: [-170, -500, -500], // 每个抽奖结果之间距离 110，最小值 -60，最大值 -1150
    },
    params: [{
        dom: document.getElementsByClassName('superheros-list01')[0], // 动画对象，必须
        property: 'top', // 动画属性，必需
        startPos: -60, // 动画开始位置，必需
        endPos: -1050, // 动画终止的位置，必需
        duration: 500, // 动画持续时间，非必需
        easing: 'linear', // 动画速率，非必需
        counts: 5 // 动画循环次数，非必需
    }, {
        dom: document.getElementsByClassName('superheros-list02')[0], // 动画对象，必须
        property: 'top',
        startPos: -60,
        endPos: -1050,
        duration: 500,
        easing: 'linear',
        counts: 6
    }, {
        dom: document.getElementsByClassName('superheros-list03')[0], // 动画对象，必须
        property: 'top',
        startPos: -60,
        endPos: -1050,
        duration: 500,
        easing: 'linear',
        counts: 7
    }],
    // 初始化
    init: function() {
        this.bindEventFn();
        this.gameInstance();
    },
    game: [],
    // 抽奖实例
    gameInstance: function() {
        // 声明 game 数组，并将 Game 的实例化按顺序压入 game 数组
        this.params.forEach((item, index) => {
            this.game[index] = new Game(item);
        })
    },
    // 点击事件绑定
    bindEventFn: function() {
        // 在点击事件中逐个执行 game 数组里的方法
        document.getElementById('start').addEventListener('click', this.slotRunFn);
    },
    slotRunFn: function() {
        APP.game.forEach((item, index) => {
            // game 实例接受两个参数，必需的 targetPos 和非必需的 callback
            // 执行最后一个动画对象的时候，传入回调
            if (index === 2) {
                item.run(APP.source.prizeResultArray[index], () => {
                    alert('你与大奖擦肩而过')
                })
            } else {
                item.run(APP.source.prizeResultArray[index]);
            }
        })
    }
}

APP.init();
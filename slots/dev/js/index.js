import Game from './components/Animate.js';

// APP

const params = [{
    dom:document.getElementsByClassName('superheros-list01')[0], // 动画对象，必须
    property: 'top', // 动画属性，必须
    startPos: -65, // 动画开始位置，必须
    endPos: -1100, // 动画终止的位置，必须
    duration: 500, // 动画持续时间
    easing: 'linear', // 动画速率
    counts: 5, // 动画循环次数
    targetPos: -415,
},{
    dom:document.getElementsByClassName('superheros-list02')[0], // 动画对象，必须
    property: 'top', // 动画属性，必须
    startPos: -65, // 动画开始位置，必须
    endPos: -1100, // 动画终止的位置，必须
    duration: 500, // 动画持续时间
    easing: 'linear', // 动画速率
    counts: 6, // 动画循环次数
    targetPos: -415,
},{
    dom:document.getElementsByClassName('superheros-list03')[0], // 动画对象，必须
    property: 'top', // 动画属性，必须
    startPos: -65, // 动画开始位置，必须
    endPos: -1100, // 动画终止的位置，必须
    duration: 500, // 动画持续时间
    easing: 'linear', // 动画速率
    counts: 7, // 动画循环次数
    targetPos: -525,
    callback: function() {
        console.log('hello')
    }
}]

const App = function(params) {
    let game = [];

    params.forEach((item,index) => {
        game[index] = new Game(item);
    })

    document.getElementById('start').addEventListener('click',function(){
        game.forEach(item => {
            item.run();
        })
    })
}

App(params);








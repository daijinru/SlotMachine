const gulp = require('gulp');
const webpack = require('gulp-webpack');

// less 编译
const less = require('gulp-less');

// 源文件地址
const lessPath = 'dev/less/index.less';
const jsPath = 'dev/js/index.js';
const imagePath = 'dev/image/*';

// 编译后路径
const distPath = 'static/';

// Less 解析
gulp.task('less', function() {
    return gulp.src(lessPath)
        .pipe(less())
        .pipe(gulp.dest(distPath + 'css'))
})

// images
gulp.task('images', function() {
    return gulp.src(imagePath)
        .pipe(gulp.dest(distPath + 'image'));
})

// 监听
gulp.task('watch', function() {
    gulp.watch(lessPath, ['less']);
    gulp.watch(imagePath, ['images']);
})

// 默认配置
gulp.task('default', ['watch', 'images', 'less']);
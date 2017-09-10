var express = require('express');//加载express模块
var path = require('path');
var bodyParser = require('body-parser');
var port =process.env.PORT || 3000;//设置端口，process获取全局变量和外围参数
var app = express();//获取实例并赋值给一个变量app

//在pug里的路径里直接写/lib/bootstrap/dist/js/bootstrap.min.js等，
//node_modules文件夹中的bootstrap包里面的文件就会被映射，
// 因为 这个__dirname 已经是获取当前模块文件所在目录的完整绝对路径,
app.use("/lib",express.static(path.join(__dirname, 'node_modules')));
//自己写的样式存放位置
app.use(express.static(path.join(__dirname, 'public')));

app.set('views','views/pages');//视图根目录
app.set('view engine','pug');//设置默认模板引擎
app.use(bodyParser.json());
//bodyparser的作用：它用于解析客户端请求的body中的内容,内部使用JSON编码处理,url编码处理以及对于文件的上传处理
app.use(bodyParser.urlencoded({ extended: false }));//将表单中的数据进行格式化
app.listen(port);//监听端口

//index page
app.get('/',function(req,res){
    res.render('index',{
        title:'imooc 首页',
        movies:[{
            title: '机械战警',
            _id: 1,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
            title: '机械战警',
            _id: 2,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
            title: '机械战警',
            _id: 3,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
            title: '机械战警',
            _id: 4,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
            title: '机械战警',
            _id: 5,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
            title: '机械战警',
            _id: 6,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        }]
    });
});

//detail page
app.get('/movie/:id',function(req,res){
    res.render('detail',{
        title: 'imooc 详情页',
        movie: {
            doctor: '何塞帕迪利亚',
            country: '美国',
            title: '机械战警',
            year: 2014,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
            language: '英语',
            flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
            summary: '这是一部科幻片'
        }
    });
});

//admin page
app.get('/admin/movie',function(req,res){
    res.render('admin',{
        title: 'imooc 后台录入页',
        movie: {
            doctor: '',
            country: '',
            title: '',
            year:'' ,
            poster: '',
            language: '',
            flash: '',
            summary: ''
        }
    });
});

//list page
app.get('/admin/list',function(req,res){
    res.render('list',{
        title:'immoc 列表页',
        movies: [{
            title: '机械战警',
            _id: 1,
            doctor: '何塞帕迪利亚',
            country: '美国',
            year: 2014,
            language: '英语',
            flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf'
        }]
    });
});

console.log('immoc started on port:'+port);

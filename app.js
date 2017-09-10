var express = require('express');//加载express模块
var path = require('path');
var bodyParser = require('body-parser');
var mongoose=require('mongoose');
var Movie=require('./models/movie');//引入movie模型文件
var port =process.env.PORT || 3000;//设置端口，process获取全局变量和外围参数
var app = express();//获取实例并赋值给一个变量app

//连接数据库
mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost/moviesdb',{useMongoClient: true});
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
app.use(bodyParser.urlencoded({ extended: true }));//将表单中的数据进行格式化
app.locals.moment=require('moment');//locals对象用于将数据传递至所渲染的模板中
app.listen(port);//监听端口

//index page
app.get('/',function(req,res){
    Movie.fetch(function(err,movies){
        if(err){
            console.log(err);//打印错误
        }
        //用查询到的数据列表渲染首页
        res.render('index',{
            title:'imooc 首页',
            movies:movies
        });
    });
});

//从表单提交的数据的存储处理
app.post('/admin/movie/new',function(req,res){
    console.log('id:'+req.body.movie._id);
    var id=req.body.movie._id;//判断是新增的数据还是修改的数据
    var movieObj=req.body.movie;
    var _movie;
    var con = {
        doctor:movieObj.doctor,
        title:movieObj.title,
        country:movieObj.country,
        language:movieObj.language,
        year:movieObj.year,
        poster:movieObj.poster,
        flash:movieObj.flash,
        summary:movieObj.summary
    };
    if(id!==''){//修改的数据
        Movie.findOneAndUpdate({ _id: id},con,function(err,movie){
            if(err){
                console.log(err);
            }
            //更新成功后，页面跳转到电影的详情页
            res.redirect('/movie/'+movie._id);
        });
    }else{
        _movie=new Movie(con);
        _movie.save(function(err,movie){
            if(err){
                console.log(err);
            }
            //更新成功后，页面跳转到电影的详情页
            res.redirect('/movie/'+movie._id);
        });
    }
});

//detail page
app.get('/movie/:id',function(req,res){
    var id=req.params.id;
    Movie.findById(id,function(err,movie){
        res.render('detail',{
            title: 'imooc '+movie.title,
            movie: movie
        });
    })

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

//更新电影，从列表页的更新跳转过来
app.get('/admin/update/:id',function(req,res){
    var id=req.params.id;
    if(id){
        Movie.findById(id,function(err,movie){
            //将查询到数据渲染后台录入页
            res.render('admin',{
                title:'后台更新页',
                movie:movie
            });
        })
    }
});
//list page
app.get('/admin/list',function(req,res){
    Movie.fetch(function(err,movies){
        if(err){
            console.log(err);//打印错误
        }
        //用查询到的数据列表渲染首页
        res.render('list',{
            title:'imooc 列表页',
            movies:movies
        });
    });
});

//list delete movie
app.delete('/admin/list',function(req,res){
    var id = req.query.id;
    if(id){
        Movie.remove({_id:id},function(err,movie){
            if(err){
                console.log(err);
            }else{
                res.json({success:1});
            }
        });
    }
});

console.log('immoc started on port:'+port);

// const server = require('./server.js')

// server.start();
//
const express = require("express");
const fs = require("fs");
const bodyParser = require('body-parser');
const multer = require("multer");
const app = express();
app.use(express.static('public'));
// const urlencodedParser = bodyParser.urlencoded({ extended: true,limit:1024*1024*20,type:'application/x-www-form-urlencoding'})
app.use(bodyParser.urlencoded({ extended: true,limit:1024*1024*20,type:'application/x-www-form-urlencoding' }));
app.use(bodyParser.json({limit: '50mb'}));
const MongoClient = require('mongodb').MongoClient;
const DB_CONN_STR = 'mongodb://localhost:27017/file_uploads'; // 数据库为 runoob

// const upload = multer({ dest: 'uploads'})
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    // cb(null, file.fieldname + '-' + Date.now())
    // var fileFormat = (file.originalname).split(".");
    // cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    cb(null, Date.now() + '-' + file.originalname);
  }
})

var upload = multer({ storage: storage })

app.get('/', function (request, response) {
    // console.time("计时");
    // fs.readFile("./index.html", 'utf-8', function (err, data) {
    //         if (err) {
    //             response.writeHead(404, {'Content-Type': 'text/html', 'charset': 'utf-8'});
    //         } else {
    //             response.writeHead(200, {"Content-Type": "text/html", "charset": "utf-8"});
    //             response.write(data);
    //             console.log("成功返回 index.html 文件");
    //         }
    //             response.end();
    //             console.timeEnd("读取 index.html 计时");
    //     });
    response.sendFile( __dirname + "/" + "index.html" );
})

//  POST 请求
app.post('/upload', upload.array('file', 2),function (request, response) {
    console.log("收到主页文件上传 POST 请求！");
    console.log("request.body.file: " + request.body.file);
    console.log("request.files: " + request.files);
    console.log(request.files);
    // response.send('服务器收到主页文件上传 POST 请求！');
    const files = request.files;
    for (let i = files.length - 1; i >= 0; i--) {
        console.log("===========" + i + "===========");
        console.log('文件类型：%s', files[i].mimetype);
        console.log('原始文件名：%s', files[i].originalname);
        console.log('文件名 filename: %s', files[i].filename);
        console.log('文件大小：%s', files[i].size);
        console.log('文件保存路径：%s', files[i].path);
        console.log("===========" + i + "===========");
    }
    let filesInUploads= [];

    fs.readdir( './uploads', function (err, readedFiles) {
        if (err) {
            console.log(err.stack);
        } else {
            filesInUploads = readedFiles;
            response.write(filesInUploads.toString());
            readedFiles.forEach(function(file) {
                console.log(file);
            });
        }
        response.end();
    });

    // response.end( JSON.stringify( response ) );

});


app.get('/download', function (request, response) {
    fs.readFile('download.html', function(err,data) {
        if (err) {
            console.log(err.stack);
        }
    })
});

const server = app.listen(8081, function () {

  const host = server.address().address
  const port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})



const insertData = function(db, callback) {
    //连接到表 site
    const collection = db.collection('fileList');
    //插入数据
    const data = [{"name":"菜鸟教程","url":"www.runoob.com"},{"name":"菜鸟工具","url":"c.runoob.com"}];
    collection.insert(data, function(err, result) {
        if(err)
        {
            console.log('Error:'+ err);
            return;
        }
        callback(result);
    });
}

const selectData = function(db, callback) {
  //连接到表
  const collection = db.collection('fileList');
  //查询数据
  const whereStr = {"name":'菜鸟教程'};
  collection.find(whereStr).toArray(function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }
    callback(result);
  });
}

const updateData = function(db, callback) {
    //连接到表
    const collection = db.collection('fileList');
    //更新数据
    const whereStr = {"name":'菜鸟教程'};
    const updateStr = {$set: { "url" : "https://www.runoob.com" }};
    collection.update(whereStr,updateStr, function(err, result) {
        if(err)
        {
            console.log('Error:'+ err);
            return;
        }
        callback(result);
    });
}

const delData = function(db, callback) {
  //连接到表
  const collection = db.collection('site');
  //删除数据
  const whereStr = {"name":'菜鸟工具'};
  collection.remove(whereStr, function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }
    callback(result);
  });
}

// MongoClient.connect(DB_CONN_STR, function(err, db) {
//     console.log("数据库连接成功！");
    // insertData(db, function(result) {
    //     console.log(result);
    //     db.close();
    // });

    // selectData(db, function(result) {
    //     console.log(result);
    //     db.close();
    // });

    // updateData(db, function(result) {
    //     console.log(result);
    //     db.close();
    // });

    // delData(db, function(result) {
    //     console.log(result);
    //     db.close();
    // });

// });

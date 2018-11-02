import Koa from 'koa';
// import Router from 'koa-router';
import render from 'koa-swig';
import serve from 'koa-static';
import log4js from 'log4js';
import co from 'co';
import path from 'path';
import './utils/excelUtils';
import {
  createContainer,
  Lifetime
} from 'awilix';
import {
  scopePerRequest,
  loadControllers
} from 'awilix-koa';
import Sequelize from 'sequelize';
import SendBirthday from './tasks/SendBirthday';
import {
  ErrorHandle
} from './middlewares/ErrorHandle';
// import initController from './controllers';
import config from './config';

const app = new Koa();
// const router = new Router();
// 错误处理 log4js日志
log4js.configure({
  'appenders': {
    'serve': {
      'type': 'file',
      'filename': path.join(__dirname, 'logs/node-app.log')
    },
    'birth': {
      'type': 'file',
      'filename': path.join(__dirname, 'logs/birthday.log')
    }
  },
  'categories': {
    'default': {
      'appenders': ['serve'],
      'level': 'error'
    },
    'birth': {
      'appenders': ['birth'],
      'level': 'info'
    }
  }
});

ErrorHandle.error(app, log4js.getLogger('serve'));
// 数据库连接
const sequelize = new Sequelize('bling', 'root', 'MyNewPass4!', {
  'host': '47.107.129.12',
  'port': 3306,
  'dialect': 'mysql',
  'pool': {
    'max': 5,
    'min': 0,
    'acquire': 30000,
    'idle': 10000
  }
});
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
const Staff = sequelize.define('bl_staff', {
  'staff_name': {
    'type': Sequelize.STRING(20)
  },
  'department_name': {
    'type': Sequelize.STRING(50)
  },
  'position_name':{
    'type':Sequelize.STRING(50)
  },
  'birthday':{
    'type':Sequelize.STRING(10)
  },
  'birthday_type':{
    'type':Sequelize.INTEGER
  },
  'is_leave':{
    'type':Sequelize.INTEGER,
    'defaultValue':0
  },
  'is_del':{
    'type':Sequelize.INTEGER,
    'defaultValue':0
  }
});
Staff.sync();
// User.create({
//   'firstName': 'John',
//   'lastName': 'Hancock'
// });
// var users = yield User.bulkCreate(
//   [
//       {'emp_id': 'a', 'nick': 'a'},
//       {'emp_id': 'b', 'nick': 'b'},
//       {'emp_id': 'c', 'nick': 'c'}
//   ]
// );
/* eslint-disable no-new */
new SendBirthday(log4js.getLogger('birth'));
// 静态资源
app.use(serve(
  config.assetsDir, {
    'maxage': 0, // Browser cache max-age in milliseconds. defaults to 0
    'hidden': false, // Allow transfer of hidden files. defaults to false
    'index': 'index.html', // Default file name, defaults to 'index.html'
    'defer': false, // If true, serves after return next(), allowing any downstream middleware to respond first.
    'gzip': true, //  Try to serve the gzipped version of a file automatically when gzip is supported by a client and if the requested file with .gz extension exists. defaults to true.
    'br': true, //  Try to serve the brotli version of a file automatically when brotli is supported by a client and if the requested file with .br
    setHeaders(res) {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }, // extension exists (note, that brotli is only accepted over https). defaults to true.
    'extensions': ['.html', '.jpeg'] // Try to match extensions from passed array to search for file when no extension is sufficed in URL. First found is served. (defaults to false)
  }));

// 模板引擎
app.context.render = co.wrap(render({
  'root': config.viewDir,
  'autoescape': true,
  'cache': 'memory', // disable, set to false
  'ext': 'html',
  'writeBody': false
}));

// 初始化路由
const container = createContainer();
app.use(scopePerRequest(container));
container.loadModules([__dirname + '/models/*.js'], {
  'formatName': 'camelCase',
  'resolverOptions': {
    'lifetime': Lifetime.SCOPED
  }
});
app.use(loadControllers('controllers/*.js', {
  'cwd': __dirname
}));
// initController(app, router);

app.listen(config.port, () => {
  console.log(`server is on ${config.port}`);
});

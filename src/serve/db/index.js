import Sequelize from 'sequelize';
import StaffModel from './StaffModel';
// 数据库连接
export const init = () => {
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
  sequelize.define('staff', StaffModel);
  // console.log(sequelize.models);
  sequelize.sync();
  return sequelize;
};
// (async () => {
//   await sequelize.sync({'force':true});
//   sequelize.models['bl_staff'].create({ 'staff_name': 'victor', 'birthday': '2018-01-01'});
// })();

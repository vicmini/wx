import Sequelize from 'sequelize';
export default {
  'staff_name': {
    'type': Sequelize.STRING(20)
  },
  'department_name': {
    'type': Sequelize.STRING(50)
  },
  'position_name': {
    'type': Sequelize.STRING(50)
  },
  'birthday': {
    'type': Sequelize.STRING(10)
  },
  'birthday_type': {
    'type': Sequelize.INTEGER
  },
  'is_leave': {
    'type': Sequelize.INTEGER,
    'defaultValue': 0
  },
  'is_del': {
    'type': Sequelize.INTEGER,
    'defaultValue': 0
  }
};

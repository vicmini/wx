import * as schedule from 'node-schedule';
import moment from 'moment';
import solarLunar from 'solarlunar';
import WxUtil from '../utils/WxUtil';
import AliyunDMUtil from '../utils/emailService';
import {
  Op
} from 'sequelize';
export default class SendBirthday {
  constructor(sequelize, logger) {
    const corn = new schedule.RecurrenceRule();
    corn.hour = 8;
    corn.minute = 0;
    corn.second = 0;
    const scheduleInfo = {
      corn,
      'name': '推送生日信息'
    };
    this.dbModels = sequelize.models;
    this.logger = logger; // 日志
    this.scheduleInfo = scheduleInfo; // 定时任务设置
    this.wxUtil = new WxUtil(); // 微信api
    // this.start(); // 开始定时任务
  }
  _exeTask() {
    this.logger.info(`开始执行定时任务${this.scheduleInfo.name},执行时间${moment().format('YYYY-MM-DD HH:mm:ss dddd')}`);
    return schedule.scheduleJob(this.scheduleInfo.corn, async () => {
      await this.task();
      this.logger.info(`生日信息推送成功,执行时间${moment().format('YYYY-MM-DD HH:mm:ss dddd')}`);
    });
  }
  start() {
    this._exeTask();
  }
  async task() {
    let sendStr = ''; // 需要推送的消息
    // 得到今天公历日期
    const todayG = moment().format('YYYY-MM-DD');
    const year = moment().year();
    const month = moment().month() + 1;
    const date = moment().date();
    // console.log(todayG);
    // 得到今天的农历日期
    const solar2lunarData = solarLunar.solar2lunar(year, month, date); // 输入的日子为公历
    let todayL = `${solar2lunarData.lYear}-${solar2lunarData.lMonth}-${solar2lunarData.lDay}`;
    todayL = moment(todayL, 'YYYY-M-D').format('YYYY-MM-DD');
    const data = await this.dbModels['staff'].findAll({
      'where': {
        [Op.or]: [{
          'birthday': todayG,
          'birthday_type': 1,
          'is_del': 0
        }, {
          'birthday': todayL,
          'birthday_type': 2,
          'is_del': 0
        }]
      }
    });
    for (const staff of data) {
      let type = '';
      if (staff['birthday_type'] === 1) {
        type = '公历';
      } else if (staff['birthday_type'] === 2) {
        type = '农历';
      }
      sendStr += `${staff['staff_name']}(${type} ${staff['birthday']}),`;
    }
    if (sendStr) {
      sendStr = sendStr.substring(0, sendStr.length - 1);
    } else {
      sendStr = '今天没有人';
    }
    this.wxUtil.sendMsg(sendStr);
    AliyunDMUtil.sendMessage(sendStr);
  }
}

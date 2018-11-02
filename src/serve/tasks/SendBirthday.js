import * as schedule from 'node-schedule';
import moment from 'moment';
import WxUtil from '../utils/WxUtil';
export default class SendBirthday{
  constructor(logger) {
    const corn = new schedule.RecurrenceRule();
    // corn.hour = 8;
    // corn.minute = 1;
    corn.second = 2;
    const scheduleInfo = {
      corn,
      'name': '推送生日信息'
    };
    this.logger = logger;
    this.scheduleInfo = scheduleInfo;
    this.wxUtil = new WxUtil();
    this.start();
  }
  _exeTask() {
    this.logger.info(`开始执行定时任务${this.scheduleInfo.name},执行时间${moment().format('YYYY-MM-DD HH:mm:ss dddd')}`);
    return schedule.scheduleJob(this.scheduleInfo.corn, async() => {
      await this.task();
      this.logger.info(`生日信息推送成功,执行时间${moment().format('YYYY-MM-DD HH:mm:ss dddd')}`);
    });
  }
  start() {
    this._exeTask();
  }
  task() {
    // this.wxUtil.sendMsg();
  }
}

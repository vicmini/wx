import * as schedule from 'node-schedule';
import * as moment from 'moment';
export default class AbstractSchedule {
  constructor(app, scheduleInfo) {
    this.app = app;
    this.scheduleInfo = scheduleInfo;
  }
  _exeTask() {
    this.app.log.info(`开始执行定时任务${this.scheduleInfo.name},执行时间${moment().format('YYYY-MM-DD HH:mm:ss dddd')}`);
    return schedule.scheduleJob(this.scheduleInfo.corn, () => {
      this.task();
    });
  }
  start() {
    this._exeTask();
  }
  task(){

  }

}

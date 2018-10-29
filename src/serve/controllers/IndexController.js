import {
  route,
  GET
  // POST,
  // before
} from 'awilix-koa';

class IndexController {
  constructor({
    indexModel,
    wxModel
  }) {
    this.indexModel = indexModel;
    this.wxModel = wxModel;
  }
  @route('/test')
  @GET()
  async indexAction(ctx) {
    ctx.body = 'Hello World!';
  }
  @route('/index')
  @GET()
  async homepageAction(ctx) {
    this.wxModel.getToken()
      .then((res) => {
        console.log(res);
        ctx.body = 'ok';
      });

  }
}
export default IndexController;

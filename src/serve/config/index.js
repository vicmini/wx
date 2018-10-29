import path from 'path';

let config = {
  'viewDir': path.join(__dirname, '../views'),
  'assetsDir': path.join(__dirname, '../assets'),
  'wxApi': 'https://api.weixin.qq.com'
};

const init = () => {
  if (process.env.NODE_ENV === 'development') {
    const localConfig = {
      'port': 8081,
      'appID': 'wx86e125ad7bf4316b',
      'appsecret': '3f8736adc135669dde26602c7750ca14'
    };
    config = Object.assign(config, localConfig);
  }
  if (process.env.NODE_ENV === 'production') {
    const proConfig = {
      'port': 80,
      'appID': 'wx86e125ad7bf4316b',
      'appsecret': '3f8736adc135669dde26602c7750ca14'
    };
    config = Object.assign(config, proConfig);
  }
  return config;
};

const result = init();
export default result;

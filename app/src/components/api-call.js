import Request from 'request';
const apiHost = 'http://'+window.location.hostname+':8030';

export const requestAPI = (requestOption,callback) => {
  Request.post({
    url: apiHost+requestOption.path,
    json: requestOption.json
  }, callback);
}
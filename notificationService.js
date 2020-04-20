import axios from 'axios';
import { Notification } from 'element-ui';

let ready = false;
function getReady() {
  if (ready) {
    return Promise.resolve(ready);
  }
  return axios({
    url: `http://${document.location.host}/api/websocket/prepare/try`,
    method: 'get',
    params: {},
    errorTips: false,
  }).then(() => {
    ready = true;
  });
}

function showTips(data) {
  Notification({
    title: data.title || '提示',
    message: data.message,
    type: data.type || 'info',
    duration: 10000,
  });
}

let websocketLink = null;
function closeLink() {
  if (websocketLink !== null) {
    websocketLink.close();
    websocketLink = null;
  }
}
function setLink() {
  if (websocketLink !== null) {
    return Promise.resolve(websocketLink);
  }
  const retryInterval = 3 * 60 * 1000;
  let websocket = new WebSocket(`ws://${document.location.host}/api/websocket/conn`);
  websocket.addEventListener('open', () => {
    websocketLink = websocket;
  });
  websocket.addEventListener('error', () => {
    // 链接失败，关闭，会触发close事件
    closeLink();
  });
  websocket.addEventListener('close', () => {
    closeLink();
    setTimeout(setLink, retryInterval);
  });
  websocket.addEventListener('message', (event) => {
    try {
      showTips(JSON.parse(event.data));
    } catch (error) {
      console.log('消息无法识别');
    }
  });
  const keepAliveInterval = 30 * 60 * 1000;
  let timer = setInterval(() => {
    if (websocket.readyState === WebSocket.OPEN) {
      websocket.send('i am alive');
    } else {
      clearInterval(timer);
    }
  }, keepAliveInterval);
}

export default {
  connect() {
    return getReady().then(setLink);
  },
  close() {
    ready = false;
    closeLink();
  },
};

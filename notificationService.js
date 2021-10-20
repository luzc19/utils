import axios from 'axios';

function checkAvailable() {
  // 先检查浏览器是否支持
  if (!('Notification' in window)) {
    console.warn('浏览器不支持通知功能');
    return Promise.reject(new Error('浏览器不支持通知功能'));
  }
  if (Notification.permission === 'granted') {
    return Promise.resolve(true);
  }
  if (Notification.permission !== 'denied') {
    // 否则我们需要向用户获取权限
    return Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        return true;
      }
      return Promise.reject(new Error('用户拒绝显示通知'));
    });
  }
  return Promise.resolve();
}
export function send(title, option) {
  checkAvailable()
    .then(() => {
      console.log('send then');
      new Notification(title, option);
    })
    .catch((error) => {
      console.error(error);
    });
}
function showTips(data) {
  // 提示示例，可以使用各种UI库的notification，也可以使用浏览器的API Notification
  send(data.title || '提示', {
    body: data.message,
  });
}

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
  let websocket = new WebSocket(
    `ws://${document.location.host}/api/websocket/conn`,
  );
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
      console.error('消息无法识别');
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

const op = {
  connect() {
    return getReady().then(setLink);
  },
  close() {
    ready = false;
    closeLink();
  },
};

export default op;

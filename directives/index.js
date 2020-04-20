import UserModule from '@/components/UserModule';
import moment from '@/components/moment';

function install(Vue) {
  Vue.directive('permission', {
    bind(el, binding) {
      const element = el;
      element.hidden = true;
      UserModule.getPermissionCodes().then((permissionCodes) => {
        if (permissionCodes[binding.value]) {
          element.hidden = false;
        }
      });
    },
  });

  Vue.directive('enterNumber', {
    inserted: function (el) {
      el.addEventListener('keypress', (e) => {
        e = e || window.event; // eslint-disable-line
        let charcode = typeof e.charCode == 'number' ? e.charCode : e.keyCode;
        let re = /\d/;
        if (!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey) {
          if (e.preventDefault) {
            e.preventDefault();
          } else {
            e.returnValue = false;
          }
        }
      });
    },
  });

  Vue.directive('enterFloat', {
    inserted: function (el) {
      el.addEventListener('keypress', (e) => {
        e = e || window.event; // eslint-disable-line
        let charcode = typeof e.charCode == 'number' ? e.charCode : e.keyCode;
        let re = /\d/;
        if (charcode == 46) {
          if (el.value.includes('.')) {
            e.preventDefault();
          }
        } else if (!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey) {
          if (e.preventDefault) {
            e.preventDefault();
          } else {
            e.returnValue = false;
          }
        }
      });
    },
  });
  Vue.directive('cty-close', {
    bind(el) {
      el.addEventListener('click', () => {
        window.top.eventCenter.$emit('closePage', document.location.hash.slice(1));
      });
    },
  });

  Vue.filter('formatTime', (timeStmp) => {
    if (timeStmp === null || timeStmp === undefined) {
      return '';
    }
    return moment(timeStmp).format('yyyy-MM-dd hh:mm:ss');
  });

  Vue.filter('formatDate', (timeStmp) => {
    if (timeStmp === null || timeStmp === undefined) {
      return '';
    }
    return moment(timeStmp).format('yyyy-MM-dd');
  });

  Vue.filter('formatBigNum', (num) => {
    let number = Number(num);
    if (Number.isNaN(number)) return num;
    return number.toLocaleString(undefined, { maximumFractionDigits: 2 });
  });
  // 货币格式化
  Vue.filter('formatMoney', (num) => {
    let number = Number(num);
    if (Number.isNaN(number)) return num;
    if (Math.floor(number) === number) return number.toLocaleString(undefined, { maximumFractionDigits: 0 }) + '.00';
    return number.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  });
}

export default {
  install,
};

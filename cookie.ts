export function setCookie(key: string, val: string, duration: number = 0, path: string = '/'): void {
  const expiresDate = new Date(Date.now() + duration);
  let cookieStr = `${key}=${escape(val)};`;
  if (duration !== 0) {
    cookieStr += `expires=${expiresDate.toUTCString()};`;
  }
  if (path) {
    cookieStr += ` path=${path}`;
  }
  document.cookie = cookieStr;
}

export function getCookie(key: string): string {
  if (document.cookie.length === 0) return '';
  let cStart = document.cookie.indexOf(`${key}=`);
  let cEnd = -1;
  if (cStart !== -1) {
    cStart = cStart + key.length + 1;
    cEnd = document.cookie.indexOf(';', cStart);
    if (cEnd === -1) {
      cEnd = document.cookie.length;
    }
    return unescape(document.cookie.substring(cStart, cEnd));
  }
  return '';
}

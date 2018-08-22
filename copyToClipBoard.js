function copy(str) {
  let inputElement = document.createElement('input');
  document.body.appendChild(inputElement);
  inputElement.setAttribute('value', str);
  inputElement.setAttribute('readonly', 'readonly');
  inputElement.select();
  try {
    document.execCommand('copy');
    document.body.removeChild(inputElement);
    return true;
  } catch (error) {
    return false;
  }
}
export default copy;

export function getIndex(arr, k, v) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][k] === v) {
      return i;
    }
  }
}

export function getNameFormCode(arr, code) {
  if (code === '100000') {
    return '不限';
  }

  const mainCode = code.slice(0, 3);
  const subCode = code.slice(3, 6);
  let armyType = '';
  let service = '';
  arr.forEach(item => {
    const _mainCode = item.code.slice(0, 3);
    if (mainCode === _mainCode) {
      armyType = item.name;
      item.sub.forEach(sub => {
        const _subCode = sub.code.slice(3, 6);
        if (subCode === _subCode) {
          service = sub.name;
        }
      });
    }
  });
  return armyType + service;
}

export function formData(body: object): FormData {
  const _formData: FormData = new FormData();
  for (const kn in body) {
    if (body) {
      _formData.append(kn, body[kn] === undefined ? '' : body[kn]);
    }
  }
  return _formData;
}

export function formDataToUrl(body: object, ifFist?: boolean): string {
  let str = '';
  for (const keyName in body) {
    if (!str && ifFist) {
      str = '?' + keyName + '=' + (body[keyName] === undefined ? '' : encodeURI(encodeURI(body[keyName])));
    } else {
      str = str + '&' + keyName + '=' + (body[keyName] === undefined ? '' : encodeURI(encodeURI(body[keyName])));
    }
  }
  return str;
}

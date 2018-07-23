salaries = (function () {
  const arr = [];
  for (let i = 1; i < 50; i++) {
    const obj = {};
    obj['name'] = i;
    obj['code'] = i;
    const sub = [];
    for (let j = i + 1; j <= i * 2; j++) {
      const subObj = {};
      subObj['name'] = j;
      subObj['code'] = j;
      sub.push(subObj);
    }
    obj['sub'] = sub;
    arr.push(obj);
  }

  console.log(arr);
})();

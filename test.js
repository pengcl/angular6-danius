const trap = function (heights) {
  let _height = 0;
  let result = 0;
  let startIndex = 0, endIndex = 0;
  heights.forEach((height, i) => {
    if (height < _height) {
      startIndex = i;
    } else {

    }
  });
  console.log(result);
  return result;
};
//[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]
trap([0, 1, 0]);

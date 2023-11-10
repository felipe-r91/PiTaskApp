export function randomColor(){
  let result = '';
  for (let i = 0; i < 6; ++i) {
    const value = Math.floor(16 * Math.random());
    result += value.toString(16);
  }
  const userColor = '#' + result
  return  {userColor} 
};
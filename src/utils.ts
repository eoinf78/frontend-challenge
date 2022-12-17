
export const capitalizeFirstLetter = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export const getAverage = (ability: number, len: number) => {
  const avg = ability / len;
  const isWholeNumber = (avg - Math.floor(avg)) === 0;
  return isWholeNumber ? avg.toString() : (avg).toFixed(2);
}
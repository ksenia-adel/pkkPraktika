export function getCurrentDate(extractedYears = 0) {
  let newDate = new Date();
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();

  return `${year + extractedYears}-${month < 10 ? `0${month}` : `${month}`}-${
    date < 10 ? `0${date}` : `${date}`
  }`;
}

export function getCurrentYear() {
  let newDate = new Date();
  let year = newDate.getFullYear();

  return year;
}

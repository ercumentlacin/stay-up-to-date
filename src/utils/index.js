const dateFormater = (date) => {
  const dateArr = date?.split(', ');
  const dateForm = `${dateArr[0].replace(/\D/gi, '')}-${
    dateArr[1]?.split(' ')[2]
  }-${dateArr[2]}`;

  if (dateArr.length === 2) {
    return new Date(dateArr).toLocaleDateString('en-us');
  }

  return new Date(dateForm).toLocaleDateString('en-us');
};

module.exports = {
  dateFormater,
};

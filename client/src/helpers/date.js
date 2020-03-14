import _ from 'underscore';

export const dateFormat = (date) => {
  const dateStr = String(date || '');

  if (!dateStr) {
    return dateStr;
  }

  return String(dateStr.slice(0, 10) || '')
    .replace(/^(\d\d)(\d)$/g, '$1/$2')
    .replace(/^(\d\d\/\d\d)(\d+)$/g, '$1/$2');
};

export const dateTimeFormat = (date) => {
  const dateStr = String(date || '');

  if (!dateStr.trim()) {
    return dateStr.trim();
  }

  const formatedDate = String(dateStr.slice(0, 10) || '')
    .replace(/^(\d\d)(\d)$/g, '$1/$2')
    .replace(/^(\d\d\/\d\d)(\d+)$/g, '$1/$2');

  const formatedTime = String(dateStr.slice(11, 19) || '')
    .replace(/^(\d\d)(\d)$/g, '$1:$2')
    .replace(/^(\d\d:\d\d)(\d+)$/g, '$1:$2');

  if (dateStr.charAt(dateStr.length) === ' ') {
    return dateStr;
  }

  if (dateStr.length <= 10) {
    return formatedDate;
  }

  if (dateStr.length <= 19) {
    return `${formatedDate} ${formatedTime}`;
  }

  return `${formatedDate} ${formatedTime} ${dateStr.slice(20, 22)}`;
};

const validDateCondition = (date) => !(
  Array.from(date).filter((w) => w !== '/').find(_.isNaN)
  || Array.from(date).filter((w) => w === '/').length > 2
  || String(date).split('/').pop().length > 4
  || String(date).split('/').pop() === '0000'
);

const validTimeCondition = (date) => !(
  Array.from(date.split(' ')[0]).filter((w) => w !== ':').find(_.isNaN)
  || Array.from(date.split(' ')[0]).filter((w) => w === ':').length > 2
  || _.isUndefined(date.split(' ')[1])
);

const validDateTimeCondition = (date) => !(
  !validDateCondition(date.slice(0, 10))
  || !validTimeCondition(date.slice(11))
);

const validDateConditions = {
  date: validDateCondition,
  time: validTimeCondition,
  dateTime: validDateTimeCondition,
};


export default {
  dateFormat,
  dateTimeFormat,
  validDateCondition,
  validTimeCondition,
  validDateTimeCondition,
  validDateConditions,
};

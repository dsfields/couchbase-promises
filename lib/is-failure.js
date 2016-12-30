'use strict';

const hasCode = (err) => {
  return (typeof err === 'object'
          && (err.hasOwnProperty('code') || 'code' in err)
  );
};

module.exports = (err) => {
  const type = typeof err;
  if (type === 'string' || type === 'symbol' || type === 'function')
    throw new TypeError(`The arg err can't be of type "${type}."`);

  return (type !== 'undefined'
    && err !== null
    && !(hasCode(err) && err.code === 0)
    && err !== false
    && err !== 0);
};

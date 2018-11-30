'use strict';


const hasProp = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);


const hasCode = err => typeof err === 'object' && (hasProp(err, 'code') || 'code' in err);


module.exports = (err) => {
  const type = typeof err;

  if (type === 'string' || type === 'symbol' || type === 'function') {
    throw new TypeError(`The arg err can't be of type "${type}."`);
  }

  return (type !== 'undefined'
    && err !== null
    && !(hasCode(err) && err.code === 0)
    && err !== false
    && err !== 0);
};

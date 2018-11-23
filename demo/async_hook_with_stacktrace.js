const ah = require('async_hooks');
const {EOL} = require('os');
const w = (v) => process._rawDebug(v);
Error.stackTraceLimit = 20;
ah.createHook({
  init(id, type, triggerId, resource) {
    const e = {};
    Error.captureStackTrace(e);
    const at = e.stack.split(EOL).filter(v =>
      v.includes(' (/') && !v.includes('at AsyncHook.init'));
    w(`${type} ${id} created in ${triggerId} ${at}`);
  },
  before(id) {w(`before ${id} callback in ${ah.executionAsyncId()}`)},
  after(id) {w(`after ${id} callback in ${ah.executionAsyncId()}`)},
  destroy(id) {w(`${id} destroy in ${ah.executionAsyncId()}`)},
  promiseResolve(id) {w(`PROMISE ${id} resolved`)}
}).enable();

// ex1
setImmediate(() => {});
console.log();

// ex2
/*
const fetch = require('node-fetch');
const {readFile} = require('fs').promises;
Promise.all([
  fetch('https://www.yahoo.co.jp'),
  readFile(__filename),
]);
*/

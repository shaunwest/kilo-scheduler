/**
 * Created by Shaun on 5/31/14.
 */

register('Scheduler', ['HashArray', 'Util'], function(HashArray, Util) {
  'use strict';

  var ONE_SECOND = 1000,
    targetFps,
    actualFps,
    ticks,
    running,
    elapsedSeconds,
    registeredCallbacks,
    lastRegisteredId,
    lastUid,
    oneSecondTimerId,
    frameTimerId,
    lastUpdateTime,
    obj;

  init();

  function init() {
    reset();
    start();
    return obj;
  }

  function reset() {
    targetFps = 60;
    actualFps = 0;
    ticks = 0;
    elapsedSeconds = 0;
    lastRegisteredId = 0;
    lastUid = 0;
    registeredCallbacks = new HashArray();
    running = false;
    lastUpdateTime = new Date();
    return obj;
  }

  function register(callback, id) {
    if(!Util.isFunction(callback)) {
      Util.error('Scheduler: only functions can be registered.');
    }
    if(!id) {
      id = Util.getGID(id);
    }

    registeredCallbacks.set(id, callback);

    return id;
  }

  function registerAfter(afterId, callback, id) {
    if(!id) {
      id = lastRegisteredId++;
    }
    registeredCallbacks.splice(afterId, id, callback);
    return id;
  }

  function unRegister(id) {
    registeredCallbacks.remove(id);
    return obj;
  }

  function getRegistered(id) {
    return (id) ? registeredCallbacks.get(id) : registeredCallbacks.getValues();
  }

  function requestNextFrame() {
    frameTimerId = window.requestAnimationFrame(onFrame);
  }

  function registeredCount() {
    return registeredCallbacks.size();
  }

  function start() {
    if(!running) {
      running = true;
      oneSecondTimerId = window.setInterval(onOneSecond, ONE_SECOND);
      onFrame();
    }
    return obj;
  }

  function stop() {
    running = false;
    window.clearInterval(oneSecondTimerId);
    window.cancelAnimationFrame(frameTimerId);
    return obj;
  }

  function onFrame() {
    executeFrameCallbacks(getDeltaTime());
    tick();

    if(running) {
      requestNextFrame();
    }
  }

  function executeFrameCallbacks(deltaTime) {
    var items, numItems, item, i;

    items = registeredCallbacks.getValues();
    numItems = items.length;

    for(i = 0; i < numItems; i++) {
      item = items[i];
      if(item) {
        item(deltaTime);
      }
    }
  }

  function getDeltaTime() {
    var now = +new Date(),
      elapsed = (now - lastUpdateTime) / ONE_SECOND;

    lastUpdateTime = now;

    return elapsed;
  }

  function tick() {
    ticks++;
  }

  function onOneSecond() {
    actualFps = ticks.toString();
    ticks = 0;
    elapsedSeconds++;
  }

  function getFps() {
    return actualFps;
  }

  function getSeconds() {
    return elapsedSeconds;
  }

  obj = {
    __mixin: false,
    init: init,
    reset: reset,
    start: start,
    stop: stop,
    register: register,
    registerAfter: registerAfter,
    unRegister: unRegister,
    getRegistered: getRegistered,
    registeredCount: registeredCount,
    getFps: getFps,
    getSeconds: getSeconds
  };

  return obj;
});
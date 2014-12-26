/**
 * Created by Shaun on 6/7/14.
 */

register('SchedulerObject', ['Util', 'Scheduler', 'Func'], function(Util, Scheduler, Func) {
  'use strict';

  return {
    onFrame: function(callback, id) {
      var gid = Util.getGID(id);

      if(!this.schedulerIds) {
        this.schedulerIds = [];
      }
      if(!this.hooks) {
        this.hooks = {};
      }

      callback = callback.bind(this);
      if(id) {
        this.hooks[id] = gid;
      }
      this.schedulerIds.push(Scheduler.register(callback, gid));
      return this;
    },
    getSchedulerId: function(hookId) {
      if(!this.hooks) {
        return null;
      }
      return this.hooks[hookId];
    },
    // wraps an existing Scheduler task
    hook: function(id, wrapper) {
      var f, schedulerId = this.getSchedulerId(id);
      if(schedulerId) {
        f = Scheduler.getRegistered(schedulerId);
        f = Func.wrap(f, wrapper);
        Scheduler.register(f, schedulerId);
      }
      return this;
    },
    killOnFrame: function(schedulerId) {
      if(schedulerId) {
        Scheduler.unRegister(schedulerId);
      } else if(this.schedulerIds) {
        this.schedulerIds.forEach(function(schedulerId) {
          Scheduler.unRegister(schedulerId);
        });
      }

      return this;
    }
  };
});
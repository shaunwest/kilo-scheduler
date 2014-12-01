/**
 * Created by Shaun on 6/7/14.
 */

kilo('SchedulerObject', ['Util', 'Scheduler', 'Func'], function(Helper, Chrono, Func) {
  'use strict';

  return {
    onFrame: function(callback, id) {
      var gid = Helper.getGID(id);

      if(!this.chronoIds) {
        this.chronoIds = [];
      }
      if(!this.hooks) {
        this.hooks = {};
      }

      callback = callback.bind(this);
      if(id) {
        this.hooks[id] = gid;
      }
      this.chronoIds.push(Chrono.register(callback, gid));
      return this;
    },
    getChronoId: function(hookId) {
      if(!this.hooks) {
        return null;
      }
      return this.hooks[hookId];
    },
    // wraps an existing chrono task
    hook: function(id, wrapper) {
      var f, chronoId = this.getChronoId(id);
      if(chronoId) {
        f = Chrono.getRegistered(chronoId);
        f = Func.wrap(f, wrapper);
        Chrono.register(f, chronoId);
      }
    },
    killOnFrame: function(chronoId) {
      if(chronoId) {
        Chrono.unRegister(chronoId);
      } else if(this.chronoIds) {
        this.chronoIds.forEach(function(chronoId) {
          Chrono.unRegister(chronoId);
        });
      }

      return this;
    }
  };
});
/**
 * Created by Shaun on 6/7/14.
 */

jack2d('chronoObject', ['helper', 'chrono', 'func'], function(Helper, Chrono, Func) {
  'use strict';

  return {
    onFrame: function(func, id) {
      var gid = Helper.getGID(id);

      if(!this.chronoIds) {
        this.chronoIds = [];
      }
      if(!this.hooks) {
        this.hooks = {};
      }

      func = func.bind(this);
      this.hooks[id] =  gid;
      this.chronoIds.push(Chrono.register(func, gid));
      return this;
    },
    getChronoId: function(hookId) {
      if(!this.hooks) {
        return null;
      }
      return this.hooks[hookId];
    },
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
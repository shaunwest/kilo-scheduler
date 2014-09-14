/**
 * Created by Shaun on 6/7/14.
 */

jack2d('chronoObject', ['helper', 'chrono', 'HashArray'], function(helper, chrono, HashArray) {
  'use strict';

  return {
    onFrame: function(func, id) {
      if(!this.chronoIds) {
        this.chronoIds = [];
      }
      this.chronoIds.push(chrono.register(func.bind(this), id));
      return this;
    },
    killOnFrame: function(id) {
      if(id) {
        chrono.unRegister(id);
      } else if(this.chronoIds) {
        this.chronoIds.forEach(function(chronoId) {
          chrono.unRegister(chronoId);
        });
      }

      return this;
    }
  };
});
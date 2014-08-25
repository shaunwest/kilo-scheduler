/**
 * Created by Shaun on 6/7/14.
 */

jack2d('chronoObject', ['helper', 'chrono', 'HashArray'], function(helper, chrono, HashArray) {
  'use strict';

  return {
    onFrame: function(func, id) {
      if(!this.chronoId) {
        this.lastFunctionId = 0;
        this.chronoFunctions = new HashArray();
        this.chronoId = chrono.register(helper.call(this, function(deltaSeconds) {
          var functions, numFunctions, i;
          functions = this.chronoFunctions.items;
          numFunctions = functions.length;
          for(i = 0; i < numFunctions; i++) {
            functions[i](deltaSeconds);
          }
        }), this.chronoId);
      }

      if(!id) {
        id = ++this.lastFunctionId;
      }
      this.chronoFunctions.add(id, func.bind(this));

      return this;
    },
    killOnFrame: function(id) {
      if(id) {
        this.chronoFunctions.remove(id);
      } else {
        chrono.unRegister(this.chronoId);
      }

      return this;
    }
  };
});
describe('Kilo Scheduler Spec', function() {
  var Scheduler;

  kilo.log = false;

  beforeEach(function(done) {
    use('Scheduler', function(_Scheduler) {
      Scheduler = _Scheduler;
      done();
    });
  });

  afterEach(function() {
    kilo.unresolve('Scheduler');
  });

  describe('callback', function() {
    var func = function() {}, id;

    it('should be registered', function() {
      id = Scheduler.register(func);
      expect(Scheduler.getRegistered(id)).toBe(func);
    });

    it('should be unregistered', function() {
      Scheduler.unRegister(id);
      expect(Scheduler.getRegistered(id)).toBe(undefined);
    });
  });

  describe('value should increment over time', function() {
    var val = 0;

    beforeEach(function(done) {
      var func = function() {val++;};

      Scheduler.register(func);

      function checkVal() {
        if(val <= 10) {
          setTimeout(checkVal, 100);
        } else {
          done();
        }
      }
      setTimeout(checkVal, 100);
    });

    it('should be greater than 10', function() {
      expect(val).toBeGreaterThan(10);
    });
  });
});
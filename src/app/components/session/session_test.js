describe('Session', function() {

  beforeEach(module('session'));

  beforeEach(inject(function(_Session_) {
    Session = _Session_;
  }));

  describe("Creating a session", function() {

    it("should assign parameters correctly", function() {
      Session.create(12345, 'instructor');
      expect(Session.userId).toEqual(12345);
      expect(Session.userRole).toEqual('instructor');
    });

    it("should require both paramaters", function() {
      expect(function() { Session.create(12345); }).toThrow();
    });

  });

  describe("Destroying a session", function() {
    beforeEach(function() {
      Session.create(12345, 'student');
    });

    it("should clear userId", function() {
      expect(Session.userId).not.toBeNull();
      Session.destroy();
      expect(Session.userId).toBeNull();
    });

    it("should clear userRole", function() {
      expect(Session.userRole).not.toBeNull();
      Session.destroy();
      expect(Session.userRole).toBeNull();
    });

  });
});

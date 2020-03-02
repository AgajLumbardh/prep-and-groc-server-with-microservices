const { expect, request } = require('chai');
const app = require('../app');
const {
  user,
  invalidUser,
  invalidUserLoginDetails,
  getUser
} = require('./test/fakes/user');
const { saveUser, deleteUser } = require('./test/helpers/user');

const USER_LOGIN_ROUTE = '/users/login';
const USER_SIGNUP_ROUTE = '/users/signup';

describe('UserController login(), signup()', () => {
  describe('UserController.login()', () => {
    before(done => {
      saveUser(user).then(() => done());
    });

    after(done => {
      deleteUser(user).then(() => done());
    });

    it('should login a user successfully and save authentication token in "auth" cookie', done => {
      request(app)
        .post(USER_LOGIN_ROUTE)
        .type('application/json')
        .send({ email: user.email, password: user.password })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.have.cookie('auth');
          done();
        });
    });

    it('should return ValidationError when user logs in with incorrect password', done => {
      const invalidUserPassword = 'k2345000';
      request(app)
        .post(USER_LOGIN_ROUTE)
        .type('application/json')
        .send({ email: user.email, password: invalidUserPassword })
        .then(res => {
          const errorsNumber = 1;
          expect(res).to.have.status(400);
          expect(res.body.error).to.be.true;
          expect(res.body.name).to.equal('ValidationError');
          expect(Object.keys(res.body.errors)).to.have.length(errorsNumber);
          done();
        });
    });

    it('should return ClientError when user logs in with unregistered email', done => {
      const unregisteredUser = getUser();
      request(app)
        .post(USER_LOGIN_ROUTE)
        .type('application/json')
        .send({
          email: unregisteredUser.email,
          password: unregisteredUser.password
        })
        .then(res => {
          const errorsNumber = 1;
          expect(res).to.have.status(400);
          expect(res.body.error).to.be.true;
          expect(res.body.name).to.equal('ValidationError');
          expect(Object.keys(res.body.errors)).to.have.length(errorsNumber);
          done();
        });
    });

    it('should return ValidationError when user password is shorter than 6 characters and e-mail has invalid format', done => {
      request(app)
        .post(USER_LOGIN_ROUTE)
        .type('application/json')
        .send(invalidUserLoginDetails)
        .then(res => {
          const errorsNumber = 2;
          expect(res).to.have.status(400);
          expect(res.body.error).to.be.true;
          expect(res.body.name).to.equal('ValidationError');
          expect(Object.keys(res.body.errors)).to.have.length(errorsNumber);
          done();
        });
    });

    it('should return ValidationError when login fields(email,password) are empty', done => {
      request(app)
        .post(USER_LOGIN_ROUTE)
        .type('application/json')
        .send({})
        .then(res => {
          const errorsNumber = 2;
          expect(res).to.have.status(400);
          expect(res.body.error).to.be.true;
          expect(res.body.name).to.equal('ValidationError');
          expect(Object.keys(res.body.errors)).to.have.length(errorsNumber);
          done();
        });
    });
  });

  describe('UserController.signup()', () => {
    describe('UserController.signup() with success', () => {
      afterEach(done => {
        deleteUser(user).then(() => done());
      });

      it('should register a new user successfully', done => {
        request(app)
          .post(USER_SIGNUP_ROUTE)
          .type('application/json')
          .send(user)
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('_id');
            done();
          });
      });
    });

    describe('UserController.signup() with errors', () => {
      afterEach(done => {
        deleteUser(user).then(() => {
          done();
        });
      });

      beforeEach(done => {
        saveUser(user).then(() => {
          done();
        });
      });

      it('should return ValidationError when user data fields are empty', done => {
        request(app)
          .post(USER_SIGNUP_ROUTE)
          .type('application/json')
          .send({})
          .then(res => {
            const errorsNumber = 4;
            expect(res).to.have.status(400);
            expect(res.body.error).to.be.true;
            expect(res.body.name).to.equal('ValidationError');
            expect(Object.keys(res.body.errors)).to.have.length(errorsNumber);
            done();
          });
      });

      it('should return ValidationError when firstname,lastname are alphanumeric letters and email format is invalid', done => {
        request(app)
          .post(USER_SIGNUP_ROUTE)
          .type('application/json')
          .send(invalidUser)
          .then(res => {
            const errorsNumber = 3;
            expect(res).to.have.status(400);
            expect(res.body.error).to.be.true;
            expect(res.body.name).to.equal('ValidationError');
            expect(Object.keys(res.body.errors)).to.have.length(errorsNumber);
            done();
          });
      });

      it('should return ClientError when email has already been registered', done => {
        request(app)
          .post(USER_SIGNUP_ROUTE)
          .type('application/json')
          .send({ ...user, firstName: 'Has', lastName: 'Haas' })
          .then(res => {
            const errorsNumber = 1;
            expect(res).to.have.status(400);
            expect(res.body.error).to.be.true;
            expect(res.body.name).to.equal('ValidationError');
            expect(Object.keys(res.body.errors)).to.have.length(errorsNumber);
            done();
          });
      });

      it('should return ValidationError when firstname,lastname length > 30 characters and password length is <6 characters', done => {
        request(app)
          .post(USER_SIGNUP_ROUTE)
          .type('application/json')
          .send({
            email: 'agaj@lum.com',
            password: 'km12',
            firstName: 'Hasdfgkmdkfmgmkdmfgkmdkfgsdfg',
            lastName: 'Haaskmdkgmkmmmmmkunufgagmugndufgkmfmg'
          })
          .then(res => {
            const errorsNumber = 2;
            expect(res).to.have.status(400);
            expect(res.body.name).to.equal('ValidationError');
            expect(Object.keys(res.body.errors)).to.have.length(errorsNumber);
            done();
          });
      });
    });
  });
});

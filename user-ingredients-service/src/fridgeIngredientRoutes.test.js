const { expect, request } = require('chai');
const app = require('../app');
const {
  fridgeIngredient,
  fridgeIngredientWithInvalidId,
  invalidFridgeIngredient,
  emptyFridgeIngredient
} = require('./test/fakes/fridge');
const { user } = require('./test/fakes/user');
const {
  saveFridgeIngredient,
  deleteFridgeIngredient,
  deleteAllFridgeIngredients
} = require('./test/helpers/fridge');
const { saveUser, deleteUser } = require('./test/helpers/user');
const convertUnitToDefaultUnit = require('./utils/convertUnitToDefaultUnit');
const convertAmountToDefaultUnitAmount = require('./utils/convertAmountToDefaultUnitAmount');

const FRIDGE_INGREDIENTS_ROUTE = '/fridge/ingredients';

describe('FridgeController routes', () => {
  before(done => {
    saveUser(user).then(() => done());
  });

  after(done => {
    deleteUser(user).then(() => done());
  });

  describe('FridgeController.list()', () => {
    it('should return ObjectNotFoundError when unauthenticated user requests fridge ingredients list', done => {
      request(app)
        .get(FRIDGE_INGREDIENTS_ROUTE)
        .then(res => {
          expect(res.body.name).to.equal('ObjectNotFoundError');
          expect(res).to.have.status(400);
          done();
        });
    });

    it('should return an empty list of fridge ingredients when there are not any saved', done => {
      request(app)
        .get(FRIDGE_INGREDIENTS_ROUTE)
        .set('X-SubjectId', user._id.toString())
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.items).to.eql([]);
          done();
        });
    });
  });

  describe('FridgeController.save()', () => {
    after(done => {
      deleteAllFridgeIngredients(user._id).then(() => done());
    });

    it('should save fridge ingredient', done => {
      request(app)
        .post(FRIDGE_INGREDIENTS_ROUTE)
        .type('application/json')
        .set('X-SubjectId', user._id.toString())
        .send(fridgeIngredient)
        .then(saveResponse => {
          expect(saveResponse).to.have.status(200);
          expect(saveResponse).to.be.json;
          expect(saveResponse.body.name).to.equal(fridgeIngredient.name);
          expect(saveResponse.body.unit).to.equal(
            convertUnitToDefaultUnit(fridgeIngredient.unit)
          );
          expect(saveResponse.body.amount).to.equal(
            convertAmountToDefaultUnitAmount(fridgeIngredient)
          );

          request(app)
            .get(FRIDGE_INGREDIENTS_ROUTE)
            .set('X-SubjectId', user._id.toString())
            .then(listResponse => {
              expect(listResponse.body.items).to.have.length(1);
              done();
            });
        });
    });
  });

  describe('FridgeController.save() with duplicate save entry error', () => {
    before(done => {
      saveFridgeIngredient(fridgeIngredient, user._id).then(() => done());
    });
    after(done => {
      deleteFridgeIngredient(fridgeIngredient, user._id).then(() => done());
    });

    it('should return ValidationError when saving fridge ingredient that has already been saved.', done => {
      request(app)
        .post(FRIDGE_INGREDIENTS_ROUTE)
        .type('application/json')
        .set('X-SubjectId', user._id.toString())
        .send(fridgeIngredient)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.name).to.equal('ValidationError');
          expect(res.body.message).to.equal('Validation error occured.');
          done();
        });
    });
  });

  describe('FridgeController.save() with invalid user data', () => {
    it('should return ValidationError when saving fridge ingredient with empty fields(name,amount,unit)', done => {
      request(app)
        .post(FRIDGE_INGREDIENTS_ROUTE)
        .type('application/json')
        .set('X-SubjectId', user._id.toString())
        .send(emptyFridgeIngredient)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error');
          expect(res.body.name).to.equal('ValidationError');
          done();
        });
    });

    it(`should return ValidationError when saving fridge ingredient with invalid name(type number),
     amount(type String), unit(type unknown enum)`, done => {
      request(app)
        .post(FRIDGE_INGREDIENTS_ROUTE)
        .type('application/json')
        .set('X-SubjectId', user._id.toString())
        .send(invalidFridgeIngredient)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error');
          expect(res.body.name).to.equal('ValidationError');
          done();
        });
    });
  });

  describe('FridgeController.delete()', () => {
    describe('FridgeController.delete() with success', () => {
      before(done => {
        saveFridgeIngredient(fridgeIngredient, user._id).then(() => done());
      });

      it('should delete a fridge ingredient', done => {
        request(app)
          .del(`${FRIDGE_INGREDIENTS_ROUTE}/${fridgeIngredient._id}`)
          .set('X-SubjectId', user._id.toString())
          .then(delResponse => {
            expect(delResponse).to.have.status(204);

            request(app)
              .get(`${FRIDGE_INGREDIENTS_ROUTE}`)
              .set('X-SubjectId', user._id.toString())
              .then(listResponse => {
                expect(listResponse.body.items).to.eql([]);
                done();
              });
          });
      });
    });

    describe('FridgeController.delete() with error', () => {
      it('shuould return ClientError when deleting an ingredient that has not been saved', done => {
        const ingredientId = fridgeIngredient._id;
        request(app)
          .del(`${FRIDGE_INGREDIENTS_ROUTE}/${ingredientId}`)
          .set('X-SubjectId', user._id.toString())
          .then(res => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
            done();
          });
      });

      it('should return ValueError when deleting an ingredient with invalid object id', done => {
        const invalidItemId = fridgeIngredientWithInvalidId._id;
        request(app)
          .del(`${FRIDGE_INGREDIENTS_ROUTE}/${invalidItemId}`)
          .set('X-SubjectId', user._id.toString())
          .then(res => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
            expect(res.body.name).to.equal('ValueError');
            done();
          });
      });
    });
  });
});

module.exports.FRIDGE_INGREDIENTS_ROUTE = FRIDGE_INGREDIENTS_ROUTE;

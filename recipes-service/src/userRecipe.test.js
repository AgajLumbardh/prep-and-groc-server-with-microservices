const mongoose = require('mongoose');
const { expect, request } = require('chai');
const app = require('../app');
const { user } = require('./test/fakes/user');
const { recipe } = require('./test/fakes/recipe');
const { saveUser, deleteUser } = require('./test/helpers/user');
const {
  saveRecipe,
  deleteRecipe,
  addRecipeToUserCollection,
  removeRecipeFromUserCollection
} = require('./test/helpers/recipe');

const USER_RECIPES_ROUTE = '/user/recipes';

describe('UserRecipecontroller add(), remove(), list()', () => {
  before(done => {
    saveUser(user).then(() => done());
  });

  after(done => {
    deleteUser(user).then(() => done());
  });

  describe('RecipeController.add()', () => {
    describe('RecipeController.add() as owner', () => {
      before(done => {
        saveRecipe(recipe, user._id).then(() => done());
      });
      after(done => {
        deleteRecipe(recipe.title).then(() => done());
      });

      it('should return ClientError when owner adds his recipe', done => {
        request(app)
          .put(`${USER_RECIPES_ROUTE}/${recipe._id}`)
          .set('X-SubjectId', user._id.toString())
          .then(res => {
            expect(res).to.have.status(400);
            expect(res.body.name).to.equal('ClientError');
            expect(res.body.message).to.equal(
              'Owned recipes are already added to collection.'
            );
            done();
          });
      });
    });

    describe('RecipeController.add() as user', () => {
      before(done => {
        const ownerId = mongoose.Types.ObjectId().toString();
        saveRecipe(recipe, ownerId).then(() => done());
      });
      after(done => {
        deleteRecipe(recipe.title)
          .then(() => removeRecipeFromUserCollection())
          .then(() => done());
      });

      it('should add recipe to collection', done => {
        request(app)
          .put(`${USER_RECIPES_ROUTE}/${recipe._id}`)
          .set('X-SubjectId', user._id.toString())
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body._id).to.equal(recipe._id);
            done();
          });
      });

      it('should return ClientError when recipe already exists in collection', done => {
        request(app)
          .put(`${USER_RECIPES_ROUTE}/${recipe._id}`)
          .set('X-SubjectId', user._id.toString())
          .then(res => {
            expect(res).to.have.status(400);
            expect(res.body.name).to.equal('ClientError');
            expect(res.body.message).to.equal(
              `Recipe with id ${recipe._id} has already been added to collection`
            );
            done();
          });
      });
    });
  });

  describe('RecipeController.remove()', () => {
    describe('RecipeController.remove() as user', () => {
      before(done => {
        const ownerId = mongoose.Types.ObjectId().toString();
        saveRecipe(recipe, ownerId)
          .then(() => addRecipeToUserCollection(recipe._id, user._id))
          .then(() => done());
      });
      after(done => {
        removeRecipeFromUserCollection(recipe._id, user._id)
          .then(() => deleteRecipe(recipe.title))
          .then(() => done());
      });

      it('should remove recipe from collection', done => {
        request(app)
          .del(`${USER_RECIPES_ROUTE}/${recipe._id}`)
          .set('X-SubjectId', user._id.toString())
          .then(res => {
            expect(res).to.have.status(204);
            done();
          });
      });

      it('should return ObjectNotFoundError when user removes recipe that is not found in collection', done => {
        request(app)
          .del(`${USER_RECIPES_ROUTE}/${recipe._id}`)
          .set('X-SubjectId', user._id.toString())
          .then(res => {
            expect(res).to.have.status(400);
            expect(res.body.name).to.equal('ObjectNotFoundError');
            expect(res.body.message).to.equal(
              `Recipe with id ${recipe._id} was not found in your recipes collection`
            );
            done();
          });
      });
    });

    describe('RecipeController.remove() as owner', () => {
      before(done => {
        saveRecipe(recipe, user._id).then(() => done());
      });

      after(done => {
        deleteRecipe(recipe.title).then(() => done());
      });

      it('should return ClientError when removing recipe as owner', done => {
        request(app)
          .del(`${USER_RECIPES_ROUTE}/${recipe._id}`)
          .set('X-SubjectId', user._id.toString())
          .then(res => {
            expect(res).to.have.status(400);
            expect(res.body.name).to.equal('ClientError');
            expect(res.body.message).to.equal(
              'Owned recipes cannot be removed from collection.'
            );
            done();
          });
      });
    });
  });

  describe('RecipeController.list()', () => {
    before(done => {
      const ownerId = mongoose.Types.ObjectId().toString();
      saveRecipe(recipe, ownerId)
        .then(() => addRecipeToUserCollection(recipe._id, user._id))
        .then(() => done());
    });

    after(done => {
      removeRecipeFromUserCollection(recipe._id, user._id)
        .then(() => deleteRecipe(recipe.title))
        .then(() => done());
    });

    it('should return recipes collection', done => {
      request(app)
        .get(`${USER_RECIPES_ROUTE}`)
        .set('X-SubjectId', user._id.toString())
        .then(res => {
          expect(res).to.have.status(200);
          // TODO: update mocha to v5 when it is released and use declarative assert style to implement the test case.
          const savedRecipeIndex = res.body.items.findIndex(
            item => item._id === recipe._id
          );
          expect(res.body.items[savedRecipeIndex]._id).to.equal(recipe._id);
          done();
        });
    });
  });
});

const { expect, request } = require('chai');
const app = require('../app');
const { user } = require('./test/fakes/user');
const {
  recipe,
  invalidRecipe,
  recipeWithDuplicateIngredients,
  availableRecipeIngredient,
  unavailableRecipeIngredient,
  INVALID_RECIPE_ID,
  RECIPE_ID
} = require('./test/fakes/recipe');
const { saveUser, deleteUser } = require('./test/helpers/user');
const { saveRecipe, deleteRecipe } = require('./test/helpers/recipe');
const {
  saveFridgeIngredient,
  deleteFridgeIngredient
} = require('./test/helpers/fridgeIngredient');

const RECIPES_ROUTE = '/recipes';
const PREPARE_RECIPE_ROUTE = '/recipes/prepare';

describe('RecipeController routes', () => {
  before(done => {
    saveUser(user).then(() => done());
  });

  after(done => {
    deleteUser(user).then(() => done());
  });

  describe('RecipeController.show()', () => {
    before(done => {
      saveRecipe(recipe, user._id).then(() => done());
    });

    after(done => {
      deleteRecipe(recipe.title).then(() => done());
    });

    it('should return recipe with the same id that is requested', done => {
      request(app)
        .get(`${RECIPES_ROUTE}/${recipe._id}`)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body.items._id).to.equal(recipe._id);
          expect(res.body.items).to.have.property('title');
          expect(res.body.items).to.have.property('category');
          expect(res.body.items).to.have.property('instructions');
          expect(res.body.items).to.have.property('ingredients');
          done();
        });
    });

    it('should return ObjectNotFoundError when requesting a recipe that does not exist', done => {
      request(app)
        .get(`${RECIPES_ROUTE}/${RECIPE_ID}`)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.error).to.be.true;
          expect(res.body.name).to.equal('ObjectNotFoundError');
          done();
        });
    });

    it('should return ValueError when requesting a recipe with invalid id', done => {
      request(app)
        .get(`${RECIPES_ROUTE}/${INVALID_RECIPE_ID}`)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.error).to.be.true;
          expect(res.body.name).to.equal('ValueError');
          done();
        });
    });
  });

  describe('RecipeController.list()', () => {
    before(done => {
      saveRecipe(recipe, user._id).then(() => done());
    });

    after(done => {
      deleteRecipe(recipe.title).then(() => done());
    });

    it('should return list of recipes', done => {
      request(app)
        .get(RECIPES_ROUTE)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('totalItems');
          expect(res.body).to.have.property('items');
          done();
        });
    });
  });

  describe('RecipeController.save()', () => {
    after(done => {
      deleteRecipe(recipe.title).then(() => done());
    });

    it('should save a recipe', done => {
      request(app)
        .post(RECIPES_ROUTE)
        .type('application/json')
        .set('X-SubjectId', user._id.toString())
        .send({ ...recipe, owner: user._id })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body.title).to.equal(recipe.title);
          expect(res.body.owner).to.equal(user._id);
          expect(res.body).to.have.property('category');
          expect(res.body.ingredients).to.have.length(
            recipe.ingredients.length
          );
          done();
        });
    });

    it('should return ValidationError when saving recipe with empty fields', done => {
      request(app)
        .post(RECIPES_ROUTE)
        .type('application/json')
        .set('X-SubjectId', user._id.toString())
        .send({})
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.error).to.be.true;
          expect(res.body.name).to.equal('ValidationError');
          done();
        });
    });

    it('should return ValidationError when saving recipe with invalid recipe data(title,area,intrusctions,imageUrl),', done => {
      request(app)
        .post(RECIPES_ROUTE)
        .type('application/json')
        .set('X-SubjectId', user._id.toString())
        .send({ ...invalidRecipe, owner: user._id })
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.name).to.equal('ValidationError');
          done();
        });
    });

    it('should return ClientError when saving recipe that already exists (recipe has the same title and owner)', done => {
      request(app)
        .post(RECIPES_ROUTE)
        .type('application/json')
        .set('X-SubjectId', user._id.toString())
        .send({ ...recipe, owner: user._id })
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.name).to.equal('ClientError');
          expect(res.body.message).to.equal('Recipe is already saved');
          done();
        });
    });

    it('should return ValidationError error when saving recipe with duplicate ingredients', done => {
      request(app)
        .post(RECIPES_ROUTE)
        .type('application/json')
        .set('X-SubjectId', user._id.toString())
        .send({ ...recipeWithDuplicateIngredients, owner: user._id })
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.name).to.equal('ValidationError');
          done();
        });
    });
  });

  describe('RecipeController.delete()', () => {
    before(done => {
      saveRecipe(recipe, user._id).then(() => done());
    });

    after(done => {
      deleteRecipe(recipe.title).then(() => done());
    });

    it('should delete recipe whose owner is the user', done => {
      request(app)
        .del(`${RECIPES_ROUTE}/${recipe._id}`)
        .set('X-SubjectId', user._id.toString())
        .then(res => {
          expect(res).to.have.status(204);
          done();
        });
    });

    it('should return ObjectNotFoundError when recipe is deleted by not the owner', done => {
      request(app)
        .del(`${RECIPES_ROUTE}/${RECIPE_ID}`)
        .set('X-SubjectId', user._id.toString())
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.name).to.equal('ObjectNotFoundError');
          done();
        });
    });
  });

  describe('RecipeController.prepare()', () => {
    before(done => {
      Promise.all([
        saveFridgeIngredient(availableRecipeIngredient, user._id),
        saveFridgeIngredient(unavailableRecipeIngredient, user._id),
        saveRecipe(recipe, user._id)
      ]).then(() => done());
    });

    after(done => {
      Promise.all([
        deleteFridgeIngredient(availableRecipeIngredient, user._id),
        deleteFridgeIngredient(unavailableRecipeIngredient, user._id),
        deleteRecipe(recipe.title)
      ]).then(() => done());
    });

    it(`should return recipe ingredient available when the amount of ingredient in fridge is gte
     than the amount of the same recipe ingredient`, done => {
      request(app)
        .get(`${PREPARE_RECIPE_ROUTE}/${recipe._id}`)
        .set('X-SubjectId', user._id.toString())
        .then(res => {
          expect(res).to.have.status(200);
          const savedFridgeIngredientIndex = res.body.items.findIndex(
            item => item.name === availableRecipeIngredient.name
          );
          const recipeIngredientFoundInFridge =
            res.body.items[savedFridgeIngredientIndex];
          expect(recipeIngredientFoundInFridge.isCompleted).to.be.true;
          done();
        });
    });

    it(`should return recipe ingredient unavailable when the amount of ingredient in fridge is lte
    the amount of the same recipe ingredient`, done => {
      request(app)
        .get(`${PREPARE_RECIPE_ROUTE}/${recipe._id}`)
        .set('X-SubjectId', user._id.toString())
        .then(res => {
          expect(res).to.have.status(200);
          const savedFridgeIngredientIndex = res.body.items.findIndex(
            item => item.name === unavailableRecipeIngredient.name
          );
          const recipeIngredientInTheFridge =
            res.body.items[savedFridgeIngredientIndex];
          expect(recipeIngredientInTheFridge.isCompleted).to.be.false;
          done();
        });
    });

    it('should return ValueError when user prepares recipe with invalid recipe id', done => {
      request(app)
        .get(`${PREPARE_RECIPE_ROUTE}/${INVALID_RECIPE_ID}`)
        .set('X-SubjectId', user._id.toString())
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.error).to.be.true;
          expect(res.body.name).to.equal('ValueError');
          done();
        });
    });

    it('should return ObjectNotFoundError when user prepares recipe that is not found in his collection', done => {
      request(app)
        .get(`${PREPARE_RECIPE_ROUTE}/${RECIPE_ID}`)
        .set('X-SubjectId', user._id.toString())
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.error).to.be.true;
          expect(res.body.name).to.equal('ObjectNotFoundError');
          expect(res.body.message).to.equal(
            `Recipe with id:${RECIPE_ID} could not be found.`
          );
          done();
        });
    });
  });
});

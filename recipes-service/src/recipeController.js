const RecipeService = require('./RecipeService');
const getQueryParameters = require('./utils/getQueryParameters');
const getTotalPages = require('./utils/getTotalPages');
const IngredientModel = require('./ingredientModel');

module.exports = {
  async show({ params, user }, res) {
    const recipeService = new RecipeService(user);
    const recipe = await recipeService.get(params.id);
    res.status(200).send({ items: recipe });
  },

  async list(req, res) {
    const recipeService = new RecipeService(req.user);
    const {
      query,
      skipPages,
      sortType,
      itemsPerPage,
      currentPage
    } = getQueryParameters(req.query);
    const recipes = await recipeService.list(
      query,
      sortType,
      skipPages,
      itemsPerPage
    );
    const totalItems = await recipeService.count(query);
    const totalPages = getTotalPages(totalItems);
    res.status(200).send({
      items: recipes,
      totalItems,
      totalPages,
      itemsPerPage,
      currentPage
    });
  },

  async save(req, res) {
    const recipeService = new RecipeService(req.user);
    const newlyCreatedRecipe = await recipeService.save(req.body);
    res.status(200).send(newlyCreatedRecipe);
  },

  async edit(req, res) {
    res.status(501).send();
  },

  async delete(req, res) {
    const recipeService = new RecipeService(req.user);
    await recipeService.delete(req.params.id);
    res.status(204).send();
  },

  async prepare(req, res) {
    const recipeService = new RecipeService(req.user);
    const ingredients = recipeService.getIngredientsAvailability(req.recipe);
    res.status(200).send({ items: ingredients });
  },

  async listIngredients(req, res) {
    const ingredients = await IngredientModel.aggregate([
      {
        $addFields: {
          label: '$name',
          value: '$name',
          id: '$_id'
        }
      },
      {
        $project: {
          label: 1,
          value: 1,
          id: 1,
          _id: 0
        }
      }
    ]);
    res.status(200).send({ items: ingredients });
  }
};

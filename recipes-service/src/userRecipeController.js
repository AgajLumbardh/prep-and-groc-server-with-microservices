const UserRecipeService = require('./UserRecipeService');
const getQueryParameters = require('./utils/getQueryParameters');
const getTotalPages = require('./utils/getTotalPages');

module.exports = {
  async list(req, res) {
    const service = new UserRecipeService(req.user);
    const { query, skipPages, itemsPerPage, currentPage } = getQueryParameters(
      req.query
    );
    const userRecipes = await service.getCollection(
      query,
      skipPages,
      itemsPerPage
    );
    const totalItems = await service.count(query);
    const totalPages = getTotalPages(totalItems);
    res.status(200).send({
      items: userRecipes,
      totalItems,
      totalPages,
      itemsPerPage,
      currentPage
    });
  },

  async add({ user, recipe }, res) {
    const service = new UserRecipeService(user);
    const addedRecipe = await service.addToCollection(recipe);
    const userRecipe = addedRecipe.toObject();
    userRecipe.isSaved = true;
    userRecipe.isOwner = false;
    res.status(200).send(userRecipe);
  },

  async remove({ user, recipe }, res) {
    const service = new UserRecipeService(user);
    await service.removeFromCollection(recipe);
    res.status(204).send();
  }
};

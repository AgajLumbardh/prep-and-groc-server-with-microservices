const FridgeIngredientService = require('./FridgeIngredientService');
const getQueryParameters = require('./utils/getQueryParameters');
const getTotalPages = require('./utils/getTotalPages');

module.exports = {
  async list(req, res) {
    const fridgeService = new FridgeIngredientService(req.user);
    const { query, skipPages, itemsPerPage, currentPage } = getQueryParameters(
      req.query
    );
    const fridgeIngredients = await fridgeService.list(
      query,
      skipPages,
      itemsPerPage
    );
    const totalItems = await fridgeService.count(query);
    const totalPages = getTotalPages(totalItems);
    res.status(200).send({
      items: fridgeIngredients,
      totalItems,
      totalPages,
      itemsPerPage,
      currentPage
    });
  },

  async save(req, res) {
    const fridgeService = new FridgeIngredientService(req.user);
    const savedFridgeIngredient = await fridgeService.save(req.body);
    res.status(200).send(savedFridgeIngredient);
  },

  async delete(req, res) {
    const fridgeService = new FridgeIngredientService(req.user);
    await fridgeService.delete(req.params.id);
    res.status(204).send();
  }
};

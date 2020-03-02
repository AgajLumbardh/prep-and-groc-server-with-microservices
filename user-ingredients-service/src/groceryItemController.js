const GroceryItemService = require('./GroceryItemService');
const getQueryParameters = require('./utils/getQueryParameters');
const getTotalPages = require('./utils/getTotalPages');

module.exports = {
  async list(req, res) {
    const groceryService = new GroceryItemService(req.user);
    const { query, skipPages, itemsPerPage, currentPage } = getQueryParameters(
      req.query
    );
    const groceryItems = await groceryService.list(
      query,
      skipPages,
      itemsPerPage
    );
    const totalItems = await groceryService.count(query);
    const totalPages = getTotalPages(totalItems);
    res.status(200).send({
      items: groceryItems,
      totalItems,
      totalPages,
      itemsPerPage,
      currentPage
    });
  },

  async saveOrUpdateMany(req, res) {
    const groceryService = new GroceryItemService(req.user);
    const savedGroceryItems = await groceryService.saveOrUpdateMany(req.body);
    res.status(200).send(savedGroceryItems);
  },

  async delete(req, res) {
    const groceryService = new GroceryItemService(req.user);
    await groceryService.delete(req.params.id);
    res.status(204).send();
  },

  async markComplete(req, res) {
    const groceryService = new GroceryItemService(req.user);
    const completedGroceryItem = await groceryService.markComplete(
      req.params.id
    );
    res.status(200).send(completedGroceryItem);
  }
};

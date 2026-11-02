const router = require("express").Router();
const c = require("../controllers/taskController");
const { validateId, validateTaskBody, validateStatusBody } = require("../middleware/validate");

router.route("/").get(c.getTasks).post(validateTaskBody(false), c.createTask);
router
  .route("/:id")
  .get(validateId, c.getTask)
  .put(validateId, validateTaskBody(true), c.updateTask)
  .delete(validateId, c.deleteTask);
router.patch("/:id/status", validateId, validateStatusBody, c.updateStatus);

module.exports = router;

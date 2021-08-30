const Sequelize = require("sequelize");
const db = {};
// sequelize = new Sequelize("defaultdb", "doadmin", "hhifjal25po3olfs", {
//   dialect: "mysql",
//   host: "stirilemele-do-user-9247906-0.b.db.ondigitalocean.com",
//   port: 25060,
// });

sequelize = new Sequelize("defaultdb", "doadmin", "ldms569jnww55d68", {
  host: "db-mysql-fra1-95468-do-user-9247906-0.b.db.ondigitalocean.com",
  dialect: "mysql",
  port: 25060,
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = sequelize;

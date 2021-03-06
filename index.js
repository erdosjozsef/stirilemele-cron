const express = require("express");
const app = express();
const sequelize = require("./util/database");
const { databaseConfig } = require("./util/database-config");
var cors = require("cors");

databaseConfig();

app.use(cors());
app.options("*", cors());
const PORT = process.env.PORT || 3001;

app.use(express.json({ extended: false }));

const maszolRoutes = require("./routes/maszol");

// ROUTES
app.use("/cronjob/maszol", maszolRoutes);

sequelize
  .sync()
  .then((result) => {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch((err) => {
    console.log(err);
  });

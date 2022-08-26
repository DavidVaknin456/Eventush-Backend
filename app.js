const express = require('express');
const PORT = process.env.PORT || 3000
const app = express()
const basicGet = require("./route/basic")
const user = require("./route/user")
const events = require("./route/events")
require('./db/util/dbConnections');
require("./util/firebaseAdminManager")

app.use(express.json());
app.use('/', basicGet);
app.use('/', user);
app.use('/', events);

app.listen(PORT, () => console.log(`listening on  ${PORT}`))
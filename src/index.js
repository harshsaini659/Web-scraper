const express = require('express');
const app = express();
require('../db/mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
// const indexRoutes = require('./routes/indexRoutes');
const recordRoutes = require('./routes/recordRoutes');

app.use(cors());
app.use(bodyParser.json());
// app.use(express.static('public'));
// app.use('/',indexRoutes);
app.use('/api', recordRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

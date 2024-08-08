const express = require('express');
const cors = require('cors');
const app = express();

const NewsRoute = require('./src/routes/routes.index');

// middleware's application 

app.use(cors());
app.use(express.json());

// rotas 

app.use('/users', NewsRoute);

const PORT = 5000

app.listen(PORT, () => {
    console.log(`listening on port http://localhost:${PORT}/news`);
});
const express = require('express');
const cors = require('cors');
const app = express();
const authService = require('./src/routes/auth.route');


const conectDB = require('./src/database/db');
const NewsRoute = require('./src/routes/routes.index');
const NewsPost = require('./src/routes/news.route')
// middleware's application 

conectDB();

app.use(cors());
app.use(express.json());

// rotas 

app.use('/users', NewsRoute);
app.use('/auth', authService);
app.use('/news', NewsPost);

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`listening on port http://localhost:${PORT}/`);
});
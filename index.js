const express = require('express');
const cors = require('cors');
const app = express();
const authService = require('./src/routes/auth.route');
const conectDB = require('./src/database/db');
const NewsRoute = require('./src/routes/routes.index');
const NewsPost = require('./src/routes/news.route');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./src/swagger.json');

// middleware's application
conectDB();

app.use(cors());
app.use(express.json());

app.use('/users', NewsRoute);
app.use('/auth', authService);
app.use('/news', NewsPost);
// Configuração do Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`listening on port http://localhost:${PORT}/`);
});


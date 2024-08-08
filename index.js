const express = require('express');
const cors = require('cors');
const app = express();

// middleware's application 


app.use(cors());
app.use(express.json());

const personal = [
    {
        nome: " Wesley",
        idade:  25,
        email: "weesley@gmail.com",
        cidade: "Maracanaú-CE"
    },
    {
        nome: "Renata",
        idade:  22,
        email: "renatinha35@gmail.com",
        cidade: "Ananideua-Pará"
    },

    {
        nome: "Junior",
        idade: 19,
        email: "juniorTabata23@gmail.com",
        cidade: "Paraíba-PB"
    }
]



app.get('/news', (req, res) => {
    res.json(personal);
});

const PORT = 5000

app.listen(PORT, () => {
    console.log(`listening on port http://localhost:${PORT}/news`);
});
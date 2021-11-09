const express = require('express');
const app = express();
const PORT = 2233;

var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cors({
    credentials: true,
    origin: ['http://localhost:4200']
}));
app.use(cookieParser());
var messages = [{text:'some text', owner: 'Mike'}, {text:'others', owner: 'Jon'}];

app.use(bodyParser.json());
app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
    })

//import routes
const userRoutes = require('./src/routes/userRoutes');

app.use('/api/user', userRoutes);
//ROUTES
var api = express.Router();

api.get('/messages', (req, res) => {
    res.json(messages);
})

api.post('/messages', (req, res) => {
    console.log(req.body);
    messages.push(req.body);
    res.sendStatus(200);
})


app.use('/api', api);

//Connect to DB
mongoose.connect('mongodb+srv://WorkOutAholic:workoutaholic@cluster0.8ots6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', ()=>{
    console.log('connected to db!');
});

//Listening port
app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
});
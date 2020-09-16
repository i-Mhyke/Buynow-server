const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config({path: './.env'})
const app = express();

mongoose.connect(process.env.LOCAL_DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(()=>{ 
    console.log(`MongoDb connected`)
}).catch(err =>{
    console.log(`Database connection error => ${err}`)
});

// Middlewares
app.use(morgan('dev'));

app.get('/', (req, res) =>{
    res.send('Hello world')
});
const PORT = process.env.PORT;
app.listen(PORT, () =>{
    console.log(`⚡️[Server]: Buynow server running on port http://localhost:${PORT}`)
})

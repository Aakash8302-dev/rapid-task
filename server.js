const path = require('path')
const express = require('express');
const dotenv  =require('dotenv');
const cors = require('cors')

const userRoutes = require('./routes/userRoutes.js')

const { errorHandler, notFound } = require("./middlewares/errorMiddleware.js")
const connectDB = require('./utils/db.js');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '/client/build')));

app.use('/api/user/', userRoutes);


app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=> {
    console.log(`Server is running on PORT ${process.env.PORT}`)
})
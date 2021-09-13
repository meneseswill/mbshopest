const mongoose = require('mongoose')
const fs = require('fs')
const dotenv = require('dotenv')
require('colors')

// Cargando variables de entorno
dotenv.config( {path: './config/config.env' })

// Cargando modelos
const User = require('./models/User')
const product = require('./models/Products')
const order = require('./models/Order')

// Conectar BD
mongoose.connect(process.env.MONGO_URI , {
    useCreateIndex : true,
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true
})

// Leer archivos Json
const products = JSON.parse(
    fs.readFileSync( `${__dirname}/_data/products.json`, 'utf-8' )
)

const users = JSON.parse(
    fs.readFileSync( `${__dirname}/_data/users.json`, 'utf-8' )
)

// Importar datos a BD
const importData = async() => {
    try {
        await User.create(users)
        await product.create(products)
        console.log('Datos importados'.green.inverse)
        process.exit()
    } catch (err) {
        console.error(err)
    }
}

// Elimianr datos DB
const deleteData = async() => {
    try {
        await User.deleteMany()
        await order.deleteMany()
        await product.deleteMany()
        console.log('Datos Eliminados'.red.inverse)
        process.exit()
    } catch (err) {
        console.error(err)
    }
}

if(process.argv[2] === '-d'){
    deleteData()
}else if(process.argv[2] === '-i'){
    importData()
}
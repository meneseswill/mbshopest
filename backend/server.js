const path = require('path')
// Uso de servicio express
const express = require('express')
const dotenv = require('dotenv')
// const logger = require('./Middleware/logger')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const colors = require('colors')
const connectDB = require('./CONFIG/db')
const handleError = require('./Middleware/error')

// Cargar las variables de entorno
dotenv.config({ path: './config/config.env' })

const app = express()

app.use(express.json())

// Usar coockie parser
app.use(cookieParser())

// Conexion  a BD
connectDB()

// Importar logger
app.use(morgan('dev'))

// Importando rutas
const products = require('./routes/products')
const orders = require('./routes/order')
const auth = require('./routes/auth')
const user = require('./routes/users')
const reviews = require('./routes/reviews')
const uploads = require('./routes/uploads')

// montar las rutas
app.use('/api/v1/products', products)
app.use('/api/v1/orders', orders)
app.use('/api/v1/auth', auth)
app.use('/api/v1/auth/users', user)
app.use('/api/v1/reviews', reviews)
app.use('/api/v1/uploads', uploads)

app.get('/api/v1/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID)
})

// const _dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// manejar middleware para manejar errores
app.use(handleError)

const PORT = process.env.PORT || 5000
// Ponemos el server ala escucha en el puerto 5000
const server = app.listen(PORT, () => {
  console.log(
    `El servidor esta corriendo en ${process.env.NODE_ENV} en el puerto ${PORT}`
      .yellow.bold
  )
})

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error : ${err.message}`.red)
  server.close(() => {
    process.exit(1)
  })
})

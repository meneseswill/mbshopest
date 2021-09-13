const mongoose = require('mongoose')
const errorResponse = require('../utils/errorResponse')

const OrderItemShema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Ingrese el producto'],
  },
  name: {
    type: String,
    // required: [true, 'Ingrese el nombre del producto']
  },
  image: {
    type: String,
    // required: [true, 'Ingrese la imagen del producto']
  },
  qty: {
    type: Number,
    required: [true, 'Ingrese la cantidad'],
    min: [1, 'La cantidad minima a vender es 1'],
  },
  price: {
    type: Number,
    // required: [true, 'ingrese el precio del producto']
  },
  total: {
    type: Number,
    // required: [true, 'Ingrese el total de la linea']
  },
})

const OrderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Ingrese el usuario'],
    },
    orderItems: [OrderItemShema],
    shippingAddress: {
      address: {
        type: String,
        required: [true, 'Ingrese la direccion'],
      },
      city: {
        type: String,
        required: [true, 'Ingrese la ciudad'],
      },
      postalCode: {
        type: String,
        required: [true, 'Ingrese el codigo postal'],
      },
      country: {
        type: String,
        required: [true, 'Ingrese el pais'],
      },
    },
    paymentMethod: {
      type: String,
      required: [true, 'Ingrese el metodo de pago'],
      enum: ['PayPal', 'Stripe'],
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    subtotal: {
      type: Number,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: [true, 'Ingrese si el producto esta pagado'],
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: [true, 'Indique si la orden a sido entregada'],
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Obtener la inforamacion del item seleccionado
OrderSchema.pre('save', async function (next) {
  this.orderItem = await Promise.all(
    this.orderItems.map(async (orderItem) => {
      const product = await mongoose
        .model('Product')
        .findById(orderItem.product)

      if (!product) {
        return next(
          new errorResponse(`No se encontro el recurso ${orderItem.product}`)
        )
      }

      orderItem.name = product.name
      orderItem.price = product.price
      orderItem.image = product.image
      orderItem.total = orderItem.price * orderItem.qty

      // console.log(orderItem)

      return orderItem
    })
  )

  const subtotal = this.orderItem
    .reduce((subtotal, orderItem) => {
      return subtotal + orderItem.total
    }, 0)
    .toFixed(2)
  // console.log(subtotal)

  this.subtotal = subtotal
  this.taxPrice = (subtotal * 0.15).toFixed(2)
  this.shippingPrice = (subtotal * 0.1).toFixed(2)
  this.totalPrice = this.subtotal + this.taxPrice + this.shippingPrice

  next()
})

module.exports = mongoose.model('Order', OrderSchema)

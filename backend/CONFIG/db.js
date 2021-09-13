const mongoose = require('mongoose')
const connectDB = async () => {
        const conn = await mongoose.connect(process.env.MONGO_URI,
            {   
                useCreateIndex : true,
                useFindAndModify : true,
                useUnifiedTopology : true,
                useNewUrlParser : true
            }    
        )
        console.log(`MongoDb conectado ${conn.connection.host}`.cyan.underline.bold)    
}

module.exports = connectDB
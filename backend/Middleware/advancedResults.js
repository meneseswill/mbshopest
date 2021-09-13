const advancedResults = (model , populate) => async(req , res , next) => {
    // console.log(req.query)
  let query

  // Copiar req.Query -> spread operator
  const reqQuery = { ...req.query }
  // console.log(reqQuery)

  // Campos a excluir
  const removeFields = ['select', 'sort', 'limit', 'page']

  // Recorrer removeFields y borrarlos de reqQuery
  removeFields.forEach((param) => {
    delete reqQuery[param]
  })
  // console.log(reqQuery)

  // Crear cadena dde la consulta
  let queryStr = JSON.stringify(reqQuery)

  // crear operadores de comparacion
  queryStr = queryStr.replace(/\b(gte|gt|lt|lte|in)\b/g, (match) => `$${match}`)
  // console.log(JSON.parse(queryStr))

  // Buscar el recurso
  query = model.find(JSON.parse(queryStr))

  // Seleccionar Campos
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ')
    // console.log(fields)
    query = query.select(fields)
  }

  // ordenar
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    // console.log(sortBy)
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  //Paginacion
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 25
  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  const total = await model.countDocuments()
  // 7

  query = query.skip(startIndex).limit(limit)
  if(populate){
    query = query.populate(populate)

  }

  let results = await query

  // resultado de paginacion
  const pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    }
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }
  res.advancedResults = {
      success : true,
      count: results.length,
      pagination,
      data: results
  }
  next()
}

module.exports = advancedResults
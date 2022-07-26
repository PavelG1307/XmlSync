const express = require('express')
const xml_router = require('./routers/xml_router.js')

const app = express()
const port = 80

app.use('/api', xml_router)
app.use('/xml', express.static('xml_files'));

app.listen(port, () => {
  console.log(`listen port ${port}`)
})



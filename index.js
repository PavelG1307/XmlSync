const express = require('express')
const app = express()
const port = 80
const xmlRouter = './routers/xml_routers.js'
DB = require('./db_controller.js')
XML = require('./xml_controller.js')
db = new DB('default', 'auth', 'structures3', 'users2')
xml = new XML([], db)

app.listen(port, () => {
  console.log(`listen port ${port}`)
})

app.use("/api/xml/update/:id", async function(req, res) {
    if (req.params.id == 'all') {
        res.send(await xml.update_all())
    } else {
        res.send(await xml.update_user(req.params.id))
    }
});

app.use("/api/xml/add/:id", async function(req, res) {
    res.send(await xml.add_user(req.params.id))
});


app.use("/api/xml/remove/:id", async function(req, res) {
    res.send(await xml.remove_user(req.params.id))
});

app.use("/api/xml/get", async function(req, res) {
    res.send(await xml.get_all())
});
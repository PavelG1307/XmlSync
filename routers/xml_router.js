const express = require('express')
const DB = require('../controllers/db_controller.js')
const XML = require('../controllers/xml_controller.js')

const xml_router = express.Router()
const db = new DB('default', 'auth', 'structures4', 'users2')
const xml = new XML([], db)

xml_router.get("/xml/update/:id", async function(req, res) {
    if (req.params.id == 'all') {
        res.json(await xml.update_all())
    } else {
        res.json(await xml.update_user(req.params.id))
    }
});

xml_router.get("/xml/add/:id", async function(req, res) {
    res.json(await xml.add_user(req.params.id))
});


xml_router.get("/xml/remove/:id", async function(req, res) {
    res.json(await xml.remove_user(req.params.id))
});

xml_router.get("/xml/get", async function(req, res) {
    res.json(await xml.get_all())
});

module.exports = xml_router
const express = require('express')
const xml_router = express.Router();

xml_router.use("/update/:id", function(request, response){
    response.send(`Пользователь: ${request.params.id}`);
  });

module.exports = xml_router
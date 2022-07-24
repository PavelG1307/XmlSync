DB = require('./db_controller.js')
XML = require('./xml_controller.js')

db = new DB('default', 'auth', 'structures3', 'users2')
// db.get_ads('706982af9002ca49cd47f62fa467a7ab')
xml = new XML(['9d64e859-530f-4c29-b453-2ac00d29a114'], db)
xml.refresh_all()

// db.get_structures()

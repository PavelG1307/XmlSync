const { Pool, Client } = require('pg')

class DB_Controller{
    constructor(db_name, db_name_auth, db_table, db_table_auth){
        this.pool = new Pool({
            user: 'master',
            host: '194.177.21.255',
            database: db_name,
            password: '6sd1v838',
            port: 5432,
        })

        this.pool_auth = new Pool({
            user: 'master',
            host: '194.177.21.255',
            database: db_name_auth,
            password: '6sd1v838',
            port: 5432,
        })

        this.db_table = db_table
        this.db_table_auth = db_table_auth
    }

    async get_structures(){
        this.structures = {}
        const query = `SELECT name, uuid, parents FROM ${this.db_table} WHERE avito_id IS NULL`
        const res = (await this.pool.query(query)).rows
        console.log(res)
        for (const i in res) {
            this.structures[res[i].uuid] = res[i].name
        }
        for (const i in res) {
            if (res[i].parents) {
                console.log(this.structures[res[i].parents] + ' --- ' + res[i].name + ' --- ' + res[i].uuid)
            }
        }
    }

    async get_ads(user_hash) {
        const query = `SELECT * FROM ${this.db_table} WHERE hash_seller = '${user_hash}'`
        const res = await this.pool.query(query)
        return res.rows
    }

    async get_user(uuid) {
        const query = `SELECT datasync FROM ${this.db_table_auth} WHERE uuid = '${uuid}'::uuid`
        const res = await this.pool_auth.query(query)
        const user_hash = res.rows[0].datasync.avito.id_hash
        return user_hash
    }
}

module.exports = DB_Controller
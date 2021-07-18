const mongoose = require('mongoose');

//class databse ( class has method connect, error catch and return db object once it's connected)
class db_Connect{

    #db_host
    #db_name
    #db_user
    #db_password
    #options

    constructor( host, name, user, password, options ){

        this.#db_host = host
        this.#db_name = name
        this.#db_user = user
        this.#db_password = password
        this.#options = options

    }

    #connectToDb = async () => {

        let con = await mongoose.connect( 
            `mongodb+srv://` + this.#db_user + `:` 
            + this.#db_password + `@` + this.#db_host + `/` 
            + this.#db_name + `?retryWrites=true&w=majority`,this.#options )
        return con
        
    }

    getDb = async () => await this.#connectToDb()

}

module.exports = { DB: db_Connect }
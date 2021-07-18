const UserModel = require('../../userSchema');

class User{

    constructor(){}

    #default_settings = [
        {
          Name:"distance",
          Value:"5",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          Weight: 3
        },
        {
          Name:"stars",
          Value:"3,4",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          Weight: 5
        },
        {
          Name:"price",
          Value:"$,$$",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          Weight: 4
        },
        {
          Name:"categories",
          Value:"",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          Weight: 6
        }
      ]

    #newUser = async ( args ) => {
        await UserModel.create( { ...args, accountSettings: this.#default_settings } )
        return "User Created"
    }
    removeUser = async () => {

    }
    updateUser = async ( user ) => {
       //console.log( user )
        let result = await UserModel.findOneAndUpdate(
            { email: user.email},
            { ...user }
        )
        return "User info has been updated!"
    }
    #findUser = async ( args ) => {
        let result = await UserModel.findOne( {...args} )
        return ( result === null ) ? { email: "No User", autologin: "false" } : result
    }

    getUser = async ( args ) => {
        return await this.#findUser( args )
    }
    setUser = async ( user ) => await this.#newUser( user )
    

}

module.exports = { User: User }
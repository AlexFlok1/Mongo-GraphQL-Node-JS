const { GraphQLServer } = require('graphql-yoga');

//mongoose schemas
//const PlaceModel = require('./placeSchema');
//const UserModel = require('./userSchema');
//custom classes
const { DB } = require('./lib/classes/connect')
const { User } = require('./lib/classes/User')
const { Place } = require('./lib/classes/Place')
const { con_info } = require('./info')
const { email} = require('./lib/email')


const typeDefs = `

    type Mutation {
        createUser( user:infoUser! ):String!,
        updateUser( user:infoUser! ):String!,
        deleteUser( email:String! ):String!,
        updatePlace( id:String ):String!
    }
    
    type Query {
        get_places( params:searchPlace! ):[Place!],
        get_place_details( id:String ):Place
        get_places_by_ids( ids: [String!] ):[Place!]
        get_user( device_id:String, email:String, Password:String ): User!
        get_cuisines( params:searchPlace! ):[cuisine!]
        send_Email:String
        regular_search( value: String! ): [Place!]
    }

    type User{
        device_id:ID,
        firstName:String,
        lastName:String,
        displayName:String,
        email:String,
        phoneNumber:String,
        Birthday: String,
        Password:String,
        blockList_Places:[String!],
        blockList_Users:[String!],
        bookmarkList_Places:[String!],
        vistedPlaces:[String!],
        favoritesFood_Types:[String!],
        favoritesDrink_Types:[String!],
        favoritesPlace_Types:[String!],
        accountSettings:[settingUserProperty!],
        autologin:String
    }

    input infoUser {
        device_id:String,
        firstName:String,
        lastName:String,
        displayName:String,
        email:String!,
        phoneNumber:String,
        Birthday: String,
        Password:String,
        blockList_Places:[String!],
        blockList_Users:[String!],
        bookmarkList_Places:[String!],
        vistedPlaces:[String!],
        favoritesFood_Types:[String!],
        favoritesDrink_Types:[String!],
        favoritesPlace_Types:[String!],
        accountSettings:[i_settingUserProperty!],
        autologin:String
    }

    type settingUserProperty{
        Name:String!,
        Value:String!,
        createdAt:String!,
        updatedAt:String!
        Weight:String
    }

    input i_settingUserProperty{
        Name:String!,
        Value:String!,
        createdAt:String,
        updatedAt:String,
        Weight:String
    }

    input searchPlace{
        limit:Int
        coords:[Float]
        filters:[i_settingUserProperty!]
    }

    type currentLocation {
       type:String,
       coordinates:[Float!]
    }

    type Place {
        _id:ID!,
        Name:String!,
        Price:String,
        Address:String!,
        State:String,
        City:String,
        ZIP:String,
        Phone: String,
        Stars:String
        location:currentLocation,
        Categories:String,
        Points:Int
    }

    type cuisine{
        name:String,
        count:Int
    }

    type City{
        Name:String,
        Location:currentLocation!,
        State:String!
    }

    type Cuisine{
        Name:String!,
        PlacesAmount:Int!
    }
`;  

const resolvers = {

    Query: {

        get_places: async ( root, args ) => { 

            let place = new Place();
            return await place.getResult( args.params )

        },

        get_place_details: async ( root, args ) =>{
            let place = new Place();
            return await place.getDetails( args.id )
        },

        get_places_by_ids: async ( root, args ) => {
            let place = new Place();
            return await place.getListByIds( args.ids )
        },

        get_user: async( root, args ) => {
            let user = new User();
            return await user.getUser( args )
        },

        get_cuisines: async( root, args ) => {
            let place = new Place();
            return await place.getCuisines( args.params )
        },
        send_Email: async() => {

            let a = new email( { test: 'test' } )
            await a.send_email()
            return 'ok';
        },
        regular_search: async( root, args ) => {
            return await new Place().getRegularSearch( args.value )
        }

    },
    Mutation: {
        createUser: async ( root, args ) => {

            let user = new User();
            let search_result = await user.getUser( { email: args.user.email, Password: args.user.Password } )
            
            if( search_result.email == 'No User' ){
                return await user.setUser( { ...args.user } )
                
            }
            else{
                return "User Exisit"
            }

        },
        updateUser: async ( root, args ) => {

            let user = new User();
            return await user.updateUser( args.user )
            
        },
        deleteUser: async ( root, args ) => {

        },
        updatePlace: async( root, args ) => {
            let place = new Place();
            return  await place.updatePlace( { ...args } )
        }

    }
};

const server = new GraphQLServer( {
    typeDefs,
    resolvers
} )

server.options.port = process.env.PORT || 3500;
server.start( () => { 

    let connectionDB = new DB( 
        con_info.host,
        con_info.db,
        con_info.user,
        con_info.password, 
        { 
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useFindAndModify: false
        }
    )
    connectionDB.getDb();

    console.log('Server is up on port:' + server.options.port) } )
    .catch( err => {
        throw err;
    } )
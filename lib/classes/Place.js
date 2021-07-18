const PlaceModel = require('../../placeSchema');
const moment = require('moment');

class Place{

    #result

    constructor(){}

    #searchPlaces = async ( conditions ) => {

        let current_time = moment().format('Hmm');
        console.log( current_time )
        
        let coords = conditions.coords || [35.0456,-85.3097]
        let cat = conditions.filters.filter( el => el.Name === 'categories' )[0].Value.split(',');

        let findObj = {
            location:{
                $near:{
                    $geometry:{
                        type:"Point", 
                        coordinates: coords 
                    },
                    $maxDistance: ( parseFloat(conditions.filters.filter( el => el.Name === 'distance' )[0].Value ) || 100) * 1609
                }
            },
            $or:[
                {
                    Categories:{
                        "$regex": conditions.filters.filter( el => el.Name === 'categories' )[0].Value.replace( new RegExp(',','g'), '|' )
                    }
                },
                {Price: { $in: conditions.filters.filter( el => el.Name === 'price' )[0].Value.split( ',' ) }},
                {Stars: { $in: conditions.filters.filter( el => el.Name === 'stars' )[0].Value.split( ',' ) }}
            ]
        }

        let result = await PlaceModel.find( findObj );

        //check if places are open
        //result.map( el => el. )
        //this code will grade each placy by the amount of matching filters (need to be cleaner)
        result = result.map( el => {

            let cat = JSON.parse(el.Categories);

            if( conditions.filters[ 2 ].Value.split(',').indexOf( el.Price ) != -1 )
                el['Points'] += conditions.filters[ 2 ].Weight;
            if( conditions.filters[ 1 ].Value.split(',').indexOf( el.Stars ) != -1 )
                el['Points'] += conditions.filters[ 1 ].Weight;
            //point for each matching category
            for( let i = 0; i< cat.length; i++ ){
                if( conditions.filters[ 3 ].Value.split(',').indexOf( cat[i].title ) != -1 )
                    el['Points'] += conditions.filters[ 3 ].Weight
            }

            return el

        } )
        result.sort( ( place1, place2 ) => ( place2['Points'] - place1['Points'] ) );


        //remove duplicate results &  dont show place that are closed
        result = result
        .filter( ( obj, index, arr ) => arr.map( el => el.Name ).indexOf( obj.Name ) === index )
        .filter( place => {
            try{
                place['Open Time'] = JSON.parse( place['Open Time'] )
            }
            catch( err ){
                //console.log(place['Open Time'] )
            }
            return place
        } )
        

        return result.slice( 0, conditions.limit )

    }

    #regularSearch = async ( value ) => {
       
        let result = await PlaceModel.find( {
            $or: [
                {
                    Name: {
                        $regex: '.*' + value + '.*',
                        $options: "i"
                    }
                },
                {
                    Address: {
                        $regex: '.*' + value + '.*',
                        $options: "i"
                    }
                }
            ]
        } ).limit(20)

        return result
    }

    #searchPlacesById = async ( ids ) => {

        let result = await PlaceModel.find( {
            _id: { '$in': ids }
        } )
        return result
    }

    #placeDetails = async( id ) => {
        return await PlaceModel.findById( id );
    }

    #searchCuisines = async (conditions ) => {
        
        let coords = conditions.coords || [35.0456,-85.3097]

        let findObj = {
            location:{
                $near:{
                    $geometry:{
                        type:"Point", 
                        coordinates: coords 
                    },
                    $maxDistance: (conditions.distance || 100) * 1609
                }
            },
            $or:[
                {Categories:{"$regex": conditions.filters[ 3 ].Value.replace( new RegExp(',','g'), '|' )}},
                {Price: { $in: conditions.filters[ 2 ].Value.split( ',' ) }},
                {Stars: { $in: conditions.filters[ 1 ].Value.split( ',' ) }}
            ]
        }

        let result = await PlaceModel.find( findObj );
        result = result
        .filter( ( obj, index, arr ) => arr.map( el => el.Name ).indexOf( obj.Name ) === index )
        .map( el => JSON.parse( el.Categories ).map( cus => cus.title ) ).flat()
        
        //transform to a cusines result format
        let cuisines_result = result.reduce( ( new_arr, cur_el, index ) => {

                cur_el = cur_el.trim();

                if( index === 1 )
                    new_arr = [ {  name: new_arr.trim(), count: 1 } ]

                let match = false
                let indx = -1

                for( let i = 0; i < new_arr.length; i++ ){

                    if( new_arr[i].name === cur_el ) {
                        match = true;
                        indx = i;
                        break;
                    }
                    
                }

                ( match ) ? new_arr[indx].count++ : new_arr.push( { name: cur_el.trim(), count: 1 } )
            
                return new_arr

        } )

        cuisines_result = cuisines_result.sort( ( a, b ) => ( b.count - a.count ) )

        return cuisines_result;

    }

    updatePlace = async ( args ) => {
        //await PlaceModel.findByIdAndUpdate(  )
    }

    getResult = async ( conditions ) => await this.#searchPlaces( conditions )
    getListByIds = async ( ids ) => await this.#searchPlacesById( ids )
    getCuisines = async ( conditions ) => await this.#searchCuisines( conditions )
    getDetails = async ( id ) => await this.#placeDetails( id )
    getRegularSearch = async ( value ) => await this.#regularSearch( value )


}
module.exports = { Place: Place }
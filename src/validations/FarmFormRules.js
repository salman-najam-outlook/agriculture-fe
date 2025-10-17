export const farmRules = {
    farmName: [
        v => !!v || 'Farm Name is required',
        v => v ? (v.length <= 50 ? true: 'Farm Name should be less than 50 characters'): 'Farm name is required',
        v => v ? (Number(v) ? 'Farm Name should not be numbers': true): 'Farm name is required'
    ],
    farmers: [
        v => !!v || 'Farmer is required',
    ],
    farmerFirstName: [
        v => !!v || 'Farmer First Name is required',
        (v)=> {if (v) return v.length <= 50 || 'Farmer First Name must be less than 50 characters'},
        (v)=> {if (v) return !Number(v) || 'Farmer First Name must not contain numbers'}
    ],
    farmerLastName: [
        v => !!v || 'Farmer Last Name is required',
        (v)=> {if (v) return v.length <= 50 || 'Farmer Last Name must be less than 50 characters'},
        (v)=> {if (v) return !Number(v) || 'Farmer Last Name must not contain numbers'}
    ],
    farmType: [
        v => !!v || 'Farm Type is required',
        (v)=> {if (v) return v.length <= 20 || 'Farm Type must be less than 20 characters'},
        (v)=> {if (v) return  !Number(v) || 'Farm Type must not contain numbers'}
    ],
    ownerId: [
        v => !!v || 'Farm Owner is required',
        // (v)=> {if (v) return v.length <= 8 || 'Active Ingredients must be less than 8 characters'},
        // (v)=> {if (v) return  !Number(v) || 'Active Ingredients must not contain numbers'}
    ],
    farmOwnershipType:[
        v => !!v || 'Ownership Type is required',
        // (v)=> {if (v) return v.length <= 8 || 'Drug Formate must be less than 8 characters'},
        // (v)=> {if (v) return  !Number(v) || 'Drug Formate must not contain numbers'}
    ],
    govRegistrationNo:[
        v => !!v || 'Government Registration Number is required',
        (v)=> {if (v) return  Number(v) || 'Government Registration Number must contain numbers'},
        (v)=> {if (v) return v>0  || 'Government Registration Number must be gearter than zero'},
        (v)=> {if (v) return v.length <= 8 || 'Government Registration Number must be less than 8 characters'},
    ],
    contractMating:[
        v => !!v || 'Contract Mating is required',
        (v)=> {if (v) return v.length <= 10 || 'Contract Mating must be less than 10 characters'},
        (v)=> {if (v) return  !Number(v) || 'Contract Mating must not contain numbers'}
    ],
    productionSystem:[
        v => !!v || 'Production System is required',
    ],
    cooperativeID:[
        v => !!v || 'Cooperative ID is required',
        (v)=> {if (v) return  Number(v) || 'Cooperative ID must contain numbers'},
        (v)=> {if (v) return v>0  || 'Cooperative ID must be gearter than zero'}
    ],
    licenceNumber:[
        v => !!v || 'Licence Number is required',
        (v)=> {if (v) return  Number(v) || 'Licence Number must contain numbers'},
        (v)=> {if (v) return v>0  || 'Licence Number must be gearter than zero'}
    ],
    // licenceED:[
    //     v => !!v || 'Licence Expiry Date is required',
    // ],
    regulatorName:[
        v => !!v || 'Regulator Name is required',
        (v)=> {if (v) return v.length <= 10 || 'Regulator Name must be less than 10 characters'},
        (v)=> {if (v) return  !Number(v) || 'Regulator Name must not contain numbers'}
    ],
    regulatorRepName:[
        v => !!v || 'Regulator Representative Name is required',
        (v)=> {if (v) return v.length <= 10 || 'Regulator Representative Name must be less than 10 characters'},
        (v)=> {if (v) return  !Number(v) || 'Regulator Representative Name must not contain numbers'}
    ],
    lat:[
        v => !!v || 'Latitude Number is required',
        (v)=> {if (v) return  Number(v) || 'Latitude Number must not contain characters'}
    ],
    log:[
        v => !!v || 'Longitude Number is required',
        (v)=> {if (v) return  Number(v) || 'Longitude Number must contain only numbers'}
    ],
    address: [
        v => !!v || 'Farm Location is required.',
    ],
    country: [
        v => !!v || 'Country is required',
    ],
    state: [
        v => !!v || 'State is required',
    ],
    city: [
        v => !!v || 'City is required',
    ],
    street: [
        v => !!v || 'Postal is required',
    ],
}
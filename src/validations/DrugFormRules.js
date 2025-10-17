export const drugRules = {
    drugName: [
        v => !!v || 'Drug Name is required',
        (v)=> (v&&v.length <= 10) || 'Drug Name must be less than 10 characters',
        (v)=> !Number(v) || 'Drug name must not contain numbers'
    ],
    genericName: [
        v => !!v || 'Generic Name is required',
        (v)=> {if (v) return v.length <= 10 || 'Generic Name must be less than 10 characters'},
        (v)=> {if (v) return  !Number(v) || 'Generic Name must not contain numbers'}
    ],
    activeIngredients: [
        v => !!v || 'Active Ingredients is required',
        (v)=> {if (v) return v.length <= 8 || 'Active Ingredients must be less than 8 characters'},
        (v)=> {if (v) return  !Number(v) || 'Active Ingredients must not contain numbers'}
    ],
    drugFormate:[
        (v)=> {if (v) return v.length <= 8 || 'Drug Formate must be less than 8 characters'},
        (v)=> {if (v) return  !Number(v) || 'Drug Formate must not contain numbers'}
    ],
    distributor:[
        v => !!v || 'Distributor Name is required',
        (v)=> {if (v) return v.length <= 8 || 'Active Ingredients must be less than 8 characters'},
        (v)=> {if (v) return  !Number(v) || 'Active Ingredients must not contain numbers'}
    ],
    registrationDate:[
        v => !!v || 'Registration Date is required',
    ],
    packId:[
        (v)=> {if (v) return v.length <= 8 || 'PackId must be less than 8 characters'},
        (v)=> {if (v) return  Number(v) || 'PackId must contain numbers'},
        (v)=> {if (v) return v>0  || 'PackId must be gearter than zero'}
    ],
    packBatchNumber:[
        (v)=> {if (v) return  Number(v) || 'Batch Number must contain numbers'},
        (v)=> {if (v) return v>0  || 'Batch Number must be gearter than zero'}
    ],
    packConsistQty:[
        (v)=> {if (v) return  Number(v) || 'Quantity must contain numbers'},
        (v)=> {if (v) return v>0  || 'Quantity must be gearter than zero'}
    ],
    packTotalVolLeft:[
        (v)=> {if (v) return  Number(v) || 'Volume contain numbers'},
        (v)=> {if (v) return v >0  || 'Volume must be gearter than zero'}
    ],
    manufacturer:[
        v => !!v || 'Manufacture Name is required',
        (v)=> {if (v) return v.length <= 8 || 'Manufacture Name must be less than 8 characters'},
        (v)=> {if (v) return  !Number(v) || 'Manufacture Name  must not contain numbers'}
    ],
    substituteDrugNo:[
        v => !!v || 'Substitute Number is required',
        (v)=> {if (v) return v.length <= 8 || 'Substitute Number must be less than 8 characters'},
        (v)=> {if (v) return  Number(v) || 'Substitute Number must not contain characters'}
    ],
    packOrderId:[
        (v)=> {if (v) return v.length <= 8 || 'ID must be less than 8 characters'},
        (v)=> {if (v) return  Number(v) || 'ID must contain only numbers'}
    ],
    packShippingId:[
        (v)=> {if (v) return v.length <= 8 || 'ID must be less than 8 characters'},
        (v)=> {if (v) return  Number(v) || 'ID must contain only numbers'}
    ],
    specialistId:[
        (v)=> {if (v) return v.length <= 8 || 'ID must be less than 8 characters'},
        (v)=> {if (v) return  Number(v) || 'ID must contain only numbers'}
    ],
    specialistName:[
        (v)=> {if (v) return v.length <= 8 || 'Specialist Name must be less than 8 characters'},
        (v)=> {if (v) return  !Number(v) || 'Specialist Name  must not contain numbers'}
    ],
    packRecepientAnimalId:[
        (v)=> {if (v) return v.length <= 8 || 'ID must be less than 8 characters'},
        (v)=> {if (v) return  Number(v) || 'ID must contain only numbers'},
        (v)=> {if (v) return v >0  || 'ID must be gearter than zero'}
    ],
    packRecepientFarmId:[
        (v)=> {if (v) return v.length <= 8 || 'ID must be less than 8 characters'},
        (v)=> {if (v) return  Number(v) || 'ID must contain only numbers'},
        (v)=> {if (v) return v >0  || 'ID must be gearter than zero'}
    ],
    packRecepientKeeperId:[
        (v)=> {if (v) return v.length <= 8 || 'ID must be less than 8 characters'},
        (v)=> {if (v) return  Number(v) || 'ID must contain only numbers'},
        (v)=> {if (v) return v >0  || 'ID must be gearter than zero'}
    ],
    packReservedByFarmId:[
        (v)=> {if (v) return v.length <= 8 || 'ID must be less than 8 characters'},
        (v)=> {if (v) return  Number(v) || 'ID must contain only numbers'},
        (v)=> {if (v) return v >0  || 'ID must be gearter than zero'}
    ],
    packReservedBykeeperId:[
        (v)=> {if (v) return v.length <= 8 || 'ID must be less than 8 characters'},
        (v)=> {if (v) return  Number(v) || 'ID must contain only numbers'},
        (v)=> {if (v) return v >0  || 'ID must be gearter than zero'}
    ],
    warehouseId:[
        (v)=> {if (v) return v.length <= 8 || 'ID must be less than 8 characters'},
        (v)=> {if (v) return  Number(v) || 'ID must contain only numbers'},
        (v)=> {if (v) return v >0  || 'ID must be gearter than zero'}
    ],
    locationRackId:[
        (v)=> {if (v) return v.length <= 8 || 'ID must be less than 8 characters'},
        (v)=> {if (v) return  Number(v) || 'ID must contain only numbers'},
        (v)=> {if (v) return v >0  || 'ID must be gearter than zero'}
    ],
    locationTierId:[
        (v)=> {if (v) return v.length <= 8 || 'ID must be less than 8 characters'},
        (v)=> {if (v) return  Number(v) || 'ID must contain only numbers'},
        (v)=> {if (v) return v >0  || 'ID must be gearter than zero'}
    ],
    locationPositionId:[
        (v)=> {if (v) return v.length <= 8 || 'ID must be less than 8 characters'},
        (v)=> {if (v) return  Number(v) || 'ID must contain only numbers'},
        (v)=> {if (v) return v >0  || 'ID must be gearter than zero'}
    ],
    packReleaseId:[
        (v)=> {if (v) return v.length <= 8 || 'ID must be less than 8 characters'},
        (v)=> {if (v) return  Number(v) || 'ID must contain only numbers'},
        (v)=> {if (v) return v >0  || 'ID must be gearter than zero'}
    ],
    packPrice:[
        (v)=> {if (v) return v >0  || 'Price must be gearter than zero'}
    ],
    packQtyOrdered:[
        (v)=> {if (v) return v >0  || 'Pack Quantity must be gearter than zero'} 
    ]
}
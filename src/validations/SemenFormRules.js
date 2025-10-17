export const semenRules = {
    sireId: [
        v => !!v || 'Sire Id is required',
    ],
    collectionDate: [
        v => !!v || 'Collection Date is required',
    ],
    econIndexVal:[
        v => !!v || 'Economic Index is required',
        (v)=> {if (v) return  Number(v) || 'Economic Index must contain numbers'},
        (v)=> {if (v) return  v>0 || 'Economic Index cannot be less than zero'},
    ],
    econIndexValUom: [
        v => !!v || 'Unit is required',
    ],
    progeniesCount: [
        v => !!v || 'Progenies Count is required',
        (v)=> {if (v) return  Number(v) || 'Progenies Count must contain numbers'},
        (v)=> {if (v) return  v>0 || 'Progenies Count cannot be less than zero'},
    ],
    customerName:[
        v => !!v || 'Customer Name is required',
        (v)=> {if (v) return  !Number(v) || 'Customer Name must not contain numbers'},
        (v)=> {if (v) return  v.length<=4 || 'Customer Name cannot be more than 4'},
    ],
    customerAddress: [
        v => !!v || 'Customer Address is required',
        (v)=> {if (v) return  !Number(v) || 'Customer Address must not contain numbers'},
        (v)=> {if (v) return  v.length<=8 || 'Customer Address cannot be less than zero'},
    ],
    postId: [
        v => !!v || 'Post ID is required',
        (v)=> {if (v) return  Number(v) || 'Post ID must contain numbers'},
        (v)=> {if (v) return  v>0 || 'Post ID cannot be less than zero'},
    ],
    orderDate: [
        v => !!v || 'Order Date is required',
    ],
    postageDate: [
        v => !!v || 'Postage Date is required',
    ],
    deliveryDate: [
        v => !!v || 'Delivery Date is required',
    ],
    packId:[
        v => !!v || 'PackId is required',
        (v)=> {if (v) return v.length <= 8 || 'PackId must be less than 8 characters'},
        (v)=> {if (v) return  Number(v) || 'PackId must contain numbers'},
        (v)=> {if (v) return v>0  || 'PackId must be gearter than zero'}
    ],
    orderedStrawNum:[
        v => !!v || 'Ordered Straw is required',
        (v)=> {if (v) return  Number(v) || 'Ordered Straw must contain numbers'},
        (v)=> {if (v) return  v>0 || 'Ordered Straw cannot be less than zero'},
    ],
    packingTechnician:[
        v => !!v || 'Packing Technician is required',
        (v)=> {if (v) return  !Number(v) || 'Packing Technician must not contain numbers'},
        (v)=> {if (v) return  v.length<=4 || 'Packing Technician cannot be more than 4'},
    ],
    strawId:[
        v => !!v || 'StrawId is required',
        (v)=> {if (v) return v.length <= 8 || 'StrawId must be less than 8 characters'},
        (v)=> {if (v) return  Number(v) || 'StrawId must contain numbers'},
        (v)=> {if (v) return v>0  || 'StrawId must be gearter than zero'}
    ],
    numOfStaws:[
        v => !!v || 'Number of Straw is required',
        (v)=> {if (v) return  Number(v) || 'Number of Straw must contain numbers'},
        (v)=> {if (v) return  v>0 || 'Number of Straw cannot be less than zero'},
    ],
    batchNumber:[
        v => !!v || 'Batch Number is required',
        (v)=> {if (v) return  Number(v) || 'Batch Number must contain numbers'},
        (v)=> {if (v) return  v>0 || 'Batch Number cannot be less than zero'},
    ],
    locationId:[
        v => !!v || 'LocationId is required',
        (v)=> {if (v) return v.length <= 8 || 'LocationId must be less than 8 characters'},
        (v)=> {if (v) return  Number(v) || 'LocationId must contain numbers'},
        (v)=> {if (v) return v>0  || 'LocationId must be gearter than zero'}
    ],
    approvedManually:[
        v => !!v || 'Approved Manually is required',
        (v)=> {if (v) return  Number(v) || 'Approved Manually must contain numbers'},
        (v)=> {if (v) return v>0  || 'Approved Manually must be gearter than zero'}
    ],
    researcher:[
        v => !!v || 'Researcher is required',
        (v)=> {if (v) return  !Number(v) || 'Researcher must not contain numbers'},
        (v)=> {if (v) return  v.length<=4 || 'Researcher cannot be more than 4'},
    ],
    approvalDate: [
        v => !!v || 'Approval Date is required',
    ],
    recessiveDiseases:[
        v => !!v || 'Recessive Diseases is required',
        (v)=> {if (v) return  !Number(v) || 'Recessive Diseases must not contain numbers'},
        (v)=> {if (v) return  v.length<=4 || 'Recessive Diseases cannot be more than 4'},
    ],
    collectionTechnician:[
        v => !!v || 'Collection Technician is required',
        (v)=> {if (v) return  !Number(v) || 'Collection Technician must not contain numbers'},
        (v)=> {if (v) return  v.length<=4 || 'Collection Technician cannot be more than 4'},
    ],
    preperationTechnician:[
        v => !!v || 'Preperation Technician is required',
        (v)=> {if (v) return  !Number(v) || 'Preperation Technician must not contain numbers'},
        (v)=> {if (v) return  v.length<=4 || 'Preperation Technician cannot be more than 4'},
    ],
    semenCollectionDate: [
        v => !!v || 'Collection Date is required',
    ],
    semenPreparationDate: [
        v => !!v || 'Preparation Date is required',
    ],
    semenMotility:[
        v => !!v || 'Semen Motility is required',
        (v)=> {if (v) return  Number(v) || 'Semen Motility must contain numbers'},
        (v)=> {if (v) return v>0  || 'Semen Motility must be gearter than zero'}
    ],
    semenConcentration:[
        v => !!v || 'Concentration is required',
        (v)=> {if (v) return  Number(v) || 'Concentration must contain numbers'},
        (v)=> {if (v) return v>0  || 'Concentration must be gearter than zero'}
    ],
    semenConcentrationUom:[
        v => !!v || 'unit is required',
    ],
}
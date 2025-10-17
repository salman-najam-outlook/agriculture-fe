export const healthRules = {
    drugId: [
        v => !!v || 'DrugId is required',
        (v)=> (v&&v.length <= 10) || 'DrugId must be less than 10 characters',
    ],
    drugName: [
        v => !!v || 'Drug Name is required',
        (v)=> {if (v) return v.length<=10 || 'Drug Name cannot be more than 10'},
        (v)=> {if (v) return  !Number(v) || 'Drug Name should not contain number'}
    ],
    packId:[
        v => !!v || 'Pack Id is required',
        (v)=> {if (v) return  Number(v) || 'Pack Id must contain numbers'},
        (v)=> {if (v) return  v>=1 || 'Pack Id cannot be less than zero'}
    ],
    treatmentDate: [
        v => !!v || 'Treatment Date  is required',
    ],
    treatment:[
        v => !!v || 'Treatment is required',
        (v)=> {if (v) return v.length<=10 || 'Drug Name cannot be more than 10'},
        (v)=> {if (v) return  !Number(v) || 'Drug Name should not contain number'}
    ],
    treatmentReason:[
        v => !!v || 'Treatment Reason is required',
        (v)=> {if (v) return v.length<=10 || 'Treatment Reason cannot be more than 10'},
        (v)=> {if (v) return  !Number(v) || 'Treatment Reason should not contain number'}
    ],
    
    diagnosis:[
        v => !!v || 'Diagnosis is required',
        (v)=> {if (v) return v.length<=10 || 'Diagnosis cannot be more than 10'},
        (v)=> {if (v) return  !Number(v) || 'Diagnosis should not contain number'}
    ],
    
    drugWithdrawPeriod:[
        v => !!v || 'Withdraw Period is required',
        (v)=> {if (v) return v.length<=10 || 'Withdraw Period cannot be more than 10'},
        (v)=> {if (v) return  !Number(v) || 'Withdraw Period should not contain number'}
    ],
    attendingVeterinarian:[
        v => !!v || 'Attending Veterinarian is required',
        (v)=> {if (v) return v.length<=10 || 'Attending Veterinarian cannot be more than 10'},
        (v)=> {if (v) return  !Number(v) || 'Attending Veterinarian should not contain number'}
    ], 
}
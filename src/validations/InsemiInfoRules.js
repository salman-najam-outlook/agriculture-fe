export const insemiRules = {
    inseminatorNumber: [
        v => !!v || 'InseminatorId is required',
        (v)=> (v&&v.length <= 10) || 'InseminatorId must be less than 10 characters',
    ],
    inseminatorName: [
        v => !!v || 'Inseminator Name is required',
        (v)=> {if (v) return v.length<=10 || 'Inseminator Name cannot be more than 10'},
        (v)=> {if (v) return  !Number(v) || 'Inseminator Name should not contain number'}
    ],
    conceptionRate:[
        v => !!v || 'Conecption Rate is required',
        (v)=> {if (v) return  Number(v) || 'Conception Rate must contain numbers'},
        (v)=> {if (v) return  v>=1 || 'Conception Rate cannot be less than zero'}
    ],
    dateOfMeasurement: [
        v => !!v || 'Date of Measurement  is required',
    ],
}
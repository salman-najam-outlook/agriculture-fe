export const genoRules = {
    breedId: [
        v => !!v || 'BreedId is required',
    ],
    chromosome: [
        v => !!v || 'Chromosome is required',
        (v)=> {if (v) return  Number(v) || 'Chromosome should contain number'},
        (v)=> {if (v) return  v>0 || 'Chromosome cannot be less than zero'}
    ],
    sequenceChange:[
        v => !!v || 'Sequence Change is required',
        (v)=> {if (v) return  Number(v) || 'Sequence Change must contain numbers'},
        (v)=> {if (v) return  v>0 || 'Sequence Change cannot be less than zero'},
        (v)=> {if (v) return  v.length>=4 || 'Sequence Change cannot be more than 4'}
    ],
    inheritance: [
        v => !!v || 'Inheritance is required',
    ],
    diseaseName: [
        v => !!v || 'Disease Name is required',
        (v)=> {if (v) return v.length<=10 || 'Disease Name cannot be more than 10'},
        (v)=> {if (v) return  !Number(v) || 'Disease Name should not contain number'}
    ],
    referenceSequence:[
        v => !!v || 'Reference Sequence is required',
        (v)=> {if (v) return  Number(v) || 'Reference Sequence must contain numbers'},
        (v)=> {if (v) return  v>0 || 'Reference Sequence cannot be less than zero'},
    ],
    pubmedReference: [
        v => !!v || 'Pubmed Reference is required',
        (v)=> {if (v) return  Number(v) || 'Pubmed Reference must contain numbers'},
        (v)=> {if (v) return  v>0 || 'Pubmed Reference cannot be less than zero'},
    ],
}
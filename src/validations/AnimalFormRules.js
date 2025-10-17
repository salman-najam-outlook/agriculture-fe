export const animalRules =  {
    tagType: [
        v => !!v || 'Tag Type is required',
    ],
    tagNumber: [
        v => !!v || 'Tag number is required',
    ],
    registrationNumber: [
        v => !!v || 'Reg. No. is required',
    ],
    birthWeight: [
        v => !!v || 'Birth weight is required',
    ],
    birthEase: [
        v => !!v || 'Birth Ease is required',
    ],
    birthFarmId: [
        v => !!v || 'Birth Farm is required',
    ],
    surrogateDamPubId: [
        v => !!v || 'Sur. Dam is required',
    ],
    ownerName: [
        v => !!v || 'Owner name is required',
    ],
    damPubId: [
        v => !!v || 'Dam is required',
    ],
    sirePubId: [
        v => !!v || 'Sire is required',
    ],
    breed: [
        v => !!v || 'Breed is required',
    ],
    gender: [
        v => !!v || 'Gender is required',
    ],
    dob: [
        v => !!v || 'Date of Birth is required',
    ],
    operator: [
        v => !!v || 'Operator is required',
    ],
    animalRemovedFarmId: [
        v => !!v || 'Removal Farm is required',
    ],
    animalRemovalDate: [
        v => !!v || 'Removal Date is required',
    ],
    removedAnimalDestination: [
        v => !!v || 'Destination is required',
    ],
    animalRemovalReason: [
        v => !!v || 'Removal Reason is required',
    ],
}
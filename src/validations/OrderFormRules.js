export const orderRules={
    farmNumber: [
        v => !!v || 'Farm Number is required',
    ],
    productNumber: [
        v => !!v || 'Product Name is required',
    ],
    transactionId: [
        v => !!v || 'Transaction Id is required',
        (v)=> {if (v) return v.length <= 8 || 'Transaction Id must be less than 8 characters'},
        (v)=> {if (v) return  Number(v) || 'Transaction Id must contain numbers'}
    ],
    transactionDate:[
        v => !!v || 'Transaction Date is required',
    ],
    productQty:[
        v => !!v || 'Product Quantity is required',
        (v)=> {if (v) return  Number(v) || 'Product Quantity must contain numbers'},
        (v)=> {if (v) return v>0  || 'Product Quantity must be gearter than zero'}
    ],
    productQtyUom:[
        v => !!v || 'Product Unit is required',
    ],
    recipientId:[
        v => !!v || 'Recipient Id is required',
        (v)=> {if (v) return v.length <= 8 || 'Recipient Id must be less than 8 characters'},
        (v)=> {if (v) return  Number(v) || 'Recipient Id must contain numbers'}
    ],
    recipientName:[
        v => !!v || 'Recipient Name is required',
        (v)=> {if (v) return v.length <= 10 || 'Recipient Name must be less than 10 characters'},
        (v)=> {if (v) return  !Number(v) || 'Recipient Name must not contain numbers'}
    ],
    recipientType:[
        v => !!v || 'Recipient Type is required',
        (v)=> {if (v) return v.length <= 10 || 'Recipient Type must be less than 10 characters'},
        (v)=> {if (v) return  !Number(v) || 'Recipient Type must not contain numbers'}
    ],
    totalPrice:[
        v => !!v || 'Price is required',
        (v)=> {if (v) return  Number(v) || 'Price must contain numbers'},
    ],
    currency:[
        v => !!v || 'Currency is required',
    ],
    address:[
        v => !!v || 'Address is required',
    ],
}
export const productRules = {
    name: [
        v => !!v || 'Product Name is required',
        (v)=> (v&&v.length <= 10) || 'Product Name must be less than 10 characters',
        (v)=> !Number(v) || 'Product Name must not contain numbers'
    ],
    stockQty: [
        v => !!v || 'Stock Quantity is required',
        (v)=> {if (v) return v >= 0 || 'Stock Quantity cannot be less than Zero'},
    ],
    stockUom: [
        v => !!v || 'Stock Unit  is required',
    ],
}
/**
 * Base Units
 * 
 * Here is a list of base units for each area of measurement
 * used to dynamically update values
 * 
 * Weight: kg
 * Volume: m3
 * Distance: m
 */

const conversionRates = {
    distance: {
        m: 1,
        km: 0.001,
        mi: 0.0006213712
    },
    weight: {
        gm: 1000,
        kg: 1,
        lbs: 2.204623
    },
    volume: {
        m3: 1,
        km3: 0.000000001,
        cm3: 1000000,
        mm3: 1000000000
    }
};

const convert = (type, unit, amount, to = false) => {
    if(amount == 0) return '0';
    return (to ? amount / conversionRates[type][unit] : conversionRates[type][unit] * amount).toFixed(6);
};

export default {
    fromBase: {
        distance(unit, amount) {
            return convert('distance', unit, amount);
        },
        weight(unit, amount) {
            return convert('weight', unit, amount);
        },
        volume(unit, amount) {
            return convert('volume', unit, amount);
        }
    },
    toBase: {
        distance(unit, amount) {
            return convert('distance', unit, amount, true);
        },
        weight(unit, amount) {
            return convert('weight', unit, amount, true);
        },
        volume(unit, amount) {
            return convert('volume', unit, amount, true);
        }
    }
};


export const acreToHectare=  (acre)  => {
    return parseFloat((acre * 0.404686011).toFixed(4));
}


export const hactareToAcre = (hactare) => {
    return  parseFloat((hactare  * 2.47105).toFixed(4))
}
// googleMapsLoader.js
import { Loader } from '@googlemaps/js-api-loader';

let loaderInstance;

export function getGoogleMapsLoader(options) {
    if (!loaderInstance) {
        loaderInstance = new Loader(options);
    }
    return loaderInstance;
}
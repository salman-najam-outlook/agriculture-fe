import axios from 'axios';

export const URLS = {
  allFarmWithZones: 'farm/options/farms-with-zones',
};

export const getAllFarmWithZones = async () => {
  const response = await axios.get(URLS.allFarmWithZones);
  return response.data;
};

import _ from "lodash";
import moment from 'moment';
import Vue from 'vue';
import { PTSI_ADMIN_ROLES } from "./constants/roles"; 
import store from "./store"; 

export function convertSizeIntoBaseUnit(farmSize) {
  const currentAreaUnit = JSON.parse(localStorage.getItem("gs"))?.areaUnit;
  let convertedFarmSize = farmSize;

  if (currentAreaUnit) {
    const factor = currentAreaUnit.factor;
    if (currentAreaUnit.name !== "Acre" && factor > 0) {
      convertedFarmSize = farmSize / factor;
    }
  }

  const currentAreaUnitName = currentAreaUnit ? currentAreaUnit.name : "Acre";

  return convertedFarmSize ? parseFloat(convertedFarmSize).toFixed(3) + " " + currentAreaUnitName : 0 + " " + currentAreaUnitName;
}

export function convertSizeIntoBaseUnitNumberOnly(farmSize) {
  const currentAreaUnit = JSON.parse(localStorage.getItem("gs"))?.areaUnit;
  let convertedFarmSize = farmSize;

  if (currentAreaUnit) {
    const factor = currentAreaUnit.factor;
    if (currentAreaUnit.name !== "Acre" && factor > 0) {
      convertedFarmSize = farmSize / factor;
    }
  }

  // const currentAreaUnitName = currentAreaUnit ? currentAreaUnit.name : "Acre";

  return parseFloat(convertedFarmSize).toFixed(3);
}

export function convertWeightIntoBaseUnit(weight) {
  const currentWeightUnit = JSON.parse(localStorage.getItem("gs"))?.weightUnit;
  let convertedWeight = weight;

  if (currentWeightUnit) {
    const factor = currentWeightUnit.factor;
    if (currentWeightUnit.name !== "Kilogram" && factor > 0) {
      convertedWeight = weight / factor;
    }
  }

  const currentWeightUnitName = currentWeightUnit ? currentWeightUnit.abbvr : "KG";

  return convertedWeight ? parseFloat(convertedWeight).toFixed(3) + " " + currentWeightUnitName : 0 + " " + currentWeightUnitName;
}

export function convertWeightIntoBaseUnitNumberOnly(weight) {
  const currentWeightUnit = JSON.parse(localStorage.getItem("gs"))?.weightUnit;
  let convertedWeight = weight;

  if (currentWeightUnit) {
    const factor = currentWeightUnit.factor;
    if (currentWeightUnit.name !== "Kilogram" && factor > 0) {
      convertedWeight = weight / factor;
    }
  }

  return parseFloat(convertedWeight).toFixed(3);
}

export function getRandomColor() {
  const red = _.random(_.random(100, 200, 0), 255, 0);
  const green = _.random(_.random(100, 200, 0), 255, 0);
  const blue = _.random(_.random(100, 200, 0), 255, 0);
  const color = "#" + red.toString(16) + green.toString(16) + blue.toString(16);
  return color;
}

export function getRandomColors() {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return `#${randomColor.padStart(6, "0")}`; // Ensure the color has 6 digits
}
export function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}
export function getColorByBgColor(hex) {
  const [r, g, b] = hexToRgb(hex);
  return ((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186 ? '#000000' : '#ffffff';
}
export function colorDistance(color1, color2) {
  const [r1, g1, b1] = hexToRgb(color1);
  const [r2, g2, b2] = hexToRgb(color2);
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}
export function isColorTooClose(newColor, colorMap) {
  const threshold = 100; // Adjust this threshold as needed
  for (let key in colorMap) {
    if (colorDistance(newColor, colorMap[key]) < threshold) {
      return true;
    }
  }
  return false;
}
export function getColorHash(colorMap) {
  let fillColor;
  do {
    fillColor = getRandomColors();
  } while (isColorTooClose(fillColor, colorMap));
  return fillColor;
}

  export function getEUDRDeforestationStatus(status) {
    switch (status) {
        case 'Zero/Negligible Deforestation Probability':
        case 'Zero/Negligible Probability':
            return { class: 'green-button', text: 'Zero/Negligible Deforestation Probability' };
        case 'Very High Deforestation Probability':
        case 'Very High Probability':
            return { class: 'very-high-button', text: 'Very High Deforestation Probability' };
        case 'Very Low Deforestation Probability':
        case 'Very Low Probability':
            return { class: 'very-low-button', text: 'Very Low Deforestation Probability' };
        case 'High Deforestation Probability':
        case 'High Probability':
            return { class: 'red-button', text: 'High Deforestation Probability' };
        case 'Low Deforestation Probability':
        case 'Low Probability':
            return { class: 'orange-button', text: 'Low Deforestation Probability' };
        case 'Medium Deforestation Probability':
        case 'Medium Probability':
            return { class: 'medium-button', text: 'Medium Deforestation Probability' };
        case 'Manually Deforestation Mitigated':
        case 'Manually Mitigated':
            return { class: 'manually-button', text: 'Manually Mitigated' };
        default:
            return { class: '', text: 'N/A' };
        }
  }
  

export const getEUDRStatusOptions = () => [
    { text: "All Status", val: "" },
    { text: "Very High Deforestation Probability", val: "Very High Deforestation Probability" },
    { text: "High Deforestation Probability", val: "High Deforestation Probability" },
    { text: "Medium Deforestation Probability", val: "Medium Deforestation Probability" },
    { text: "Low Deforestation Probability", val: "Low Deforestation Probability" },
    { text: "Very Low Deforestation Probability", val: "Very Low Deforestation Probability" },
    { text: "Zero/Negligible Deforestation Probability", val: "Zero/Negligible Deforestation Probability" },
    { text: "Manually Deforestation Mitigated", val: "Manually Deforestation Mitigated" },
];

export const getRiskAssessmentStatusOptions = () => [
    { text: "All Status", val: "" },
    { text: "Approved", val: "approved" },
    { text: "Mitigation Required", val: "mitigation_required" },
    { text: "Rejected", val: "rejected" },
];

export function getRiskAssessmentStatus(status) {
    switch (status) {
        case 'approved':
            return { class: 'green-button', text: 'Approved' };
        case 'mitigation_required':
            return { class: 'orange-button', text: 'Mitigation Required' };
        case 'rejected':
            return { class: 'red-button', text: 'Rejected' };
        default:
            return { class: '', text: 'N/A' };
        }
  }

export async function wait(milliseconds = 1000) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
export async function withRetry(operation, config = { retryTimes: 5, retryDelay: 3000 }) {
  const retryTimes = config.retryTimes;
  const retryDelay = config.retryDelay;
  if (typeof operation !== 'function') return;
  return new Promise((resolve, reject) => {
    operation()
      .then(resolve)
      .catch((error) => {
        if (retryTimes > 0) {
          return wait(retryDelay)
            .then(withRetry.bind(null, operation, { retryTimes: retryTimes - 1, retryDelay }))
            .then(resolve)
            .catch(reject);
        }
        return reject(error);
      });
  });
}

export function isDeforestationExpired(date, eudrSetting) {
  if(!date || !eudrSetting || !eudrSetting.dynamicExpiryTime || !eudrSetting.dynamicExpiryTimePeriod) return true;
  const expiryDate = moment(date).add(eudrSetting.dynamicExpiryTime, eudrSetting.dynamicExpiryTimePeriod);
  return expiryDate.isAfter(moment.now());
}

export function isIndonesianClient() {
  // const user = JSON.parse(localStorage.getItem('user'));
   const user = store.getters.getUser;
  if(!user) return false;
  return user?.user_organization?.name == 'PT Surveyor Indonesia'
  //return user.user_role_assoc.some(role => role.id === 'indonesia_admin' || role.id === 'dds_exporter' || role.id === 'dds_ptsi');
}

export function isKenyaClient() {
  // const user = JSON.parse(localStorage.getItem('user'));
   const user = store.getters.getUser;
  if(!user) return false;
  return (user?.user_organization?.name == 'National Coffee Cooperative Union' || user?.user_organization?.name == 'test_org33412');
  // return user.user_role_assoc.some(role => role.id === 'naccu_kenya_admin' || role.id === 'naccu_naccu');
}

export function currentRoles() {
  // const user = JSON.parse(localStorage.getItem('user'));
   const user = store.getters.getUser;
  if(!user) return [];
  return user.user_role_assoc.map(role => role.id);
}

export function currentUser() {
   // const user = JSON.parse(localStorage.getItem('user'));
   const user = store.getters.getUser;
  if(!user) return {};
  return user
}

export function isDdsExporter() {
   // const user = JSON.parse(localStorage.getItem('user'));
   const user = store.getters.getUser;
  if(!user) return false;
  return user.user_role_assoc.some(role => role.id === 'dds_exporter');
}

export function isPtsiApproval(){
  // const user = JSON.parse(localStorage.getItem('user'));
   const user = store.getters.getUser;
  if(!user) return false;
  return user.user_role_assoc.some(role => PTSI_ADMIN_ROLES.includes(role.id));
}

export const EventBus = new Vue();

/**
 * Decode HTML entities in a string
 * @param {string} str - The string containing HTML entities
 * @returns {string} - The decoded string
 */
export function decodeHtmlEntities(str) {
  if (!str || typeof str !== 'string') {
    return str;
  }
  
  // Create a temporary DOM element to decode HTML entities
  const textarea = document.createElement('textarea');
  textarea.innerHTML = str;
  return textarea.value.trim();
}

/**
 * Check if user has permission for a specific module and action
 * @param {string} moduleId - The module ID to check (e.g., 'indonesia_ptsi_admin_roles')
 * @returns {boolean} - True if user has permission, false otherwise
 */
export function checkPermission(moduleId) {
  try {
    // const moduleAndPermissions = JSON.parse(localStorage.getItem('moduleAndPermissions') || '[]');
    // const rolesIds = JSON.parse(localStorage.getItem('user') || '[]')?.user_role_assoc?.map(role => role.id);
    const moduleAndPermissions = store.getters.getUser.moduleAndPermissions || []
    const rolesIds = store.getters.getUser?.user_role_assoc?.map(role => role.id) || [];
    if (!moduleAndPermissions || !Array.isArray(moduleAndPermissions) || !rolesIds.length) {
      return false;
    }
    
    // Create eligible permission IDs by combining roles with permissionId (mirrors backend logic)
    const eligiblePermissionId = rolesIds.map((role) => `${role}_${moduleId}`); 
    // Check if user has permission for this module (mirrors backend hasPermission logic)
    return moduleAndPermissions.some((item) => {
      const hasPermission = eligiblePermissionId.includes(item.module_id);
      return hasPermission && (item.permitted === 1 || item.permitted === true);
    }) || false;

  } catch (error) {
    console.error('Permission check failed:', error);
    return false;
  }
}


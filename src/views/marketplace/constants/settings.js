export const constants = {
  // General Settings
  generalSettings: {
    phoneNumber: "9812345678",
    email: "admin@email.com",
    defaultCurrency: "Canadian Dollar",
    businessHours: "Monday, Tuesday, Wednesday, Thursday, Friday",
    numberOfProducts: 100,
  },

  // Notification Settings
  notificationSettings: [
    {
      text: "New Order",
      frequency: "Immediately",
      channels: "Email notifications",
      enabled: true,
    },
    {
      text: "New Message",
      frequency: "Daily",
      channels: "Both",
      enabled: true,
    },
    {
      text: "Low Stock",
      frequency: "Weekly",
      channels: "Email notifications",
      enabled: true,
    },
    {
      text: "Order Confirmation",
      frequency: "Immediately",
      channels: "In-app push notifications",
      enabled: true,
    },
    {
      text: "Order Cancellation",
      frequency: "Immediately",
      channels: "Email notifications",
      enabled: true,
    },
    {
      text: "Order Completion",
      frequency: "Daily",
      channels: "Both",
      enabled: true,
    },
    {
      text: "Order Dispatch",
      frequency: "Weekly",
      channels: "Both",
      enabled: true,
    },
    {
      text: "Order Flagged",
      frequency: "Immediately",
      channels: "Both",
      enabled: false,
    },
  ],

  // Bank Accounts
  bankAccounts: [
    {
      company: "Bayer Corporation",
      bank: "ABL Bank Ltd.",
      iban: "XXXX XXXX XXXX XXXX 4446",
      bankCode: "12-443-87",
      bicSwift: "WESTGBAV",
      isActive: true,
      accountHolder: {
        name: "Arlo Jack",
        address: "Camelot Drive Street 32",
        city: "Avalon",
        country: "California",
        contact: {
          mobile: "21385-8965",
          home: "6653723",
          email: "arlojack@gmail.com",
        },
      },
    },
    {
      company: "Bayer Corporation",
      bank: "ABL Bank Ltd.",
      iban: "XXXX XXXX XXXX XXXX 4446",
      bankCode: "12-443-87",
      bicSwift: "WESTGBAV",
      isActive: false,
      accountHolder: {
        name: "Arlo Jack",
        address: "Camelot Drive Street 32",
        city: "Avalon",
        country: "California",
        contact: {
          mobile: "21385-8965",
          home: "6653723",
          email: "arlojack@gmail.com",
        },
      },
    },
  ],

  // PayPal Accounts
  paypalAccounts: [
    {
      accountTitle: "My Personal Paypal",
      email: "paypalemail2gmail.com",
      isActive: true,
    },
    {
      accountTitle: "Export Account",
      email: "paypalemail2gmail.com",
      isActive: false,
    },
    {
      accountTitle: "Marketplace Account",
      email: "paypalemail2gmail.com",
      isActive: false,
    },
  ],

  pickupLocations: [
    {
      name: "location 1",
      address: "P83C+GFX, Kathmandu 44600, Nepal",
      city: "Kathmandu",
      country: "Nepal",
      isActive: true,
    },
    {
      name: "location 2",
      address: "New York, USA",
      city: "New York",
      country: "USA",
      isActive: false,
    },
    {
      name: "location 3",
      address: "A 171 Jln San Peng",
      city: "Kuala Lumpur",
      country: "Wilayah Persekutuan Malaysia",
      isActive: false,
    },
  ],
  businessHours: {
    timeZone: "(GMT+00:00) Coordinated Universal Time", // Selected time zone
    days: [
      {
        name: "Sunday",
        enabled: false,
        startTime: "09:00",
        endTime: "17:00",
      },
      {
        name: "Monday",
        enabled: true,
        startTime: "09:00",
        endTime: "17:00",
      },
      {
        name: "Tuesday",
        enabled: true,
        startTime: "09:00",
        endTime: "17:00",
      },
      {
        name: "Wednesday",
        enabled: true,
        startTime: "09:00",
        endTime: "17:00",
      },
      {
        name: "Thursday",
        enabled: true,
        startTime: "09:00",
        endTime: "17:00",
      },
      {
        name: "Friday",
        enabled: true,
        startTime: "09:00",
        endTime: "17:00",
      },
      {
        name: "Saturday",
        enabled: false,
        startTime: "09:00",
        endTime: "17:00",
      },
    ],
  },
  notificationTitles: [
    { value: "new_order", text: "New Order" },
    { value: "new_message", text: "New Message" },
    { value: "low_stock", text: "Low Stock" },
    { value: "order_confirmation", text: "Order Confirmation" },
    { value: "order_cancellation", text: "Order Cancellation" },
    { value: "order_completion", text: "Order Completion" },
    { value: "order_dispatch", text: "Order Dispatch" },
    { value: "order_flagged", text: "Order Flagged" },
  ],
  notificationFrequencies: [
    { value: "immediately", text: "Immediately" },
    { value: "hourly", text: "Hourly" },
    { value: "daily", text: "Daily" },
  ],
  notificationModes: [
    { value: "in_app", text: "In-app push notification" },
    { value: "email", text: "Email notification" },
    { value: "both", text: "Both" },
  ],
}

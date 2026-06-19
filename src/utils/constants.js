export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

export const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry',
  'Chandigarh','Andaman and Nicobar Islands','Lakshadweep','Dadra and Nagar Haveli'
]

export const URGENCY_LEVELS = [
  { value: 0, label: 'Critical', emoji: '🚨', color: '#D32F2F', bg: '#FFF1F1', textColor: 'text-red-700', bgClass: 'bg-red-50 border-red-200' },
  { value: 1, label: 'Urgent',   emoji: '⚡', color: '#F57C00', bg: '#FFF8F1', textColor: 'text-orange-700', bgClass: 'bg-orange-50 border-orange-200' },
  { value: 2, label: 'Normal',   emoji: '✅', color: '#2E7D32', bg: '#F1F8F1', textColor: 'text-green-700', bgClass: 'bg-green-50 border-green-200' },
]

export const REQUEST_STATUSES = [
  { value: 0, label: 'Pending',   color: 'text-orange-600', bg: 'bg-orange-50' },
  { value: 1, label: 'Accepted',  color: 'text-blue-600',   bg: 'bg-blue-50' },
  { value: 2, label: 'Fulfilled', color: 'text-green-600',  bg: 'bg-green-50' },
  { value: 3, label: 'Cancelled', color: 'text-gray-500',   bg: 'bg-gray-50' },
]

export const APP_NAME = 'Smart Blood Connect'
export const APP_TAGLINE = 'Save Lives with Smart Blood Donation'

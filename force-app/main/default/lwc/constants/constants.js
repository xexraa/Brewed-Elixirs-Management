const CATEGORIES = [
  {
    name: "Coffee",
    subcategories: [{ name: "Beans" }, { name: "Powder" }]
  },
  {
    name: "Tea",
    subcategories: [{ name: "Bags" }, { name: "Loose" }]
  }
];

const FILTERS = [
  {
    category: "Coffee",
    filter: { marks: ["Lean Caffeine", "KIQO", "Lavazza", "KusyCoffee"] }
  },
  {
    category: "Tea",
    filter: { marks: ["sarcia.eu", "Lezzo", "Bonsai Matcha", "Ahmad Tea"] }
  }
];

const DISCOUNTS = [
  { label: "19%", value: 0.19 },
  { label: "20%", value: 0.2 },
  { label: "30%", value: 0.3 }
];

const IMAGES_FORMATS_ALLOWED = [".jpg", "jpeg", ".png"];

const POSTAL_CODE_MAX_LENGTH = 6;
const PHONE_NUMBER_MAX_LENGTH = 9;
const ORDER_IN_PACKING_STATUS = "In Packing";
const ORDER_SENT_STATUS = "Sent";
const TODAY = new Date();
const SIX_SYSTEM_STARS = 6;
const DEFAULT_PAGE_SIZE = 25;

export {
  CATEGORIES,
  FILTERS,
  DISCOUNTS,
  POSTAL_CODE_MAX_LENGTH,
  PHONE_NUMBER_MAX_LENGTH,
  ORDER_IN_PACKING_STATUS,
  ORDER_SENT_STATUS,
  TODAY,
  SIX_SYSTEM_STARS,
  DEFAULT_PAGE_SIZE,
  IMAGES_FORMATS_ALLOWED
};

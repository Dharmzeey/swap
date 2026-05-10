// iPhone catalog — series → variants → storages with base values (₦)
// Values are illustrative for the estimator demo
const IPHONE_CATALOG = [
  {
    id: "x", series: "iPhone X", year: 2017,
    variants: [
      { id: "x",      name: "iPhone X",      storages: [{ size: "64GB", value: 180000 }, { size: "256GB", value: 220000 }] },
      { id: "xr",     name: "iPhone XR",     storages: [{ size: "64GB", value: 200000 }, { size: "128GB", value: 230000 }, { size: "256GB", value: 260000 }] },
      { id: "xs",     name: "iPhone XS",     storages: [{ size: "64GB", value: 220000 }, { size: "256GB", value: 270000 }, { size: "512GB", value: 310000 }] },
      { id: "xsmax",  name: "iPhone XS Max", storages: [{ size: "64GB", value: 260000 }, { size: "256GB", value: 310000 }, { size: "512GB", value: 360000 }] },
    ],
  },
  {
    id: "11", series: "iPhone 11", year: 2019,
    variants: [
      { id: "11",       name: "iPhone 11",       storages: [{ size: "64GB", value: 280000 }, { size: "128GB", value: 320000 }, { size: "256GB", value: 360000 }] },
      { id: "11pro",    name: "iPhone 11 Pro",   storages: [{ size: "64GB", value: 360000 }, { size: "256GB", value: 410000 }, { size: "512GB", value: 460000 }] },
      { id: "11promax", name: "iPhone 11 Pro Max", storages: [{ size: "64GB", value: 420000 }, { size: "256GB", value: 470000 }, { size: "512GB", value: 530000 }] },
    ],
  },
  {
    id: "12", series: "iPhone 12", year: 2020,
    variants: [
      { id: "12mini",   name: "iPhone 12 mini", storages: [{ size: "64GB", value: 340000 }, { size: "128GB", value: 380000 }, { size: "256GB", value: 420000 }] },
      { id: "12",       name: "iPhone 12",      storages: [{ size: "64GB", value: 380000 }, { size: "128GB", value: 420000 }, { size: "256GB", value: 470000 }] },
      { id: "12pro",    name: "iPhone 12 Pro",  storages: [{ size: "128GB", value: 470000 }, { size: "256GB", value: 510000 }, { size: "512GB", value: 560000 }] },
      { id: "12promax", name: "iPhone 12 Pro Max", storages: [{ size: "128GB", value: 540000 }, { size: "256GB", value: 590000 }, { size: "512GB", value: 640000 }] },
    ],
  },
  {
    id: "13", series: "iPhone 13", year: 2021,
    variants: [
      { id: "13mini",   name: "iPhone 13 mini", storages: [{ size: "128GB", value: 430000 }, { size: "256GB", value: 470000 }, { size: "512GB", value: 520000 }] },
      { id: "13",       name: "iPhone 13",      storages: [{ size: "128GB", value: 470000 }, { size: "256GB", value: 510000 }, { size: "512GB", value: 560000 }] },
      { id: "13pro",    name: "iPhone 13 Pro",  storages: [{ size: "128GB", value: 580000 }, { size: "256GB", value: 620000 }, { size: "512GB", value: 680000 }, { size: "1TB", value: 740000 }] },
      { id: "13promax", name: "iPhone 13 Pro Max", storages: [{ size: "128GB", value: 660000 }, { size: "256GB", value: 700000 }, { size: "512GB", value: 760000 }, { size: "1TB", value: 820000 }] },
    ],
  },
  {
    id: "14", series: "iPhone 14", year: 2022,
    variants: [
      { id: "14",       name: "iPhone 14",      storages: [{ size: "128GB", value: 580000 }, { size: "256GB", value: 630000 }, { size: "512GB", value: 690000 }] },
      { id: "14plus",   name: "iPhone 14 Plus", storages: [{ size: "128GB", value: 660000 }, { size: "256GB", value: 710000 }, { size: "512GB", value: 770000 }] },
      { id: "14pro",    name: "iPhone 14 Pro",  storages: [{ size: "128GB", value: 760000 }, { size: "256GB", value: 810000 }, { size: "512GB", value: 880000 }, { size: "1TB", value: 950000 }] },
      { id: "14promax", name: "iPhone 14 Pro Max", storages: [{ size: "128GB", value: 870000 }, { size: "256GB", value: 920000 }, { size: "512GB", value: 990000 }, { size: "1TB", value: 1060000 }] },
    ],
  },
  {
    id: "15", series: "iPhone 15", year: 2023,
    variants: [
      { id: "15",       name: "iPhone 15",      storages: [{ size: "128GB", value: 780000 }, { size: "256GB", value: 830000 }, { size: "512GB", value: 900000 }] },
      { id: "15plus",   name: "iPhone 15 Plus", storages: [{ size: "128GB", value: 870000 }, { size: "256GB", value: 920000 }, { size: "512GB", value: 990000 }] },
      { id: "15pro",    name: "iPhone 15 Pro",  storages: [{ size: "128GB", value: 990000 }, { size: "256GB", value: 1040000 }, { size: "512GB", value: 1120000 }, { size: "1TB", value: 1200000 }] },
      { id: "15promax", name: "iPhone 15 Pro Max", storages: [{ size: "256GB", value: 1180000 }, { size: "512GB", value: 1260000 }, { size: "1TB", value: 1340000 }] },
    ],
  },
  {
    id: "16", series: "iPhone 16", year: 2024,
    variants: [
      { id: "16",       name: "iPhone 16",      storages: [{ size: "128GB", value: 950000 }, { size: "256GB", value: 1010000 }, { size: "512GB", value: 1090000 }] },
      { id: "16plus",   name: "iPhone 16 Plus", storages: [{ size: "128GB", value: 1060000 }, { size: "256GB", value: 1120000 }, { size: "512GB", value: 1200000 }] },
      { id: "16pro",    name: "iPhone 16 Pro",  storages: [{ size: "128GB", value: 1240000 }, { size: "256GB", value: 1300000 }, { size: "512GB", value: 1390000 }, { size: "1TB", value: 1480000 }] },
      { id: "16promax", name: "iPhone 16 Pro Max", storages: [{ size: "256GB", value: 1450000 }, { size: "512GB", value: 1540000 }, { size: "1TB", value: 1630000 }] },
    ],
  },
  {
    id: "17", series: "iPhone 17", year: 2025,
    variants: [
      { id: "17",       name: "iPhone 17",      storages: [{ size: "256GB", value: 1180000 }, { size: "512GB", value: 1270000 }] },
      { id: "17air",    name: "iPhone 17 Air",  storages: [{ size: "256GB", value: 1340000 }, { size: "512GB", value: 1430000 }, { size: "1TB", value: 1520000 }] },
      { id: "17pro",    name: "iPhone 17 Pro",  storages: [{ size: "256GB", value: 1520000 }, { size: "512GB", value: 1610000 }, { size: "1TB", value: 1700000 }] },
      { id: "17promax", name: "iPhone 17 Pro Max", storages: [{ size: "256GB", value: 1720000 }, { size: "512GB", value: 1810000 }, { size: "1TB", value: 1910000 }, { size: "2TB", value: 2050000 }] },
    ],
  },
];

// Defect catalog — percentage deductions from base value
const DEFECTS = [
  { id: "faceid",   label: "Face ID not working",   sublabel: "Sensor or front camera issue", weight: 0.12, group: "function" },
  { id: "battery",  label: "Battery replaced",       sublabel: "Non-original battery installed", weight: 0.05, group: "parts" },
  { id: "screen_p", label: "Screen replaced",        sublabel: "Non-original display", weight: 0.10, group: "parts" },
  { id: "camera_p", label: "Camera replaced",        sublabel: "Rear camera module changed", weight: 0.08, group: "parts" },
  { id: "other_p",  label: "Other parts changed",    sublabel: "Charging port, speakers, etc.", weight: 0.04, group: "parts" },
  { id: "screen_b", label: "Cracked screen",         sublabel: "Visible cracks on display glass", weight: 0.18, group: "physical" },
  { id: "back_b",   label: "Cracked back glass",     sublabel: "Cracks on rear panel", weight: 0.08, group: "physical" },
  { id: "rough",    label: "Rough or scratched body",sublabel: "Heavy wear on frame or back", weight: 0.05, group: "physical" },
];

window.IPHONE_CATALOG = IPHONE_CATALOG;
window.DEFECTS = DEFECTS;

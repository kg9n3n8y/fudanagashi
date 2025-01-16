// Cache name
const CACHE_NAME = 'fudanagashi-caches';
// Cache targets
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './fudalist.js',
  './script.js',
  './torifuda',
  "./torifuda/tori_0.png",
  "./torifuda/tori_1.png",
  "./torifuda/tori_2.png",
  "./torifuda/tori_3.png",
  "./torifuda/tori_4.png",
  "./torifuda/tori_5.png",
  "./torifuda/tori_6.png",
  "./torifuda/tori_7.png",
  "./torifuda/tori_8.png",
  "./torifuda/tori_9.png",
  "./torifuda/tori_10.png",
  "./torifuda/tori_11.png",
  "./torifuda/tori_12.png",
  "./torifuda/tori_13.png",
  "./torifuda/tori_14.png",
  "./torifuda/tori_15.png",
  "./torifuda/tori_16.png",
  "./torifuda/tori_17.png",
  "./torifuda/tori_18.png",
  "./torifuda/tori_19.png",
  "./torifuda/tori_20.png",
  "./torifuda/tori_21.png",
  "./torifuda/tori_22.png",
  "./torifuda/tori_23.png",
  "./torifuda/tori_24.png",
  "./torifuda/tori_25.png",
  "./torifuda/tori_26.png",
  "./torifuda/tori_27.png",
  "./torifuda/tori_28.png",
  "./torifuda/tori_29.png",
  "./torifuda/tori_30.png",
  "./torifuda/tori_31.png",
  "./torifuda/tori_32.png",
  "./torifuda/tori_33.png",
  "./torifuda/tori_34.png",
  "./torifuda/tori_35.png",
  "./torifuda/tori_36.png",
  "./torifuda/tori_37.png",
  "./torifuda/tori_38.png",
  "./torifuda/tori_39.png",
  "./torifuda/tori_40.png",
  "./torifuda/tori_41.png",
  "./torifuda/tori_42.png",
  "./torifuda/tori_43.png",
  "./torifuda/tori_44.png",
  "./torifuda/tori_45.png",
  "./torifuda/tori_46.png",
  "./torifuda/tori_47.png",
  "./torifuda/tori_48.png",
  "./torifuda/tori_49.png",
  "./torifuda/tori_50.png",
  "./torifuda/tori_51.png",
  "./torifuda/tori_52.png",
  "./torifuda/tori_53.png",
  "./torifuda/tori_54.png",
  "./torifuda/tori_55.png",
  "./torifuda/tori_56.png",
  "./torifuda/tori_57.png",
  "./torifuda/tori_58.png",
  "./torifuda/tori_59.png",
  "./torifuda/tori_60.png",
  "./torifuda/tori_61.png",
  "./torifuda/tori_62.png",
  "./torifuda/tori_63.png",
  "./torifuda/tori_64.png",
  "./torifuda/tori_65.png",
  "./torifuda/tori_66.png",
  "./torifuda/tori_67.png",
  "./torifuda/tori_68.png",
  "./torifuda/tori_69.png",
  "./torifuda/tori_70.png",
  "./torifuda/tori_71.png",
  "./torifuda/tori_72.png",
  "./torifuda/tori_73.png",
  "./torifuda/tori_74.png",
  "./torifuda/tori_75.png",
  "./torifuda/tori_76.png",
  "./torifuda/tori_77.png",
  "./torifuda/tori_78.png",
  "./torifuda/tori_79.png",
  "./torifuda/tori_80.png",
  "./torifuda/tori_81.png",
  "./torifuda/tori_82.png",
  "./torifuda/tori_83.png",
  "./torifuda/tori_84.png",
  "./torifuda/tori_85.png",
  "./torifuda/tori_86.png",
  "./torifuda/tori_87.png",
  "./torifuda/tori_88.png",
  "./torifuda/tori_89.png",
  "./torifuda/tori_90.png",
  "./torifuda/tori_91.png",
  "./torifuda/tori_92.png",
  "./torifuda/tori_93.png",
  "./torifuda/tori_94.png",
  "./torifuda/tori_95.png",
  "./torifuda/tori_96.png",
  "./torifuda/tori_97.png",
  "./torifuda/tori_98.png",
  "./torifuda/tori_99.png",
  "./torifuda/tori_100.png"
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        return response ? response : fetch(event.request);
      })
  );
});
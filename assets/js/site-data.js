// সাইটের ডিফল্ট কনটেন্ট। অ্যাডমিন প্যানেলের "সাইট কনটেন্ট" ট্যাব থেকে সেভ করলে সেটাই এর ওপর বসে যায়।
window.SH_SITE = {
  anim: { on: true, speed: 1 },
  hero: {
    tag: '২৪ ঘণ্টা খোলা · বায়েজিদ, চট্টগ্রাম',
    title: 'চট্টগ্রামে বিশ্বস্ত স্বাস্থ্যসেবা, এক ছাদের নিচে',
    lead: 'অভিজ্ঞ বিশেষজ্ঞ, আধুনিক প্রযুক্তি আর মানবিক সেবা। পছন্দের ডাক্তার বেছে ঘরে বসেই সিরিয়াল নিন।',
    cta1: 'অ্যাপয়েন্টমেন্ট নিন',
    cta2: 'আমাদের সেবাসমূহ'
  },
  building: { title: 'সাজিনাস হসপিটাল লিমিটেড', sub: 'Excellence in Healthcare · বায়েজিদ লিংক রোড', icon: '🏥', img: 'assets/img/hospital.jpg' },
  kpis: [
    { icon: '👨‍⚕️', label: 'বিশেষজ্ঞ ডাক্তার', type: 'doctors', value: 0, suf: '+' },
    { icon: '🏥', label: 'বিভাগ', type: 'depts', value: 0, suf: '' },
    { icon: '🟢', label: 'জন আজ বসছেন', type: 'today', value: 0, suf: '' },
    { icon: '🛏️', label: 'সেবা ইউনিট', type: 'manual', value: 12, suf: '+' }
  ],
  quick: [
    { icon: '📅', title: 'অ্যাপয়েন্টমেন্ট নিন', sub: 'ঘরে বসেই সিরিয়াল', href: '#doctors' },
    { icon: '🟢', title: 'আজ কারা বসছেন', sub: 'আজকের বিশেষজ্ঞ তালিকা', href: '#doctors', act: 'today' },
    { icon: '🚑', title: 'জরুরি ও অ্যাম্বুলেন্স', sub: '09677 888 444', href: 'tel:+8809677888444' },
    { icon: '📍', title: 'দিকনির্দেশনা', sub: 'বায়েজিদ লিংক রোড', href: '#location' }
  ],
  services: {
    eyebrow: 'আমাদের সেবা',
    title: 'এক ছাদের নিচে সম্পূর্ণ স্বাস্থ্যসেবা',
    items: [
      { key: 'emergency', title: '২৪/৭ ইমার্জেন্সি', sub: 'জরুরি রোগীর তাৎক্ষণিক সেবা', icon: '🚑', color: '#d6342c', badge: '২৪/৭', img: '', on: true, hero: true },
      { key: 'icu', title: 'ICU', sub: 'নিবিড় পরিচর্যা ইউনিট', icon: '🛏️', color: '#2c6fd1', badge: '', img: '', on: true, hero: true },
      { key: 'ambulance', title: 'অ্যাম্বুলেন্স সার্ভিস', sub: 'দ্রুত ও নিরাপদ পরিবহন', icon: '🚐', color: '#e8890c', badge: '', img: '', on: true, hero: true },
      { key: 'nicu', title: 'NICU', sub: 'নবজাতকের বিশেষ যত্ন', icon: '👶', color: '#e0568f', badge: '', img: '', on: true, hero: true },
      { key: 'picu', title: 'PICU', sub: 'শিশুদের নিবিড় পরিচর্যা', icon: '🧒', color: '#0f8f9e', badge: '', img: '', on: true, hero: true },
      { key: 'bloodbank', title: 'ব্লাড ব্যাংক', sub: 'নিরাপদ রক্ত, সার্বক্ষণিক', icon: '🩸', color: '#c92a2a', badge: '', img: '', on: true, hero: true },
      { key: 'diagnostics', title: 'ডায়াগনস্টিক', sub: 'আধুনিক পরীক্ষা-নিরীক্ষা', icon: '🔬', color: '#5f3dc4', badge: '', img: '', on: true, hero: true },
      { key: 'transfusion', title: 'ট্রান্সফিউশন মেডিসিন', sub: 'রক্ত সঞ্চালন বিশেষজ্ঞ সেবা', icon: '💉', color: '#1098ad', badge: '', img: '', on: true, hero: true },
      { key: 'gynae', title: 'গাইনি ও প্রসূতি', sub: 'মা ও শিশুর সুরক্ষা', icon: '🤰', color: '#d6336c', badge: '', img: '', on: true, hero: true },
      { key: 'pediatrics', title: 'শিশু রোগ', sub: 'অভিজ্ঞ শিশু বিশেষজ্ঞ', icon: '🧸', color: '#2b9a4a', badge: '', img: '', on: true, hero: true },
      { key: 'surgery', title: 'জেনারেল সার্জারি', sub: 'অভিজ্ঞ সার্জন টিম', icon: '🩺', color: '#7a4bd6', badge: '', img: '', on: true, hero: true },
      { key: 'thalassemia', title: 'থ্যালাসেমিয়া ক্লিনিক', sub: 'নিয়মিত পরিচর্যা ও পরামর্শ', icon: '🎗️', color: '#b5179e', badge: '', img: '', on: true, hero: true }
    ]
  },
  steps: {
    eyebrow: 'সহজ ৩ ধাপ',
    title: 'অ্যাপয়েন্টমেন্ট নেবেন যেভাবে',
    items: [
      { icon: '🩺', title: 'ডাক্তার বাছুন', text: 'বিভাগ ঠিক করে তালিকা থেকে পছন্দের ডাক্তার নিন।' },
      { icon: '📅', title: 'তারিখ ও তথ্য দিন', text: 'ডাক্তারের চেম্বারের দিন থেকে তারিখ বেছে ফর্ম পূরণ করুন।' },
      { icon: '✅', title: 'নিশ্চিতকরণ', text: 'রিকোয়েস্ট হসপিটালে পৌঁছে যাবে, আমরা যোগাযোগ করব।' }
    ]
  },
  band: {
    title: 'স্বাস্থ্যসেবায় উৎকর্ষতা',
    text: 'আধুনিক প্রযুক্তি, অভিজ্ঞ চিকিৎসক আর মানবিক সেবা — সবকিছু এক ঠিকানায়, দিন-রাত।',
    stats: [
      { label: 'ঘণ্টা জরুরি সেবা', type: 'manual', value: 24, suf: '' },
      { label: 'বিশেষজ্ঞ ডাক্তার', type: 'doctors', value: 0, suf: '+' },
      { label: 'বিভাগ', type: 'depts', value: 0, suf: '' },
      { label: 'সেবা ইউনিট', type: 'manual', value: 12, suf: '+' }
    ]
  }
};

// সেভ করা কনটেন্ট (remote) + ডিফল্ট মিলিয়ে চূড়ান্ত অবজেক্ট বানায়
window.SH_MERGE = function (d, r) {
  const clone = o => JSON.parse(JSON.stringify(o)), s = clone(d);
  if (!r || typeof r !== 'object') return s;
  for (const k of ['anim', 'hero', 'building']) if (r[k] && typeof r[k] === 'object') s[k] = { ...s[k], ...r[k] };
  for (const k of ['kpis', 'quick']) if (Array.isArray(r[k]) && r[k].length) s[k] = r[k];
  for (const [k, a] of [['services', 'items'], ['steps', 'items'], ['band', 'stats']]) {
    if (r[k] && typeof r[k] === 'object') {
      s[k] = { ...s[k], ...r[k] };
      if (!Array.isArray(s[k][a]) || !s[k][a].length) s[k][a] = clone(d[k][a]);
    }
  }
  return s;
};

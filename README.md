# Shajinaz Hospital — Website

## GitHub Pages
এই ফোল্ডারের সব ফাইল (`backend/` ছাড়া) রিপোতে আপলোড করুন → Settings → Pages → main branch।

## ব্যাকএন্ড (Google Sheet + অ্যাডমিন + নোটিফিকেশন)
1. `shajinazit@gmail.com` অ্যাকাউন্টে নতুন Google Sheet খুলুন → Extensions → Apps Script।
2. `backend/Code.gs` পুরোটা পেস্ট করুন (আগের ভার্সন থাকলে পুরনোটা মুছে নতুনটা বসান, তারপর Deploy → Manage deployments → Edit → New version) → `setup` ফাংশন একবার Run করে অনুমতি দিন।
3. Deploy → New deployment → Web app → Execute as **Me**, Access **Anyone** → URL কপি করুন।
4. `assets/js/config.js` এ `API_URL` এ সেই URL বসান, GitHub এ আপডেট করুন।
5. `admin.html` এ লগইন: **shajinaz_admin / Shajinaz@2026** → সাথে সাথে পাসওয়ার্ড বদলান।
6. ডাক্তার ট্যাবে "ডিফল্ট ইমপোর্ট" চাপলে ৬১ জন ডাক্তার Sheet এ চলে যাবে।

## WhatsApp নোটিফিকেশন (+8801886338811)
প্রতিটি বুকিং হলে **Google Sheet এ সেভ**, **shajinazit@gmail.com এ ইমেইল** এবং **WhatsApp মেসেজ** যায়। WhatsApp এর জন্য একবার সেটআপ (ফ্রি, CallMeBot):
1. 01886 338 811 নম্বরের WhatsApp থেকে **+34 644 51 95 23** এ লিখুন: `I allow callmebot to send me messages`
2. রিপ্লাইতে একটি API key আসবে।
3. Apps Script → Project Settings → Script properties → `CALLMEBOT_KEY` = সেই key।
এটা না করলে WhatsApp যাবে না (ইমেইল ও Sheet কাজ করবে)। বড় পরিসরে চাইলে Meta WhatsApp Business API লাগবে।

## সেবার ছবি
১২টি সেবার জন্য নিজস্ব ভেক্টর ইলাস্ট্রেশন `assets/services/*.svg` এ আছে। আসল বা AI-জেনারেটেড ফটো দিতে চাইলে একই নামে `.jpg` দিন (emergency, icu, ambulance, nicu, picu, bloodbank, diagnostics, transfusion, gynae, pediatrics, surgery, thalassemia) — `.jpg` থাকলে সেটাই দেখাবে।

## ছবি
`unassigned/` এ ২টি নামহীন ছবি আছে। `SH-X01…` এ ৮ জন ডাক্তারের ছবি আছে যাঁরা OPD তালিকায় নেই; তাঁরা লুকানো — অ্যাডমিন থেকে বিভাগ ও সময় দিয়ে চালু করুন।

## v7 নতুন ফিচার
**সাইট কনটেন্ট এডিটর:** অ্যাডমিন → "সাইট কনটেন্ট" ট্যাব। এখান থেকে হিরোর লেখা, ভবনের ছবি, ঘূর্ণায়মান সেবার কার্ড, কাউন্টার, কুইক কার্ড, সেবার তালিকা (নাম, ছবি, রং, ব্যাজ, ক্রম, দেখানো/লুকানো), অ্যাপয়েন্টমেন্টের ধাপ ও "স্বাস্থ্যসেবায় উৎকর্ষতা" ব্যান্ড বদলানো যায়। অ্যানিমেশন বন্ধ/চালু ও ঘোরার গতিও ঠিক করা যায়। ছবি আপলোড করলে Drive এর `Shajinaz Site` ফোল্ডারে জমা হয়। সেভ করলে Sheet এর `Settings` ট্যাবে থাকে।

**স্টাফ সাইন আপ:** `admin.html` → "সাইন আপ" (নাম, ইমেইল, মোবাইল, পাসওয়ার্ড)। নিরাপত্তার জন্য সাইন আপ করলেই লগইন খোলে না: মূল অ্যাডমিন (shajinaz_admin) ইউজার ট্যাব থেকে "অনুমোদন দিন" চাপলে তবেই লগইন করা যায়, কারণ অ্যাডমিনে রোগীর নাম ও মোবাইল আছে। সাথে সাথে চালু করতে চাইলে Script properties এ `AUTO_APPROVE` = `true` দিন। সাইন আপ হলে `shajinazit@gmail.com` এ ইমেইল যায়।

**আপডেটের পর:** Apps Script এ একবার `setup` চালান (Users শিটে নতুন কলাম ও Settings শিট তৈরি হবে)। অনুমতি চাইলে Drive অনুমতি দিন।

## v8: ফার্মাসিস্ট লগইন ও পূর্ণ সেটআপ
**কীভাবে কাজ করে:** ফার্মাসিস্ট সাইটের হেডারে "ফার্মাসিস্ট লগইন" থেকে সাইন আপ করেন (নাম, ফার্মেসির নাম, মোবাইল, ইমেইল, ঠিকানা, পাসওয়ার্ড), তারপর লগইন করেন। লগইন করা অবস্থায় ডাক্তারে ক্লিক করলে বুকিং ফর্ম খোলে। তাঁর নাম, ফোন ও ঠিকানা সার্ভার নিজেই অ্যাকাউন্ট থেকে নিয়ে Bookings শিটে বসায়, ফর্মে আলাদা লিখতে হয় না। লগইন ছাড়া বুকিং হয় না। ফার্মাসিস্ট নিজের বুকিংয়ের অবস্থা (অপেক্ষমাণ/নিশ্চিত) 🔔 ও প্রোফাইলে দেখতে পান, আর বুকিংয়ের ইমেইল কপি পান।

**অ্যাডমিন:** "ফার্মাসিস্ট" ট্যাবে তালিকা, বুকিং সংখ্যা, বন্ধ/চালু, পাসওয়ার্ড রিসেট ও মোছা যায়। "স্টাফ ইউজার" ট্যাব হসপিটালের নিজস্ব স্টাফের জন্য আলাদা।

### Google Sheet বানানোর ধাপ (৫ মিনিট)
১. যে Google অ্যাকাউন্টে ডেটা রাখতে চান (যেমন sajinas@gmail.com) সেটা দিয়ে লগইন করে নতুন একটা খালি Google Sheet খুলুন।
২. Extensions → Apps Script খুলে পুরনো কোড মুছে `backend/Code.gs` পুরোটা পেস্ট করে Save করুন।
৩. উপরের ড্রপডাউন থেকে `setup` বেছে Run চাপুন। অনুমতি চাইলে Allow দিন (Sheet, Drive, Mail)। এতে Doctors, Bookings, Agents, Users, Settings ট্যাব রঙ, ফ্রিজ করা হেডার, স্ট্যাটাস ড্রপডাউন ও রঙিন চিহ্নসহ নিজে তৈরি হয়ে যায়।
৪. Deploy → New deployment → Web app, Execute as: Me, Who has access: Anyone → Deploy। যে URL পাবেন সেটা `assets/js/config.js` এর `API_URL` এ বসান।
৫. `admin.html` এ `shajinaz_admin` / `Shajinaz@2026` দিয়ে ঢুকে প্রথমেই পাসওয়ার্ড বদলান, তারপর ডাক্তার ট্যাব থেকে "ডিফল্ট ডাক্তার ইমপোর্ট করুন" চাপুন।
**নোটিফিকেশন ইমেইল** যায় ডেপ্লয়কারী অ্যাকাউন্টে। অন্য ঠিকানায় চাইলে Project Settings → Script properties এ `NOTIFY_EMAIL` দিন।
**কোড আপডেটের পর** Deploy → Manage deployments → Edit → New version দিন, নইলে পুরনো কোডই চলবে।

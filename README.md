# Shajinaz Hospital — Website

## GitHub Pages
এই ফোল্ডারের সব ফাইল (`backend/` ছাড়া) রিপোতে আপলোড করুন → Settings → Pages → main branch।

## ব্যাকএন্ড (Google Sheet + অ্যাডমিন + নোটিফিকেশন)
1. `shajinazit@gmail.com` অ্যাকাউন্টে নতুন Google Sheet খুলুন → Extensions → Apps Script।
2. `backend/Code.gs` পুরোটা পেস্ট করুন → `setup` ফাংশন একবার Run করে অনুমতি দিন।
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

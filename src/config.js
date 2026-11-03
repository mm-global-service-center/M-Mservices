// عدّل معلومات التواصل هنا ثم احفظ الملف. أرقام واتساب بصيغة دولية دون + أو أصفار بادئة.
// تُحدّث روابط واتساب ورموز QR تلقائيًا عند تشغيل npm run build أو npm run dev.
export const company = {
  address: 'دمشق، المنطقة الصناعية، خلف فرن الشاغور الآلي',
  shortAddress: 'دمشق، المنطقة الصناعية',
  email: 'a49517408', // يرجى استبداله بالبريد الكامل عند توفره.
  contactPeople: 'أحمد مطر • قصي المصري',
  mobile1: { digits: '963944861843', display: '0944 861 843', international: '+963 944 861 843' },
  mobile2: { digits: '963947371381', display: '0947 371 381', international: '+963 947 371 381' },
  landline: { digits: '0115420916', display: '011 542 0916' },
};
export const whatsappUrl = (digits) => `https://wa.me/${digits}`;

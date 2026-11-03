# M&M | مركز الخدمة الشاملة

موقع عرض منتجات عربي متجاوب لمستلزمات المطاعم والفنادق والمشافي، مبني باستخدام React وVite وThree.js. يحتوي المشروع أيضًا على خادم كتالوج Node.js وExpress. لا يستقبل الموقع طلبات تواصل ولا يجمع بيانات العملاء؛ التواصل مباشر عبر الهاتف أو واتساب.

## مهم قبل النشر

- يمكن نشر الموقع **الثابت** مجانًا على GitHub Pages. سيعمل معرض المنتجات والبحث والصور والكرة وروابط التواصل من دون خادم.
- **GitHub Pages لا يشغّل Node.js أو قاعدة بيانات.** يعمل الموقع هناك ببيانات المنتجات المحلية. لتشغيل واجهة API الموجودة في `server/` تحتاج إلى استضافة تدعم Node.js أو Docker.
- البريد المكتوب حاليًا `a49517408` غير مكتمل؛ عدّله عند معرفة البريد الكامل.
- تأكد من حقك في نشر الصور والشعارات والعلامات الظاهرة فيها.

## 1. النشر على GitHub Pages خطوة بخطوة

### المتطلبات

- حساب GitHub.
- Git وGit Bash على Windows، أو Terminal على macOS/Linux.
- Node.js 20 أو أحدث للتجربة المحلية (ليس مطلوبًا للأوامر الأساسية لرفع الملفات، لأن GitHub يبني الموقع عبر Actions).

### إنشاء مستودع على GitHub

1. سجّل الدخول إلى GitHub واختر **New repository**.
2. اختر اسمًا مثل `mm-service-center`. يفضّل أن يكون المستودع **Public** إذا كنت تستخدم GitHub Free وتريد GitHub Pages.
3. اترك خيارات إنشاء README و`.gitignore` وLicense دون تحديد لإنشاء مستودع فارغ، ثم اختر **Create repository**.
4. انسخ رابط المستودع HTTPS الذي يشبه `https://github.com/USERNAME/mm-service-center.git`.

### رفع الملفات من Git Bash

فك ضغط الملف المضغوط أولًا. افتح المجلد الذي يحتوي مباشرة على `package.json` و`src` و`.github` في File Explorer، ثم اضغط بزر الفأرة الأيمن واختر **Git Bash Here**. لا ترفع ملف ZIP نفسه داخل المستودع.

نفّذ الأوامر التالية، مع استبدال الاسم والبريد باسمك وبريدك على GitHub واستبدال رابط المستودع برابطك:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git init
git branch -M main
git add .
git commit -m "Add M&M website"
git remote add origin https://github.com/USERNAME/mm-service-center.git
git push -u origin main
```

استخدم بريدًا مرتبطًا بحسابك في GitHub إذا أردت ربط المساهمات بحسابك. عند طلب تسجيل الدخول، أكمل تسجيل الدخول في المتصفح إن ظهر Git Credential Manager. لا يقبل GitHub كلمة مرور الحساب المعتادة لعمليات Git عبر HTTPS؛ إذا طلب كلمة مرور نصية فاستخدم Personal Access Token مناسبًا، أو سجّل الدخول عبر GitHub CLI بالأمر `gh auth login` ثم `gh auth setup-git` إذا كانت الأداة مثبتة.

إذا ظهرت رسالة `remote origin already exists` بدل أمر `git remote add` استخدم:

```bash
git remote set-url origin https://github.com/USERNAME/mm-service-center.git
```

ثم أعد أمر `git push -u origin main`.

### تفعيل الموقع

1. افتح المستودع على GitHub واختر **Settings → Pages**.
2. ضمن **Build and deployment → Source** اختر **GitHub Actions**، وليس Deploy from a branch.
3. افتح تبويب **Actions** وتحقق من نجاح مهمة **Deploy to GitHub Pages**. إن انتهت قبل اختيار المصدر أو لم تبدأ، افتح المهمة واختر **Run workflow** على الفرع `main`.
4. بعد نجاح النشر ستجد الرابط في صفحة **Settings → Pages**. عادة يكون على الشكل التالي، مع استبدال القيم باسم حسابك والمستودع:

```text
https://USERNAME.github.io/mm-service-center/
```

قد يحتاج النشر دقائق قليلة. إن فشل، افتح مهمة Actions الحمراء ثم افتح الخطوة التي فشلت لقراءة رسالة الخطأ.

## 2. تشغيله على جهازك

افتح Git Bash داخل مجلد المشروع ونفّذ:

```bash
npm ci
npm run build
npm start
```

ثم افتح `http://localhost:3001` على جهازك نفسه. هذا يشغّل الواجهة مع خادم المنتجات.

للتطوير مع تحديث الواجهة أثناء التعديل: شغّل `npm run dev` فقط؛ يبدأ الأمر خادم المنتجات والواجهة معًا. افتح رابط Vite الذي يظهر في الطرفية، ولإيقافهما اضغط `Ctrl+C`. يجب أن يكون المنفذ 3001 متاحًا لخادم المنتجات.

للاختبارات: `npm test`. ولإنشاء ملف معاينة مستقل: `npm run preview:offline`، ثم افتح `preview-offline.html` في متصفح عادي. عارض المحادثة المقيّد قد يمنع فتح واتساب؛ عندها تعرض المعاينة رمز QR.

## 3. التعديل لاحقًا

افتح المجلد في محرر مثل Visual Studio Code:

- **أرقام واتساب والهاتف، العنوان، البريد والمسؤولون:** `src/config.js`. أدخل رقم واتساب في `digits` بصيغة دولية بدون `+` أو مسافات أو الصفر الأول، وعدّل `display` و`international` أيضًا. يتم تجديد رموز QR تلقائيًا عند تشغيل `npm run build` أو `npm run dev` أو عند النشر عبر Actions.
- **المنتجات:** `src/data.js`. لكل منتج رقم `id` فريد، واسم `title`، وقسم `category`، ووصف `description`، ورقم الصورة `image`. تفاصيل النافذة لكل منتج تُكتب في `detailsById` في أعلى الملف تحت رقم المنتج نفسه.
- **صور المنتجات:** `public/images`. اسم صورة المنتج يجب أن يطابق رقم `image`: مثلًا `100.webp`. يُفضّل ضغط الصورة قبل إضافتها. صورة قسم من نحن هي `about-products.webp` والشعار هو `brand-logo.png`.
- **الصور الإضافية للمنتج:** الكائن `gallery` أعلى `src/main.jsx`، ويستخدم رقم المنتج ثم أرقام الصور داخل `public/images`.
- **النصوص والأقسام:** `src/main.jsx`. **الألوان والتنسيق:** `src/style.css`. **الكرة والنص الدوّار:** `src/Globe.jsx`، وصورة الأرض المحلية `public/earth.jpg`.

مثال على إضافة منتج، بعد وضع الصورة `100.webp` في `public/images`:

1. أضف في `detailsById` قرب أعلى `src/data.js`:

```js
100: ['النوع: وصف دقيق للمنتج', 'الاستخدام: مكان استخدام المنتج'],
```

2. أضف عنصرًا داخل مصفوفة `products` في الملف نفسه، مع اختيار قسم موجود كما هو تمامًا:

```js
{id:100, title:'اسم المنتج', category:'مستلزمات الفنادق', description:'وصف المنتج.', image:100},
```

يجب ألا يتكرر رقم `id`، ويجب أن تبقى الفواصل والأقواس صحيحة. عدّل الأوصاف والخصائص وفق المعلومات المؤكدة فقط. لإضافة تصنيف جديد تحتاج أيضًا إلى تعديله في قائمة `cats` في `src/main.jsx`.

بعد حفظ التغييرات، اختبر البناء ثم ارفعها من داخل مجلد المشروع:

```bash
npm run build
git add .
git commit -m "Update products and contact details"
git push
```

سيعيد GitHub Actions بناء الموقع ونشره تلقائيًا. لا ترفع `node_modules` أو مجلد `dist`؛ ملف `.gitignore` يستبعدهما.

## واجهة الخادم (عند استضافة Node.js)

- `GET /api/health` لفحص الخدمة.
- `GET /api/categories` للتصنيفات.
- `GET /api/products?category=...&q=...&page=1&limit=32` للبحث والتصفح.
- `GET /api/products/:id` لتفاصيل منتج.

الكتالوج محفوظ في `src/data.js`؛ لا توجد قاعدة بيانات أو لوحة إدارة في الإصدار الحالي. لتشغيل الخادم على استضافة Node: أمر البناء `npm ci && npm run build` وأمر التشغيل `npm start`. يقرأ الخادم متغير البيئة `PORT`. أو استخدم Docker: `docker build -t mm-site .` ثم `docker run -p 3001:3001 mm-site`.

صورة الأرض مأخوذة من ملف Earth في أمثلة Three.js. ترخيص خط Cairo موجود في `src/assets/CAIRO-LICENSE.txt`.

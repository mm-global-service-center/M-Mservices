import QRCode from 'qrcode';
import { company, whatsappUrl } from '../src/config.js';
for (const [index, mobile] of [company.mobile1, company.mobile2].entries()) {
  if (!/^\d{8,15}$/.test(mobile.digits)) throw new Error(`رقم واتساب ${index + 1} غير صحيح: استخدم رمز الدولة والأرقام دون + أو مسافات`);
  await QRCode.toFile(`public/images/whatsapp-${index + 1}.png`, whatsappUrl(mobile.digits), {
    width: 280, margin: 2, color: { dark: '#164d5e', light: '#ffffff' },
  });
}
console.log('WhatsApp QR codes updated');

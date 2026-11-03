export function enquiryUrl({name,phone,service,message=''},destination){
 const text=`Hello TIGA Biz Centre,\n\nName: ${name.trim()}\nPhone / WhatsApp: ${phone.trim()}\nService: ${service}${message.trim()?'\n\nMy requirements: '+message.trim():''}\n\nPlease guide me on the next steps.`;
 if(!/^\d{8,15}$/.test(destination))throw new Error('Invalid destination');
 return `https://wa.me/${destination}?text=${encodeURIComponent(text)}`;
}

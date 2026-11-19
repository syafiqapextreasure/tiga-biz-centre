// All icon paths share a 24-unit drawing grid and a rounded stroke.
const paths = {
  briefcase: 'M3 8h18v13H3z M8 8V5h8v3 M3 12q9 6 18 0 M11 14h2',
  building: 'M3 21h18 M5 21V4h11v17 M16 10h4v11 M8 8h1m3 0h1m-5 4h1m3 0h1m-5 4h1m3 5v-5',
  chat: 'M5 4h14q3 0 3 3v8q0 3-3 3h-8l-6 4v-4q-3 0-3-3V7q0-3 3-3z M7 11h.1m4.9 0h.1m4.9 0h.1',
  check: 'M20 12a8 8 0 1 1-5-7 M8 11l4 4 9-10',
  checklist: 'M8 5H4v16h16V5h-4 M9 3h6v4H9z M7 11l1 1 2-3m2 2h5m-10 5 1 1 2-3m2 2h5',
  clock: 'M22 12a10 10 0 1 1-20 0 10 10 0 1 1 20 0z M12 6v6l4 3',
  document: 'M5 2h10l5 5v15H5z M15 2v6h5 M8 12h9m-9 4h7',
  education: 'M1 8l11-5 11 5-11 5z M5 11v6q7 6 14 0v-6 M22 9v8',
  email: 'M2 5h20v14H2z M2 6l10 8L22 6',
  file: 'M2 6h7l3 3h10v12H2z',
  gear: 'M10 2h4l.7 3 2 .9 2.7-1.3 2 3.5-2.2 2v2.8l2.2 2-2 3.5-2.8-1-2 1-.6 3h-4l-.7-3-2-1-2.7 1-2-3.5 2.2-2v-2.8l-2.2-2 2-3.5 2.8 1.3 2-.9z M16 12a4 4 0 1 1-8 0 4 4 0 1 1 8 0z',
  hardhat: 'M2 16h20v4H2z M4 16a8 8 0 0 1 5-9m6 0a8 8 0 0 1 5 9 M10 12V4h4v8',
  id: 'M2 5h20v15H2z M10 10a2 2 0 1 1-4 0 2 2 0 1 1 4 0z M4 17q4-7 8 0m2-7h5m-5 4h4',
  leaf: 'M3 19Q1 4 21 3q0 17-15 16 M2 22 15 9',
  lock: 'M4 10h16v12H4z M7 10V7a5 5 0 0 1 10 0v3 M12 15v3',
  pages: 'M3 6v15h13 M7 2h10l4 4v12H7z M17 2v5h4 M10 11h7m-7 3h5',
  people: 'M15 8a3 3 0 1 1-6 0 3 3 0 1 1 6 0z M6 21v-3a6 6 0 0 1 12 0v3z M5 7a3 3 0 0 0 0 6m14-6a3 3 0 0 1 0 6 M5 15q-4 0-4 5h3m15-5q4 0 4 5h-3',
  phone: 'M6 2l4 5-2 3q2 4 6 6l3-2 5 4q-2 6-7 3Q4 16 2 7q-1-3 4-5z',
  presentation: 'M2 3h20v13H2z M12 16v3m-5 3 5-3 5 3 M6 12l4-4 3 2 5-5',
  review: 'M15 4V2H3v19h9 M6 6h6M6 10h3 M19 14a4 4 0 1 1-8 0 4 4 0 1 1 8 0z M18 17l4 5',
  shield: 'M12 2q5 4 9 4 0 12-9 16Q3 18 3 6q5 0 9-4z M7 12l4 4 6-8',
  signpost: 'M12 2v20 M4 4h14l4 3-4 3H4z M20 12H6l-4 3 4 3h14z',
  whatsapp: 'M3 21l1-5a9 9 0 1 1 4 4z M8 7l2 3-1 1q1 3 4 4l1-1 3 1q-1 4-5 2-5-2-6-7 0-2 2-3z'
};
const aliases = {'hero-services':'briefcase','hero-about':'people','hero-home':'pages','faq-chat':'chat','contact-chat':'chat','contact-review':'review','contact-check':'check'};
export function vectorAsset(name) {
  const key = aliases[name] || name.replace(/-(gold|light)$/,'');
  const color = name.endsWith('-light') ? '#fff' : name.endsWith('-gold') || ['briefcase','gear','document','clock','checklist','signpost','shield'].includes(name) ? '#ac8439' : '#005344';
  if (!paths[key]) throw new Error('Unknown icon '+name);
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26"><path transform="translate(1 1)" d="'+paths[key]+'" fill="none" stroke="'+color+'" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}
export const vectorNames = [...new Set([...Object.keys(paths), ...Object.keys(aliases),'building-gold','chat-gold','chat-light','check-light','checklist-light','id-gold','people-gold','review-light'])];


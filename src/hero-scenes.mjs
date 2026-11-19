// Coordinates are in a 240 × 160 illustration. Each satellite is drawn on a 24-unit grid.
const scenes = {
  home: [
    [30, 47, 'M2 9l10-7 10 7v12H2z M9 21v-8h6v8'],
    [200, 30, 'M4 20l2-7L17 2l5 5-11 11z M14 5l5 5'],
    [207, 121, 'M2 6h7l3 3h10v12H2z']
  ],
  about: [
    [40, 30, 'M12 21S1 14 2 8q2-8 10-2 8-6 10 2 1 6-10 13z'],
    [208, 66, 'M12 22S4 14 4 9a8 8 0 1 1 16 0q0 5-8 13z M14 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0'],
    [39, 126, 'M3 19q8 1 10-6-1-9 9-10 0 11-9 10 M3 19l11-8']
  ],
  services: [
    [31, 42, 'M2 6h20v14H2z M2 10h20 M5 16h5'],
    [117, 24, 'M2 7l10-5 10 5-10 5z M2 7v11l10 5 10-5V7 M12 12v11'],
    [209, 49, 'M3 4h18v16H3z M3 9h18 M6 6.5h1 M8 14l-2 2 2 2m8-4 2 2-2 2']
  ],
  process: [
    [30, 119, 'M2 3h20v13H10l-6 5v-5H2z M6 8h12'],
    [102, 33, 'M16 10a6 6 0 1 1-12 0 6 6 0 1 1 12 0 M15 15l7 7'],
    [210, 33, 'M4 22V3q5-3 9 0t9 0v11q-5 3-9 0t-9 0']
  ],
  portfolio: [
    [37, 36, 'M2 16h20v4H2z M4 15a8 8 0 0 1 16 0 M10 12V4h4v8'],
    [192, 29, 'M1 9l11-6 11 6-11 6z M5 12v5q7 7 14 0v-5 M22 10v8'],
    [208, 118, 'M3 21V10h4v11z M10 21V6h4v15z M17 21V2h4v19z']
  ],
  faqs: [
    [32, 45, 'M2 4q6-2 10 2 4-4 10-2v15q-6-2-10 2-4-4-10-2z M12 6v15'],
    [205, 33, 'M8 16q0-3-2-5a7 7 0 1 1 12 0q-2 2-2 5z M9 20h6 M11 23h2'],
    [201, 128, 'M4 5h4m4 0h8 M4 12h4m4 0h8 M4 19h4m4 0h8']
  ],
  contact: [
    [30, 49, 'M2 5h20v15H2z M2 5l10 8L22 5'],
    [199, 28, 'M2 11L22 2l-5 20-6-7-4 4v-6z M7 13L22 2'],
    [207, 125, 'M5 2l4 1 1 5-3 2q2 5 7 7l2-3 5 2 1 4q-2 4-8 1Q4 16 2 6z']
  ]
};

const choreography = {
  home: ['translate','-5 3;0 0;0 0;-5 3'],
  about: ['rotate','-7;5;2;-7'],
  services: ['translate','0 5;0 -6;0 -2;0 5'],
  process: ['scale','.88;1.12;1;.88'],
  portfolio: ['rotate','-10;6;0;-10'],
  faqs: ['scale','.92;1.09;1;.92'],
  contact: ['translate','-6 4;5 -5;0 0;-6 4']
};

export function heroScene(key, illustration) {
  const icons = scenes[key];
  const [motion, poses] = choreography[key];
  const route = icons.map(([x,y], index) => `${index ? 'Q120 80' : 'M'} ${x} ${y}`).join(' ');
  const satellites = icons.map(([x,y,path], index) => `
    <g transform="translate(${x} ${y})"><g>
      <animateTransform attributeName="transform" type="${motion}" values="${poses}" dur="4.8s" begin="-${index * 1.6}s" repeatCount="indefinite"/>
      <circle r="20" fill="#eff1e7" stroke="#b59452" stroke-width="1.3"/>
      <circle r="18" fill="none" stroke="#b59452" stroke-width="1">
        <animate attributeName="r" values="18;26;26" dur="4.8s" begin="-${index * 1.6}s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values=".8;0;0" dur="4.8s" begin="-${index * 1.6}s" repeatCount="indefinite"/>
      </circle>
      <path transform="translate(-12 -12)" d="${path}" stroke-width="1.8"/>
    </g></g>`).join('');
  return `<svg class="asset animated-hero" viewBox="0 0 240 160" aria-hidden="true" fill="none" stroke="#005344" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="120" cy="83" rx="79" ry="57" fill="#e8ecdf" stroke="none"/>
    <path d="${route}" stroke="#aa8a48" stroke-width="1.4" stroke-dasharray="2 4"/>
    <circle r="3" fill="#ae873d" stroke="none"><animateMotion path="${route}" dur="4.8s" repeatCount="indefinite"/></circle>
    <g transform="translate(40 30) scale(.87)">${illustration}</g>${satellites}
  </svg>`;
}


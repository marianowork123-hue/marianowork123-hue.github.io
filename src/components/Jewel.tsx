import React from "react";
const GOLD = "#C99A2E", GOLD_D = "#A87E1E";
function Facets({ cx, cy, r, gem }: any) {
  const dark = "rgba(0,0,0,.28)", light = "rgba(255,255,255,.55)";
  return (<g>
    <circle cx={cx} cy={cy} r={r} fill={gem} />
    <path d={`M${cx - r} ${cy} L${cx} ${cy - r} L${cx + r} ${cy} L${cx} ${cy + r} Z`} fill="none" stroke={light} strokeWidth="1" opacity=".7" />
    <circle cx={cx - r * .32} cy={cy - r * .32} r={r * .18} fill={light} opacity=".9" />
  </g>);
}
export default function Jewel({ type, gem, size }: { type: string; gem: string; size?: number }) {
  const c: any = { width: "100%", height: "100%", viewBox: "0 0 220 220", style: { display: "block" } };
  if (type === "necklace") return (<svg {...c}><path d="M40 56 Q110 150 180 56" fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round" /><line x1="110" y1="128" x2="110" y2="146" stroke={GOLD} strokeWidth="3" /><Facets cx={110} cy={168} r={26} gem={gem} /><circle cx="110" cy="168" r="26" fill="none" stroke={GOLD} strokeWidth="3" /></svg>);
  if (type === "earrings") return (<svg {...c}>{[78, 142].map((x, i) => (<g key={i}><path d={`M${x} 58 a14 14 0 1 0 0.1 0`} fill="none" stroke={GOLD} strokeWidth="3" /><line x1={x} y1="72" x2={x} y2="96" stroke={GOLD} strokeWidth="2.5" /><path d={`M${x - 18} 116 L${x} 96 L${x + 18} 116 L${x} 150 Z`} fill={gem} /></g>))}</svg>);
  if (type === "bracelet") return (<svg {...c}><ellipse cx="110" cy="118" rx="74" ry="58" fill="none" stroke={GOLD} strokeWidth="8" />{[-1, 0, 1].map(k => <Facets key={k} cx={110 + k * 44} cy={62} r={13} gem={gem} />)}</svg>);
  return (<svg {...c}><ellipse cx="110" cy="150" rx="52" ry="54" fill="none" stroke={GOLD} strokeWidth="9" /><path d="M86 96 L110 60 L134 96 L110 116 Z" fill={gem} /><path d="M86 96 L134 96" stroke="rgba(255,255,255,.6)" strokeWidth="1" /></svg>);
}

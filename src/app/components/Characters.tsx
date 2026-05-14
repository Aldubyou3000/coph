// ─────────────────────────────────────────────────────────────────────────────
// Characters.tsx
// SVG character illustrations for the QC Heat Risk Monitor.
// Each character is a pure SVG component — no external assets needed.
//
// Characters:
//   ConstructionWorker  — orange safety vest, hard hat, water bottle
//   TrafficEnforcer     — navy uniform, reflective vest, whistle
//   Student             — white polo, navy shorts, DepEd patch, backpack
//   StreetVendor        — apron, food cart, cap
//   Civilian (NEW)      — casual t-shirt, khaki pants, hand fan
// ─────────────────────────────────────────────────────────────────────────────

export function ConstructionWorker({ sad = false }: { sad?: boolean }) {
  return (
    <svg viewBox="0 0 120 220" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Hard Hat Brim */}
      <ellipse cx="60" cy="43" rx="30" ry="7" fill="#E6A800" />
      {/* Hard Hat Dome */}
      <path d="M33 43 Q33 18 60 16 Q87 18 87 43" fill="#FFD700" />
      <rect x="56" y="20" width="8" height="4" fill="#CC9900" rx="1" />
      <path d="M42 32 Q52 26 68 30" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" />
      {/* Head */}
      <ellipse cx="60" cy="64" rx="19" ry="21" fill="#E8A87C" />
      <ellipse cx="60" cy="78" rx="13" ry="7" fill="#C98B5C" opacity="0.25" />
      {/* Face */}
      <ellipse cx="52" cy="61" rx="2.8" ry="3" fill="white" />
      <ellipse cx="68" cy="61" rx="2.8" ry="3" fill="white" />
      <circle cx="52.5" cy="61.5" r="1.5" fill="#222" />
      <circle cx="68.5" cy="61.5" r="1.5" fill="#222" />
      <circle cx="53" cy="61" r="0.6" fill="white" />
      <circle cx="69" cy="61" r="0.6" fill="white" />
      <path d={sad ? "M52 72 Q60 66 68 72" : "M52 72 Q60 78 68 72"} fill="none" stroke="#333" strokeWidth="1.8" strokeLinecap="round" />
      {/* Ears */}
      <ellipse cx="41" cy="64" rx="4" ry="5" fill="#D4956A" />
      <ellipse cx="79" cy="64" rx="4" ry="5" fill="#D4956A" />
      {/* Neck */}
      <rect x="53" y="83" width="14" height="10" fill="#E8A87C" rx="3" />
      {/* Orange Safety Vest */}
      <path d="M28 93 L22 175 L98 175 L92 93 Z" fill="#FF7A00" />
      {/* White shirt visible at collar */}
      <path d="M50 93 L54 100 L60 93 L66 100 L70 93" fill="none" stroke="#FFF" strokeWidth="2" />
      {/* Vest Reflective Strips */}
      <rect x="26" y="118" width="68" height="5" fill="#FFE600" rx="2" opacity="0.85" />
      <rect x="26" y="134" width="68" height="5" fill="#FFE600" rx="2" opacity="0.85" />
      {/* Left Arm */}
      <path d="M28 93 L14 160 Q12 168 18 170 L26 170 L36 105 Z" fill="#E8A87C" />
      {/* Right Arm */}
      <path d="M92 93 L106 160 Q108 168 102 170 L94 170 L84 105 Z" fill="#E8A87C" />
      {/* Work Gloves */}
      <ellipse cx="16" cy="172" rx="7" ry="5" fill="#7B5E3A" />
      <ellipse cx="104" cy="172" rx="7" ry="5" fill="#7B5E3A" />
      {/* Jeans */}
      <path d="M30 175 L28 210 L55 210 L60 188 L65 210 L92 210 L90 175 Z" fill="#2B4A8F" />
      <line x1="60" y1="175" x2="60" y2="188" stroke="#1E3570" strokeWidth="1.5" />
      {/* Boots */}
      <rect x="26" y="207" width="30" height="13" fill="#2C1810" rx="3" />
      <rect x="64" y="207" width="30" height="13" fill="#2C1810" rx="3" />
      <rect x="24" y="214" width="32" height="6" fill="#1A0E08" rx="2" />
      <rect x="62" y="214" width="32" height="6" fill="#1A0E08" rx="2" />
      {/* Water Bottle in hand */}
      <rect x="107" y="152" width="9" height="18" fill="#60A8FF" rx="3" opacity="0.8" />
      <ellipse cx="111.5" cy="151" rx="4.5" ry="2" fill="#3A7ACC" />
    </svg>
  );
}

export function TrafficEnforcer({ sad = false }: { sad?: boolean }) {
  return (
    <svg viewBox="0 0 120 220" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Cap */}
      <ellipse cx="60" cy="44" rx="24" ry="6" fill="#1A2F6A" />
      <path d="M37 44 Q37 24 60 22 Q83 24 83 44" fill="#233A80" />
      <rect x="36" y="41" width="48" height="5" fill="#1A2F6A" />
      {/* Cap badge */}
      <ellipse cx="60" cy="38" rx="6" ry="4" fill="#FFD700" />
      <ellipse cx="60" cy="38" rx="4" ry="2.5" fill="#E6C000" />
      {/* Cap brim */}
      <ellipse cx="60" cy="46" rx="27" ry="5" fill="#142259" />
      {/* Head */}
      <ellipse cx="60" cy="65" rx="18" ry="20" fill="#C68642" />
      <ellipse cx="60" cy="79" rx="12" ry="7" fill="#A0693A" opacity="0.3" />
      {/* Hair at sides */}
      <ellipse cx="43" cy="55" rx="5" ry="8" fill="#1A1A1A" />
      <ellipse cx="77" cy="55" rx="5" ry="8" fill="#1A1A1A" />
      {/* Ponytail */}
      <ellipse cx="60" cy="46" rx="16" ry="6" fill="#1A1A1A" />
      <path d="M75 60 Q85 70 82 85 Q78 92 75 88" fill="#1A1A1A" />
      {/* Face */}
      <ellipse cx="52" cy="62" rx="2.5" ry="2.8" fill="white" />
      <ellipse cx="68" cy="62" rx="2.5" ry="2.8" fill="white" />
      <circle cx="52.5" cy="62.5" r="1.4" fill="#2A1A0E" />
      <circle cx="68.5" cy="62.5" r="1.4" fill="#2A1A0E" />
      <circle cx="53" cy="62" r="0.5" fill="white" />
      <circle cx="69" cy="62" r="0.5" fill="white" />
      <path d={sad ? "M53 73 Q60 69 67 73" : "M53 73 Q60 77 67 73"} fill="none" stroke="#6B3A2A" strokeWidth="1.6" strokeLinecap="round" />
      {/* Earrings */}
      <circle cx="42" cy="68" r="2" fill="#FFD700" />
      <circle cx="78" cy="68" r="2" fill="#FFD700" />
      {/* Neck */}
      <rect x="54" y="83" width="12" height="9" fill="#C68642" rx="3" />
      {/* Navy Uniform Body */}
      <path d="M30 92 L24 175 L96 175 L90 92 Z" fill="#1E3A80" />
      {/* Collar */}
      <path d="M50 92 L54 99 L60 92 L66 99 L70 92" fill="none" stroke="#152B60" strokeWidth="2" />
      {/* Reflective vest strips */}
      <rect x="28" y="116" width="64" height="5" fill="#AAFF00" rx="2" opacity="0.9" />
      <rect x="28" y="132" width="64" height="5" fill="#AAFF00" rx="2" opacity="0.9" />
      {/* Vertical vest straps */}
      <rect x="45" y="92" width="6" height="85" fill="#AAFF00" rx="2" opacity="0.5" />
      <rect x="69" y="92" width="6" height="85" fill="#AAFF00" rx="2" opacity="0.5" />
      {/* Badge on chest */}
      <rect x="64" y="100" width="14" height="10" fill="#FFD700" rx="2" />
      <rect x="66" y="102" width="10" height="6" fill="#E6C000" rx="1" />
      {/* Arms */}
      <path d="M30 92 L16 158 Q14 166 20 168 L28 168 L38 104 Z" fill="#1E3A80" />
      <path d="M90 92 L104 158 Q106 166 100 168 L92 168 L82 104 Z" fill="#1E3A80" />
      {/* Hands */}
      <ellipse cx="17" cy="170" rx="6" ry="5" fill="#C68642" />
      <ellipse cx="103" cy="170" rx="6" ry="5" fill="#C68642" />
      {/* Whistle */}
      <circle cx="103" cy="165" r="5" fill="#C0C0C0" />
      <rect x="100" y="160" width="6" height="5" fill="#A0A0A0" rx="1" />
      <line x1="103" y1="165" x2="103" y2="178" stroke="#999" strokeWidth="1.5" />
      {/* Navy Pants */}
      <path d="M32 175 L30 210 L56 210 L60 190 L64 210 L90 210 L88 175 Z" fill="#1A2F6A" />
      <line x1="60" y1="175" x2="60" y2="190" stroke="#142259" strokeWidth="1.5" />
      {/* Shoes */}
      <rect x="28" y="207" width="29" height="12" fill="#111" rx="3" />
      <rect x="62" y="207" width="29" height="12" fill="#111" rx="3" />
    </svg>
  );
}

export function Student({ sad = false }: { sad?: boolean }) {
  return (
    <svg viewBox="0 0 120 220" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Hair — short neat cut */}
      <path d="M42 63 Q41 40 60 38 Q79 40 78 63 Q68 53 60 52 Q52 53 42 63 Z" fill="#1A1A1A" />
      {/* Head */}
      <ellipse cx="60" cy="65" rx="18" ry="21" fill="#FFCE9E" />
      <ellipse cx="60" cy="79" rx="12" ry="7" fill="#E8A87C" opacity="0.3" />
      {/* Face */}
      <ellipse cx="52" cy="62" rx="2.8" ry="3" fill="white" />
      <ellipse cx="68" cy="62" rx="2.8" ry="3" fill="white" />
      <circle cx="52.5" cy="62.5" r="1.5" fill="#222" />
      <circle cx="68.5" cy="62.5" r="1.5" fill="#222" />
      <circle cx="53" cy="62" r="0.6" fill="white" />
      <circle cx="69" cy="62" r="0.6" fill="white" />
      <path d={sad ? "M52 73 Q60 66 68 73" : "M52 73 Q60 80 68 73"} fill="none" stroke="#333" strokeWidth="1.8" strokeLinecap="round" />
      {/* Rosy cheeks */}
      <ellipse cx="46" cy="70" rx="5" ry="3" fill="#FF9090" opacity="0.35" />
      <ellipse cx="74" cy="70" rx="5" ry="3" fill="#FF9090" opacity="0.35" />
      {/* Ears */}
      <ellipse cx="42" cy="65" rx="4" ry="5" fill="#FFCE9E" />
      <ellipse cx="78" cy="65" rx="4" ry="5" fill="#FFCE9E" />
      {/* Neck */}
      <rect x="54" y="84" width="12" height="9" fill="#FFCE9E" rx="3" />
      {/* White Polo Shirt */}
      <path d="M28 93 L22 175 L98 175 L92 93 Z" fill="#F5F5F5" stroke="#DDD" strokeWidth="1" />
      {/* Collar */}
      <path d="M48 93 L54 101 L60 93 L66 101 L72 93" fill="none" stroke="#111111" strokeWidth="2.5" />
      {/* OLFU patch — right chest, circular */}
      <circle cx="72" cy="113" r="7" fill="#1A8A3A" opacity="0.9" />
      <text x="72" y="116" textAnchor="middle" fill="white" fontSize="3.5" fontWeight="bold">olfu</text>

      {/* Green V-lanyard — goes around neck, hangs to portrait ID */}
      <line x1="55" y1="94" x2="60" y2="120" stroke="#22AA44" strokeWidth="2" strokeLinecap="round" />
      <line x1="65" y1="94" x2="60" y2="120" stroke="#22AA44" strokeWidth="2" strokeLinecap="round" />

      {/* Portrait ID card — attached at base of lanyard V */}
      {/* Card body */}
      <rect x="51" y="120" width="18" height="22" fill="#FAFAFA" stroke="#BBBBBB" strokeWidth="0.8" rx="1.5" />
      {/* Green header bar */}
      <rect x="51" y="120" width="18" height="6.5" fill="#1A8A3A" rx="1.5" />
      <rect x="51" y="124" width="18" height="2.5" fill="#1A8A3A" />
      <text x="60" y="125.5" textAnchor="middle" fill="white" fontSize="3.5" fontWeight="bold">OLFU</text>
      {/* Photo area */}
      <rect x="54.5" y="128" width="11" height="9" fill="#E0ECEC" rx="1" />
      {/* Face silhouette in photo */}
      <ellipse cx="60" cy="131.5" rx="3" ry="3.5" fill="#FFCE9E" />
      {/* Name lines */}
      <rect x="53" y="139" width="14" height="1.5" fill="#DDDDDD" rx="0.5" />
      <rect x="55" y="141.5" width="10" height="1" fill="#EEEEEE" rx="0.5" />

      {/* Left sleeve (short) */}
      <path d="M28 93 L22 115 L33 115 L36 105 Z" fill="#F0F0F0" />
      {/* Left forearm — skin */}
      <path d="M22 115 L14 160 Q12 167 18 169 L26 169 L33 115 Z" fill="#FFCE9E" />
      {/* Right sleeve (short) */}
      <path d="M92 93 L98 115 L87 115 L84 105 Z" fill="#F0F0F0" />
      {/* Right forearm — skin */}
      <path d="M98 115 L106 160 Q108 167 102 169 L94 169 L87 115 Z" fill="#FFCE9E" />
      {/* Hands */}
      <ellipse cx="16" cy="171" rx="6" ry="5" fill="#FFCE9E" />
      <ellipse cx="104" cy="171" rx="6" ry="5" fill="#FFCE9E" />
      {/* Shorts */}
      <path d="M30 175 L28 208 L56 208 L60 192 L64 208 L92 208 L90 175 Z" fill="#1A1A1A" />
      <line x1="60" y1="175" x2="60" y2="192" stroke="#0A0A0A" strokeWidth="1.5" />
      {/* White Socks */}
      <rect x="28" y="205" width="28" height="10" fill="#EEE" rx="2" />
      <rect x="64" y="205" width="28" height="10" fill="#EEE" rx="2" />
      {/* Rubber Shoes */}
      <rect x="26" y="210" width="32" height="10" fill="#111" rx="3" />
      <rect x="62" y="210" width="32" height="10" fill="#111" rx="3" />
      {/* Laces — left shoe */}
      <line x1="30" y1="212" x2="54" y2="212" stroke="white" strokeWidth="0.9" opacity="0.55" />
      <line x1="30" y1="214" x2="54" y2="214" stroke="white" strokeWidth="0.9" opacity="0.55" />
      <line x1="30" y1="216" x2="54" y2="216" stroke="white" strokeWidth="0.9" opacity="0.55" />
      {/* Laces — right shoe */}
      <line x1="66" y1="212" x2="90" y2="212" stroke="white" strokeWidth="0.9" opacity="0.55" />
      <line x1="66" y1="214" x2="90" y2="214" stroke="white" strokeWidth="0.9" opacity="0.55" />
      <line x1="66" y1="216" x2="90" y2="216" stroke="white" strokeWidth="0.9" opacity="0.55" />

    </svg>
  );
}

export function StreetVendor({ sad = false }: { sad?: boolean }) {
  return (
    <svg viewBox="0 0 120 220" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Cap */}
      <ellipse cx="60" cy="43" rx="22" ry="5.5" fill="#1A2F6A" />
      <path d="M39 43 Q39 23 60 21 Q81 23 81 43" fill="#233A80" />
      <ellipse cx="60" cy="45" rx="25" ry="5" fill="#142259" />
      {/* Head */}
      <ellipse cx="60" cy="65" rx="19" ry="21" fill="#C68642" />
      <ellipse cx="60" cy="79" rx="13" ry="8" fill="#A0693A" opacity="0.3" />
      {/* Ears */}
      <ellipse cx="41" cy="65" rx="4" ry="5" fill="#B87030" />
      <ellipse cx="79" cy="65" rx="4" ry="5" fill="#B87030" />
      {/* Face */}
      <ellipse cx="52" cy="62" rx="2.8" ry="3" fill="white" />
      <ellipse cx="68" cy="62" rx="2.8" ry="3" fill="white" />
      <circle cx="52.5" cy="62.5" r="1.5" fill="#1A0E00" />
      <circle cx="68.5" cy="62.5" r="1.5" fill="#1A0E00" />
      <circle cx="53" cy="62" r="0.6" fill="white" />
      <circle cx="69" cy="62" r="0.6" fill="white" />
      <path d={sad ? "M51 73 Q60 66 69 73" : "M51 73 Q60 80 69 73"} fill="none" stroke="#1A0E00" strokeWidth="1.8" strokeLinecap="round" />
      {/* Mustache */}
      <path d="M52 69 Q56 71.5 60 69.5 Q64 71.5 68 69" fill="#3D1A00" />
      {/* Neck */}
      <rect x="53" y="84" width="14" height="9" fill="#C68642" rx="3" />
      {/* Sando / Sleeveless shirt */}
      <path d="M32 93 L26 175 L94 175 L88 93 Z" fill="#E8E0D0" />
      {/* White Apron */}
      <path d="M42 93 L36 175 L84 175 L78 93 Z" fill="#FAFAFA" stroke="#DDD" strokeWidth="1" />
      {/* Apron top — strap goes behind neck, only side tabs visible */}
      <rect x="42" y="90" width="7" height="5" fill="#E0E0E0" rx="1.5" />
      <rect x="71" y="90" width="7" height="5" fill="#E0E0E0" rx="1.5" />
      {/* Apron pocket */}
      <rect x="48" y="140" width="24" height="16" fill="#EEE" stroke="#CCC" strokeWidth="1" rx="2" />
      {/* Arms */}
      <path d="M32 93 L18 158 Q16 165 22 167 L30 167 L40 105 Z" fill="#C68642" />
      <path d="M88 93 L102 158 Q104 165 98 167 L90 167 L80 105 Z" fill="#C68642" />
      {/* Hands */}
      <ellipse cx="19" cy="169" rx="7" ry="5.5" fill="#B87030" />
      <ellipse cx="101" cy="169" rx="7" ry="5.5" fill="#B87030" />
      {/* Dark pants */}
      <path d="M34 175 L32 210 L58 210 L60 192 L62 210 L88 210 L86 175 Z" fill="#3D2B1A" />
      <line x1="60" y1="175" x2="60" y2="192" stroke="#2A1A0A" strokeWidth="1.5" />
      {/* Sandals */}
      <rect x="30" y="207" width="29" height="11" fill="#5C3A1A" rx="3" />
      <rect x="61" y="207" width="29" height="11" fill="#5C3A1A" rx="3" />
      {/* Food Cart */}
      <rect x="90" y="140" width="26" height="20" fill="#CC2200" rx="3" />
      <rect x="88" y="134" width="30" height="8" fill="#AA1800" rx="2" />
      {/* Cart items */}
      <rect x="93" y="143" width="9" height="7" fill="#FF9900" rx="1" />
      <rect x="104" y="143" width="9" height="7" fill="#FFCC00" rx="1" />
      {/* Cart wheels */}
      <circle cx="96" cy="162" r="5" fill="#2C2C2C" />
      <circle cx="110" cy="162" r="5" fill="#2C2C2C" />
      <circle cx="96" cy="162" r="2" fill="#555" />
      <circle cx="110" cy="162" r="2" fill="#555" />
      {/* Cart handle */}
      <line x1="90" y1="140" x2="90" y2="175" stroke="#8B6914" strokeWidth="3" />
    </svg>
  );
}

// ── NEW CHARACTER ─────────────────────────────────────────────────────────────
/**
 * Civilian — generic casual pedestrian / office worker.
 * Wears a light blue T-shirt, khaki pants, and sneakers.
 * Holds a hand fan (culturally relevant heat-coping accessory in PH).
 * The fan can be animated by CenterPanel when heat ≥ CAUTION.
 */
export function Civilian({ sad = false }: { sad?: boolean }) {
  return (
    <svg viewBox="0 0 120 220" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <ellipse cx="60" cy="68" rx="19" ry="22" fill="#FDBF94" />
      <ellipse cx="60" cy="82" rx="13" ry="7" fill="#E8A07A" opacity="0.3" />
      {/* Ears */}
      <ellipse cx="41" cy="68" rx="4" ry="5" fill="#F0A87A" />
      <ellipse cx="79" cy="68" rx="4" ry="5" fill="#F0A87A" />
      {/* Hair — drawn after head+ears so it’s visible on top as a crown cap */}
      <path d="M38 66 Q38 46 60 44 Q82 46 82 66 Q72 56 62 55 Q58 54 48 56 Q42 59 38 66 Z" fill="#8B5E3C" />
      {/* Side part line */}
      <path d="M60 44 Q61 51 60 55" fill="none" stroke="rgba(80,40,10,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Eyes */}
      <ellipse cx="52" cy="65" rx="2.8" ry="3" fill="white" />
      <ellipse cx="68" cy="65" rx="2.8" ry="3" fill="white" />
      <circle cx="52.5" cy="65.5" r="1.5" fill="#333" />
      <circle cx="68.5" cy="65.5" r="1.5" fill="#333" />
      <circle cx="53" cy="65" r="0.6" fill="white" />
      <circle cx="69" cy="65" r="0.6" fill="white" />
      {/* Smile */}
      <path d={sad ? "M53 76 Q60 70 67 76" : "M53 76 Q60 82 67 76"} fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" />
      {/* Neck */}
      <rect x="54" y="88" width="12" height="9" fill="#FDBF94" rx="3" />
      {/* Light blue casual T-shirt */}
      <path d="M30 97 L24 178 L96 178 L90 97 Z" fill="#5B9BD5" />
      {/* Collar */}
      <path d="M50 97 L55 106 L60 97 L65 106 L70 97" fill="none" stroke="#4A88C0" strokeWidth="2" />
      {/* Chest logo area */}
      <rect x="52" y="114" width="16" height="12" fill="#4A88C0" rx="2" />
      <text x="60" y="123" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="5" fontWeight="bold">QC</text>
      {/* Arms — short sleeves so skin shows at forearm */}
      <path d="M30 97 L14 152 Q13 160 19 161 L28 161 L40 110 Z" fill="#FDBF94" />
      <path d="M90 97 L106 152 Q107 160 101 161 L92 161 L80 110 Z" fill="#FDBF94" />
      {/* Hands */}
      <ellipse cx="15" cy="163" rx="7" ry="5" fill="#F0A87A" />
      <ellipse cx="105" cy="163" rx="7" ry="5" fill="#F0A87A" />
      {/* Hand fan (right hand — heat-coping accessory) */}
      <path d="M98 148 Q113 138 115 155 Q113 168 98 163 Z" fill="#FF9900" opacity="0.9" />
      <path d="M98 148 Q115 140 116 154 Q115 167 98 163 Z" fill="none" stroke="#CC7700" strokeWidth="1" />
      {/* Fan ribs */}
      <line x1="98" y1="155" x2="112" y2="145" stroke="#CC7700" strokeWidth="0.8" />
      <line x1="98" y1="155" x2="114" y2="151" stroke="#CC7700" strokeWidth="0.8" />
      <line x1="98" y1="155" x2="114" y2="158" stroke="#CC7700" strokeWidth="0.8" />
      <line x1="98" y1="155" x2="112" y2="164" stroke="#CC7700" strokeWidth="0.8" />
      {/* Khaki pants */}
      <path d="M32 178 L30 212 L57 212 L60 196 L63 212 L90 212 L88 178 Z" fill="#C4A96A" />
      <line x1="60" y1="178" x2="60" y2="196" stroke="#A88F52" strokeWidth="1.5" />
      {/* Sneakers */}
      <rect x="28" y="209" width="30" height="11" fill="#222" rx="3" />
      <rect x="62" y="209" width="30" height="11" fill="#222" rx="3" />
      {/* Shoe stripe detail */}
      <rect x="30" y="213" width="26" height="4" fill="white" rx="1" opacity="0.35" />
      <rect x="64" y="213" width="26" height="4" fill="white" rx="1" opacity="0.35" />
    </svg>
  );
}

/* Original code-native illustrations for this local design concept. */
(() => {
  let serial = 0;
  function frame(content, size = '0 0 400 340') {
    const id = `art-${++serial}`;
    return `<svg viewBox="${size}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>
      <linearGradient id="${id}-white" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#fff"/><stop offset=".6" stop-color="#e9eff5"/><stop offset="1" stop-color="#b8cedd"/></linearGradient>
      <linearGradient id="${id}-side" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#87a9c1"/><stop offset="1" stop-color="#dce9f2"/></linearGradient>
      <linearGradient id="${id}-blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#a4d7f2"/><stop offset=".5" stop-color="#4e86b4"/><stop offset="1" stop-color="#16436b"/></linearGradient>
      <linearGradient id="${id}-glass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff" stop-opacity=".92"/><stop offset="1" stop-color="#fff" stop-opacity=".25"/></linearGradient>
      <radialGradient id="${id}-glow"><stop stop-color="#5193c3" stop-opacity=".27"/><stop offset="1" stop-color="#619ece" stop-opacity="0"/></radialGradient>
      <filter id="${id}-shadow" x="-70%" y="-70%" width="240%" height="260%"><feDropShadow dx="0" dy="13" stdDeviation="12" flood-color="#082d49" flood-opacity=".18"/></filter>
      <filter id="${id}-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10"/></filter>
    </defs>${content.replaceAll('$WHITE',`url(#${id}-white)`).replaceAll('$SIDE',`url(#${id}-side)`).replaceAll('$BLUE',`url(#${id}-blue)`).replaceAll('$GLASS',`url(#${id}-glass)`).replaceAll('$GLOW',`url(#${id}-glow)`).replaceAll('$SHADOW',`url(#${id}-shadow)`).replaceAll('$SOFT',`url(#${id}-soft)`)}</svg>`;
  }
  const pedestal = '<ellipse cx="200" cy="285" rx="128" ry="16" fill="#365a73" opacity=".15" filter="$SOFT"/>';
  function cityContent(){return `<ellipse cx="345" cy="337" rx="245" ry="120" fill="$GLOW"/>
    <g fill="none" stroke-linecap="round"><path d="M75 347 C132 310 192 301 238 314 S349 401 445 376 S544 302 639 292" stroke="#285778" stroke-width="32" opacity=".2"/>
    <path d="M63 340 C125 297 178 284 236 303 S350 391 444 368 S553 286 640 281" stroke="#a6cce6" stroke-width="11"/>
    <path d="M77 392 C190 356 217 345 266 364 S328 429 425 410 S546 350 604 330" stroke="#5183a6" stroke-width="8"/>
    <path d="M164 412 C185 345 208 331 261 334 S355 345 429 309 S470 227 548 189" stroke="#dfedf6" stroke-width="8"/></g>
    <ellipse cx="337" cy="306" rx="170" ry="35" fill="#031a2b" opacity=".5" filter="$SOFT"/>
    <g filter="$SHADOW"><path d="M181 259 L334 287 L496 251 L341 218Z" fill="$SIDE"/>
    <path d="M181 259 L334 287 L334 306 L181 278Z" fill="#a1b9c9"/><path d="M334 287 L496 251 L496 270 L334 306Z" fill="#d9e9f3"/>
    <path d="M219 124 L334 150 L334 280 L219 254Z" fill="$WHITE"/><path d="M334 150 L463 121 L463 248 L334 280Z" fill="#b5ccdc"/>
    <path d="M205 112 L334 138 L476 106 L348 82Z" fill="#f8fbfd"/><path d="M205 112 L334 138 L334 153 L205 127Z" fill="#c6d9e8"/><path d="M334 138 L476 106 L476 121 L334 153Z" fill="#e5eef5"/>
    <g stroke="#799bb3" stroke-width="6" opacity=".7"><path d="M238 150v89 M260 155v89 M282 160v89 M306 166v89"/></g>
    <g stroke="#eaf2f7" stroke-width="5"><path d="M356 164v91 M380 158v92 M405 152v91 M434 146v90"/></g>
    <path d="M334 242 L463 213 L463 226 L334 255Z" fill="#e8f0f6"/>
    <path d="M291 256v-46l20 5v46" fill="#6a8fa8"/></g>
    <g><ellipse cx="429" cy="309" rx="24" ry="11" fill="#d5eaf7"/><ellipse cx="429" cy="308" rx="14" ry="5" fill="#608fb0"/><circle cx="429" cy="308" r="4" fill="#fff"/>
    <circle cx="182" cy="314" r="5" fill="#d1e3ef"/><circle cx="555" cy="297" r="5" fill="#d1e3ef"/><circle cx="555" cy="297" r="12" fill="none" stroke="#d1e3ef" opacity=".3"/></g>`;}
  const art = {
    hero: () => frame(cityContent(), '0 0 700 480'),
    culture: () => frame(`<ellipse cx="202" cy="295" rx="155" ry="20" fill="#123950" opacity=".1" filter="$SOFT"/>
      <g filter="$SHADOW"><path d="M62 207 L205 238 L347 206 L205 175Z" fill="$SIDE"/><path d="M62 207 L205 238v36L62 242Z" fill="#93b5cc"/><path d="M205 238 L347 206v35L205 274Z" fill="#c6dbe8"/>
      <path d="M88 115 L205 140v95L88 210Z" fill="$WHITE"/><path d="M205 140 L323 114v94L205 235Z" fill="$SIDE"/>
      <path d="M74 107 L204 131 L337 101 L210 76Z" fill="#fff"/><path d="M74 107v15l130 26v-17Z" fill="#d5e6f0"/><path d="M204 131v17l133-31v-16Z" fill="#bfd7e6"/>
      <g stroke="#8dadc1" stroke-width="5"><path d="M107 135v59 M130 140v59 M154 145v60 M179 151v60"/></g><g stroke="#eaf1f6" stroke-width="5"><path d="M227 153v61 M251 148v59 M276 142v59 M301 137v59"/></g>
      <path d="M104 193l79 16v15l-79-17Z" fill="#fff"/><path d="M227 218l84-20v15l-84 20Z" fill="#b9d3e4"/></g>`, '0 0 400 330'),
    rail: () => frame(`<ellipse cx="200" cy="182" rx="180" ry="133" fill="$GLOW"/>
      <g fill="none" stroke-linecap="round" filter="$SHADOW"><path d="M18 251 C110 238 99 128 198 128 S282 195 386 83" stroke="#d8eaf7" stroke-width="18"/><path d="M27 284 C116 284 101 163 199 163 S289 231 390 121" stroke="#6f9bbb" stroke-width="17"/><path d="M16 218 C84 211 118 266 192 224 S248 111 364 81" stroke="#356987" stroke-width="17"/></g>
      <g filter="$SHADOW"><circle cx="205" cy="169" r="58" fill="$WHITE"/><circle cx="205" cy="169" r="43" fill="#0b2e49" stroke="#d1e5f1" stroke-width="2"/><text x="205" y="178" fill="#e7f2f9" font-size="28" font-weight="600" text-anchor="middle" font-family="-apple-system,sans-serif">104</text></g>
      <circle cx="64" cy="240" r="6" fill="#fff"/><circle cx="322" cy="183" r="6" fill="#b2d3eb"/>`, '0 0 400 330'),
    masterplan: () => frame(`${pedestal}<g filter="$SHADOW"><rect x="81" y="102" width="244" height="151" rx="19" fill="$SIDE" transform="rotate(-13 202 177)"/><rect x="70" y="81" width="244" height="151" rx="19" fill="$WHITE" transform="rotate(-13 192 157)"/>
      <g transform="rotate(-13 192 157)"><path d="M92 137h200M138 100v108M217 100v108" stroke="#aac6d9" stroke-width="2"/><rect x="158" y="113" width="41" height="68" rx="5" fill="$BLUE"/><rect x="99" y="157" width="24" height="39" rx="4" fill="#b7d4e6"/><rect x="237" y="112" width="37" height="27" rx="4" fill="#cbdeec"/><rect x="235" y="154" width="44" height="46" rx="5" fill="#d3e4ed"/></g></g><path d="M87 270 C107 264 134 237 168 247 S242 280 308 245" fill="none" stroke="#40719a" stroke-width="6" stroke-linecap="round"/>`),
    blueprint: () => frame(`${pedestal}<g filter="$SHADOW"><rect x="75" y="80" width="239" height="168" rx="18" fill="$BLUE" transform="rotate(8 195 164)"/><g transform="rotate(8 195 164)" stroke="#d6edf9" fill="none"><path d="M103 199v-79h181v79zM96 116h195M129 120v79M155 120v79M181 120v79M206 120v79M232 120v79M259 120v79M95 207h198" stroke-width="2"/><path d="M109 99h103M228 99h49M103 219h172" opacity=".4"/><circle cx="283" cy="227" r="8" stroke-width="2"/></g></g><path d="M263 264l35-134 12 3-36 135-9 13Z" fill="$WHITE" filter="$SHADOW"/>`),
    efficiency: () => frame(`${pedestal}<g filter="$SHADOW"><ellipse cx="111" cy="248" rx="45" ry="20" fill="#9bbad0"/><path d="M66 221v27c0 11 20 20 45 20s45-9 45-20v-27" fill="$SIDE"/><ellipse cx="111" cy="221" rx="45" ry="20" fill="$WHITE"/>
      <path d="M153 149v99c0 11 20 20 45 20s45-9 45-20v-99" fill="$SIDE"/><ellipse cx="198" cy="149" rx="45" ry="20" fill="$WHITE"/><path d="M240 91v157c0 11 20 20 45 20s45-9 45-20V91" fill="$BLUE"/><ellipse cx="285" cy="91" rx="45" ry="20" fill="#d9ecf7"/></g><path d="M75 180l86-66 55-7 93-54" stroke="#3e7a9f" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M294 53h18v18" stroke="#3e7a9f" stroke-width="4" fill="none"/>`),
    interchange: () => frame(`<ellipse cx="200" cy="170" rx="178" ry="144" fill="$GLOW"/><g fill="none" stroke-linecap="round" filter="$SHADOW"><path d="M34 233C134 244 163 55 257 106S274 287 366 268" stroke="#d4e8f7" stroke-width="20"/><path d="M35 266C135 271 145 96 242 131S293 236 364 239" stroke="#82b1d0" stroke-width="17"/><path d="M43 71C108 63 90 168 174 190S249 112 354 87" stroke="#5389b2" stroke-width="17"/></g><g filter="$SHADOW"><circle cx="198" cy="174" r="46" fill="$WHITE"/><circle cx="198" cy="174" r="30" fill="#1a456b"/><text x="198" y="184" text-anchor="middle" fill="#fff" font-size="30" font-weight="650" font-family="sans-serif">3</text></g>`),
    demand: () => frame(`${pedestal}<g filter="$SHADOW"><rect x="74" y="143" width="74" height="128" rx="9" fill="$WHITE"/><rect x="169" y="76" width="73" height="195" rx="9" fill="$BLUE"/><rect x="261" y="113" width="70" height="158" rx="9" fill="$WHITE"/><g stroke="#8daec6" stroke-width="4"><path d="M89 164h43M89 186h43M89 208h43M89 230h43M278 135h37M278 158h37M278 181h37M278 204h37M278 227h37"/></g><g stroke="#bddaea" stroke-width="4"><path d="M184 99h43M184 122h43M184 145h43M184 168h43M184 191h43M184 214h43M184 237h43"/></g></g>`),
    walkability: () => frame(`${pedestal}<path d="M42 271 C87 233 122 257 151 229S169 109 225 105S291 224 350 225" fill="none" stroke="#92bacf" stroke-width="24" stroke-linecap="round"/><path d="M42 271 C87 233 122 257 151 229S169 109 225 105S291 224 350 225" fill="none" stroke="#e4f1f7" stroke-width="2" stroke-dasharray="5 10"/>
      <g filter="$SHADOW"><path d="M80 227V122a35 35 0 0 1 70 0v78h-20v-78a15 15 0 0 0-30 0v105Z" fill="$WHITE"/><path d="M241 272V156a38 38 0 0 1 76 0v116h-21V156a17 17 0 0 0-34 0v116Z" fill="$WHITE"/></g><g fill="#5f94a9"><circle cx="57" cy="195" r="15"/><rect x="54" y="202" width="6" height="30" rx="3"/><circle cx="336" cy="135" r="16"/><rect x="333" y="142" width="6" height="30" rx="3"/></g>`),
    district: () => frame(`${pedestal}<g filter="$SHADOW"><rect x="67" y="160" width="74" height="108" rx="8" fill="$WHITE"/><rect x="159" y="78" width="74" height="190" rx="8" fill="$WHITE"/><rect x="251" y="131" width="82" height="137" rx="8" fill="$SIDE"/><rect x="172" y="92" width="48" height="127" rx="4" fill="$BLUE"/><g stroke="#b1cbdc" stroke-width="5"><path d="M82 181h44M82 202h44M82 224h44M268 153h47M268 175h47M268 197h47M268 219h47"/></g><path d="M178 248v-17h35v17" fill="#5f8dac"/></g><path d="M46 285h309" stroke="#b5d1e4" stroke-width="3" stroke-linecap="round"/>`),
    coordination: () => frame(`${pedestal}<g fill="none" stroke-width="26" filter="$SHADOW"><rect x="76" y="93" width="158" height="109" rx="54" stroke="#deeaf3" transform="rotate(-36 155 148)"/><rect x="161" y="144" width="158" height="109" rx="54" stroke="#6399bd" transform="rotate(-36 240 198)"/></g><path d="M191 135c-14 10-24 24-28 40" stroke="#deeaf3" stroke-width="26" fill="none"/><circle cx="317" cy="89" r="6" fill="#93bfdc"/><circle cx="63" cy="244" r="4" fill="#93bfdc"/>`),
    participation: () => frame(`${pedestal}<g filter="$SHADOW"><path d="M102 77h176a25 25 0 0 1 25 25v94a25 25 0 0 1-25 25h-98l-45 38v-38h-33a25 25 0 0 1-25-25v-94a25 25 0 0 1 25-25Z" fill="$WHITE"/><path d="M218 189h91a20 20 0 0 1 20 20v42a20 20 0 0 1-20 20h-11v26l-29-26h-51a20 20 0 0 1-20-20v-42a20 20 0 0 1 20-20Z" fill="$BLUE"/></g><g fill="#7095ae"><circle cx="133" cy="149" r="9"/><circle cx="188" cy="149" r="9"/><circle cx="243" cy="149" r="9"/></g><path d="M244 231l12 12 22-24" stroke="#edf7fc" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`),
    closed: () => frame(`<ellipse cx="200" cy="286" rx="116" ry="18" fill="#b0c9da" opacity=".4" filter="$SOFT"/><g filter="$SHADOW"><rect x="111" y="54" width="168" height="224" rx="23" fill="$WHITE" transform="rotate(-7 195 166)"/><g stroke="#a1bfd2" stroke-width="8" stroke-linecap="round"><path d="M148 117l94-12M150 147l94-12M154 177l54-7"/></g><circle cx="271" cy="228" r="53" fill="$BLUE"/><path d="M247 227l18 18 32-38" stroke="#e2f1fa" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`)
  };
  window.CouncilArt = name => (art[name] || art.masterplan)();
})();

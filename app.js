/* ===== 鏉數鑷姩鍖栭潚鍗?- 浜や簰鑴氭湰 ===== */

// === 閰嶇疆 ===
const GSHEET_URL = 'https://script.google.com/macros/s/AKfycbwUSfiVzdLoLNdeffZE4gpvXati91Wl-PTUn8aJFWOHU3452dD70Qngq_0NW6YRRTqCpg/exec'; // 绮樿创浣犵殑 Google Apps Script URL锛岀暀绌哄垯浠呬娇鐢?localStorage
const ADMIN_HASH = 'fc59eade3d18460bf7648ed22adf11d1a874e6422ad6ebbe111f8f8db9e92669'; // 绠＄悊瀵嗙爜 SHA-256

// === Admin Auth ===
function showAdminLogin() {
  if (sessionStorage.getItem('qx_admin')) { toggleAdmin(); return; }
  document.getElementById('adminLogin').style.display = 'flex';
  document.getElementById('adminPwd').focus();
}
function closeAdminLogin() {
  document.getElementById('adminLogin').style.display = 'none';
  document.getElementById('adminPwd').value = '';
  document.getElementById('adminPwd').style.borderColor = '';
  document.getElementById('adminPwd').placeholder = '璇疯緭鍏ュ瘑鐮?;
}
async function verifyAdmin() {
  const pwd = document.getElementById('adminPwd').value;
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pwd));
  const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
  if (hash === ADMIN_HASH) {
    sessionStorage.setItem('qx_admin', '1');
    closeAdminLogin();
    toggleAdmin();
  } else {
    document.getElementById('adminPwd').style.borderColor = 'var(--p)';
    document.getElementById('adminPwd').value = '';
    document.getElementById('adminPwd').placeholder = '瀵嗙爜閿欒锛岃閲嶈瘯';
  }
}

// === Google Sheets Backend ===
async function postToSheet(data) {
  if (!GSHEET_URL) return false;
  try {
    await fetch(GSHEET_URL, { method:'POST', body:JSON.stringify(data), headers:{'Content-Type':'text/plain'} });
    return true;
  } catch(e) { console.warn('Sheets鎻愪氦澶辫触:', e); return false; }
}
async function fetchFromSheet() {
  if (!GSHEET_URL) return null;
  try {
    const res = await fetch(GSHEET_URL);
    return await res.json();
  } catch(e) { console.warn('Sheets璇诲彇澶辫触:', e); return null; }
}

// === 椤圭洰鍗＄墖鏁版嵁 ===
const projects = [
  {tag:'鏁€?, icon:'👵', color:'linear-gradient(135deg,#FBBF24,#F59E0B)', title:'涓滄箹琛楅亾 路 鏁€佹湇鍔?, desc:'璧拌繘涓滄箹鍏昏€侀櫌锛屼粠閲嶉槼鑺傚悓鍋氳壘鑽夐敜鍒板叡鍒舵殩蹇冩閰ワ紝鐢ㄩ櫔浼翠笌鍏崇埍涓洪暱鑰呬滑鐨勬櫄骞村娣绘俯鏆栬壊褰┿€?, ct:['鏁€佺埍鑰?,'鎵嬪伐闄即','鑺傛棩搴嗙'], modal:'donghu'},
  {tag:'鍔╂畫', icon:'🌊', color:'linear-gradient(135deg,#60A5FA,#3B82F6)', title:'娴锋磱澶╁爞 路 鍔╂畫鏈嶅姟', desc:'涓?涓収鐏靛熀鍦板悎浣滐紝鍏ㄥ勾27娆℃椿鍔紝浠庢墜宸ュ埗浣滃埌闊充箰鑺傦紝娓╂殩姣忎竴涓钀姐€?, ct:['27娆℃椿鍔?,'5涓熀鍦?,'蹇冩櫤娈嬮殰鍏虫€€'], modal:'hy'},
  {tag:'鏀暀', icon:'📚', color:'linear-gradient(135deg,#4ADE80,#22C55E)', title:'椋為笩澶忎护钀?, desc:'鑷?019骞磋捣璺ㄨ秺400鍏噷灞辨捣锛屽皢楂樻牎鏅烘収閫佸線鐨栧崡灞辨潙銆傚叚骞存繁鑰曪紝鑾锋澀宸炴柊闂?.8涓囨祻瑙堛€?, ct:['6骞村潥瀹?,'瀹夊窘绁侀棬','2.8w娴忚'], modal:'zj'},
  {tag:'鏀暀', icon:'🏔️', color:'linear-gradient(135deg,#34D399,#059669)', title:'绛戞ⅵ鍓嶉檲', desc:'鍗佷竴骞存墡鏍归噾鍗庢郸姹熷墠闄堟潙锛岃幏璇勬渶浣冲疄璺靛洟闃燂紝鎶ラ亾鏀惰幏7.8w+娴忚閲忋€?, ct:['11骞村潥瀹?,'鏈€浣冲疄璺?,'7.8w娴忚'], modal:'zj'},
  {tag:'鏀暀', icon:'🌿', color:'linear-gradient(135deg,#A3E635,#65A30D)', title:'閫愭ⅵ娓呮邯', desc:'鑱氱劍鐣欏畧鍎跨鍋囨湡闄即锛屾帹鏅绋嬨€佺埍鍥戒富棰樻暀鑲诧紝鑾峰涔犲己鍥界瓑澶氬钩鍙版姤閬撱€?, ct:['鐣欏畧鍎跨','鎺ㄦ櫘鏁欒偛','瀛︿範寮哄浗'], modal:'zj'},
  {tag:'鎶ょ', icon:'🏥', color:'linear-gradient(135deg,#FB923C,#EA580C)', title:'鎶や綉绔ュ績 路 闃冲厜鐥呮埧', desc:'涓庢禉澶у効闄㈠悎浣滐紝400+娆℃湇鍔°€?2000灏忔椂銆?0000+鍙楃泭鎮ｅ効锛岃崳鑾蜂紭绉€蹇楁効鑰呭洟闃熴€?, ct:['72000灏忔椂','20000鎮ｅ効','浼樼鍥㈤槦'], modal:'ht'},
  {tag:'鍏泭', icon:'🚶', color:'linear-gradient(135deg,#C084FC,#9333EA)', title:'瑗挎箹鐩婅', desc:'96鍚嶅織鎰胯€呭潥鎸?灏忔椂锛?涓簰鍔ㄦ憡浣嶏紝300+娓稿鍙備笌锛岀敤琛屽姩娑堥櫎鍋忚銆?, ct:['96鍚嶅織鎰胯€?,'7灏忔椂','300+娓稿'], modal:'xh'},
  {tag:'鏍″洯', icon:'📖', color:'linear-gradient(135deg,#FDA4AF,#E11D48)', title:'浜屾暀璁板繂涔﹀惂', desc:'闆嗛槄璇汇€佷氦娴併€佸叕鐩婁簬涓€浣撶殑鏂囧寲绌洪棿锛屽織鎰夸汉鏁?000+锛屾寚鍗椾笅杞?400+娆°€?, ct:['1000+蹇楁効鑰?,'鏂囧寲绌洪棿','鍩硅浣撶郴'], modal:'sb'},
  {tag:'蹇冪悊', icon:'💎', color:'linear-gradient(135deg,#67E8F9,#0891B2)', title:'蹇冪伒椹跨珯', desc:'鎵嬬粯蹇冩儏鐭炽€佹矙瀛愮摱DIY銆佹儏缁氦鎹紝寮曞澶у鐢熷叧娉ㄨ嚜韬儏缁紝鐢ㄦ俯鏆栨墦鐮寸枏绂汇€?, ct:['鎯呯华鍏虫€€','蹇冪悊鍋ュ悍','娌绘剤绯?], modal:'xl'},
];

// 娓叉煋椤圭洰鍗＄墖
const pg = document.getElementById('pg');
projects.forEach((p, i) => {
  const d = document.createElement('div');
  d.className = 'pj rv' + (i % 3 ? ' rv' + (i % 3) : '');
  d.onclick = () => openM(p.modal);
  d.innerHTML = `<div class="pj-ic" style="background:${p.color}">${p.icon}</div><div class="pj-bd"><h3>${p.title}</h3><p>${p.desc}</p><div class="pj-ct">${p.ct.map(c => '<span>鈼?' + c + '</span>').join('')}</div></div>`;
  pg.appendChild(d);
});

// === 鏁板瓧婊氬姩鍔ㄧ敾 ===
function animateNumber(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const isFloat = target % 1 !== 0;
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutExpo
    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = target * ease;
    el.textContent = (isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString()) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// === 鏃ユ湡閫夋嫨鍣?===
function initDateGrid() {
  const grid = document.getElementById('dateGrid');
  const today = new Date();
  const labels = ['涓€', '浜?, '涓?, '鍥?, '浜?, '鍏?, '鏃?];

  // Header
  labels.forEach(d => {
    const h = document.createElement('div');
    h.style.cssText = 'text-align:center;font-size:.75rem;font-weight:600;color:var(--t3);padding:4px';
    h.textContent = d;
    grid.appendChild(h);
  });

  // Days - show next 21 days
  for (let i = 1; i <= 21; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    if (date.getDay() === 0) continue; // Skip Sundays

    const btn = document.createElement('button');
    btn.type = 'button';
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const val = `${date.getFullYear()}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    btn.dataset.date = val;
    btn.textContent = `${m}/${d}`;
    btn.style.cssText = 'padding:8px 4px;border-radius:8px;border:1.5px solid var(--bd);background:var(--bg);font-size:.82rem;cursor:pointer;transition:var(--tr);color:var(--t1)';
    btn.onmouseover = () => { if (!btn.classList.contains('sel')) btn.style.borderColor = 'var(--pl)'; };
    btn.onmouseout = () => { if (!btn.classList.contains('sel')) btn.style.borderColor = 'var(--bd)'; };
    btn.onclick = () => {
      btn.classList.toggle('sel');
      if (btn.classList.contains('sel')) {
        btn.style.cssText += 'background:var(--p);color:#fff;border-color:var(--p)';
      } else {
        btn.style.cssText = 'padding:8px 4px;border-radius:8px;border:1.5px solid var(--bd);background:var(--bg);font-size:.82rem;cursor:pointer;transition:var(--tr);color:var(--t1)';
      }
    };
    grid.appendChild(btn);
  }
}

// === 琛ㄥ崟鎻愪氦 ===
function submitForm(e) {
  e.preventDefault();
  const form = e.target;
  const data = {
    name: form.name.value.trim(),
    studentId: form.studentId.value.trim(),
    college: form.college.value.trim(),
    phone: form.phone.value.trim(),
    wechat: form.wechat.value.trim(),
    shift: form.shift.value,
    dates: [...document.querySelectorAll('#dateGrid button.sel')].map(b => b.dataset.date),
    flexible: form.flexible.value,
    note: form.note.value.trim(),
    time: new Date().toLocaleString('zh-CN')
  };

  if (!data.dates.length) {
    alert('璇疯嚦灏戦€夋嫨涓€涓棩鏈?);
    return;
  }

  // 妫€鏌ラ噸澶?  const records = JSON.parse(localStorage.getItem('qxSignup') || '[]');
  const dup = records.find(r => r.studentId === data.studentId && data.dates.some(d => r.dates.includes(d)));
  if (dup) {
    alert('璇ュ鍙峰湪鎵€閫夋棩鏈熷凡鏈夋姤鍚嶈褰曪紝璇峰嬁閲嶅鎻愪氦');
    return;
  }

  records.push(data);
  localStorage.setItem('qxSignup', JSON.stringify(records));
  postToSheet(data); // 鍚屾鍒?Google Sheets锛堥潪闃诲锛?
  document.getElementById('formView').style.display = 'none';
  document.getElementById('successView').style.display = 'block';
}

function resetForm() {
  document.getElementById('formView').style.display = 'block';
  document.getElementById('successView').style.display = 'none';
  document.getElementById('signupForm').reset();
  document.querySelectorAll('#dateGrid button.sel').forEach(b => {
    b.classList.remove('sel');
    b.style.cssText = 'padding:8px 4px;border-radius:8px;border:1.5px solid var(--bd);background:var(--bg);font-size:.82rem;cursor:pointer;transition:var(--tr);color:var(--t1)';
  });
}

// === 绠＄悊鍚庡彴 ===
function toggleAdmin() {
  document.getElementById('adminPanel').classList.toggle('open');
  document.getElementById('adminOverlay').classList.toggle('open');
  if (document.getElementById('adminPanel').classList.contains('open')) renderAdmin();
}

function renderAdmin() {
  // 鍏堝皾璇曚粠 Google Sheets 鎷夊彇鏁版嵁
  fetchFromSheet().then(sheetData => {
    if (sheetData && Array.isArray(sheetData)) {
      const local = JSON.parse(localStorage.getItem('qxSignup') || '[]');
      // 鍚堝苟锛氫互 Sheet 涓轰富锛岃ˉ鍏呮湰鍦扮嫭鏈夎褰?      const localIds = new Set(local.map(r => r.studentId + r.time));
      const merged = [...sheetData];
      local.forEach(r => { if (!sheetData.some(s => s.studentId === r.studentId && s.time === r.time)) merged.push(r); });
      localStorage.setItem('qxSignup', JSON.stringify(merged));
    }
    renderAdminUI();
  }).catch(() => renderAdminUI());
}

function renderAdminUI() {
  const records = JSON.parse(localStorage.getItem('qxSignup') || '[]');
  const body = document.getElementById('adminBody');

  // Stats
  const totalPeople = new Set(records.map(r => r.studentId)).size;
  const totalSlots = records.reduce((s, r) => s + r.dates.length, 0);

  let shiftCounts = { '鏃╃彮 8:00-10:00': 0, '涓彮 10:00-12:00': 0, '涓嬪崍鐝?14:00-16:00': 0, '鏅氱彮 18:00-20:00': 0 };
  records.forEach(r => { if (shiftCounts[r.shift] !== undefined) shiftCounts[r.shift]++; });

  let html = `<div class="admin-stats">
    <div class="admin-stat"><div class="n">${records.length}</div><div class="l">鎶ュ悕浜烘</div></div>
    <div class="admin-stat"><div class="n">${totalPeople}</div><div class="l">涓嶉噸澶嶄汉鏁?/div></div>
    <div class="admin-stat"><div class="n">${totalSlots}</div><div class="l">鎬荤彮娆?/div></div>
  </div>`;

  // Shift distribution
  html += '<div style="margin-bottom:20px"><div style="font-weight:600;font-size:.84rem;margin-bottom:8px">鐝鍒嗗竷</div>';
  for (const [shift, count] of Object.entries(shiftCounts)) {
    const pct = records.length ? Math.round(count / records.length * 100) : 0;
    const colors = { '鏃╃彮 8:00-10:00': '#DCFCE7', '涓彮 10:00-12:00': '#FEF3C7', '涓嬪崍鐝?14:00-16:00': '#DBEAFE', '鏅氱彮 18:00-20:00': '#F3E8FF' };
    const textColors = { '鏃╃彮 8:00-10:00': '#166534', '涓彮 10:00-12:00': '#92400E', '涓嬪崍鐝?14:00-16:00': '#1E40AF', '鏅氱彮 18:00-20:00': '#6B21A8' };
    html += `<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;font-size:.8rem">
      <span style="width:120px;color:var(--t2)">${shift}</span>
      <div style="flex:1;height:8px;background:var(--bd);border-radius:4px;overflow:hidden"><div style="width:${pct}%;height:100%;background:${colors[shift]};border-radius:4px"></div></div>
      <span style="width:40px;text-align:right;font-weight:600;color:${textColors[shift]}">${count}</span>
    </div>`;
  }
  html += '</div>';

  // Records table
  html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><div style="font-weight:600;font-size:.84rem">鎶ュ悕璁板綍</div><button onclick="localStorage.removeItem(\'qxSignup\');renderAdmin()" style="font-size:.76rem;color:var(--p);padding:4px 10px;border-radius:6px;border:1px solid var(--pl);cursor:pointer;background:transparent">娓呯┖鏁版嵁</button></div>';

  if (!records.length) {
    html += '<div class="admin-empty">鏆傛棤鎶ュ悕璁板綍</div>';
  } else {
    html += '<table class="admin-table"><thead><tr><th>濮撳悕</th><th>瀛﹀彿</th><th>鐝</th><th>鏃ユ湡</th><th>鏃堕棿</th><th>鎿嶄綔</th></tr></thead><tbody>';
    records.slice().reverse().forEach((r, i) => {
      const realIdx = records.length - 1 - i;
      const shiftClass = r.shift.includes('鏃?) ? 'morning' : r.shift.includes('涓?) ? 'midday' : r.shift.includes('涓嬪崍') ? 'afternoon' : 'evening';
      html += `<tr>
        <td style="font-weight:600">${esc(r.name)}</td>
        <td>${esc(r.studentId)}</td>
        <td><span class="admin-badge ${shiftClass}">${esc(r.shift)}</span></td>
        <td style="font-size:.76rem">${r.dates.join(', ')}</td>
        <td style="font-size:.72rem;color:var(--t3)">${r.time}</td>
        <td><button onclick="deleteRecord(${realIdx})" style="color:var(--p);font-size:.76rem;cursor:pointer;background:none;border:none">鍒犻櫎</button></td>
      </tr>`;
    });
    html += '</tbody></table>';
  }

  body.innerHTML = html;
}

function deleteRecord(idx) {
  const records = JSON.parse(localStorage.getItem('qxSignup') || '[]');
  records.splice(idx, 1);
  localStorage.setItem('qxSignup', JSON.stringify(records));
  renderAdmin();
}

function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

// === 妯℃€佹鏁版嵁 ===
const modalData = {
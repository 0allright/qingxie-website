/* ===== 杭电自动化青协 - 交互脚本 ===== */

// === 项目卡片数据 ===
const projects = [
  {tag:'敬老', img:'images/img_8.png', title:'东湖街道 · 敬老服务', desc:'走进东湖养老院，从重阳节同做艾草锤到共制暖心桃酥，用陪伴与关爱为长者们的晚年增添温暖色彩。', ct:['敬老爱老','手工陪伴','节日庆祝'], modal:'donghu'},
  {tag:'助残', img:'images/img_23.png', title:'海洋天堂 · 助残服务', desc:'与5个慧灵基地合作，全年27次活动，从手工制作到音乐节，温暖每一个角落。', ct:['27次活动','5个基地','心智残障关怀'], modal:'hy'},
  {tag:'支教', img:'images/img_64.png', title:'飞鸟夏令营', desc:'自2019年起跨越400公里山海，将高校智慧送往皖南山村。六年深耕，获杭州新闻2.8万浏览。', ct:['6年坚守','安徽祁门','2.8w浏览'], modal:'zj'},
  {tag:'支教', img:'images/img_68.png', title:'筑梦前陈', desc:'十一年扎根金华浦江前陈村，获评最佳实践团队，报道收获7.8w+浏览量。', ct:['11年坚守','最佳实践','7.8w浏览'], modal:'zj'},
  {tag:'支教', img:'images/img_75.png', title:'逐梦清溪', desc:'聚焦留守儿童假期陪伴，推普课程、爱国主题教育，获学习强国等多平台报道。', ct:['留守儿童','推普教育','学习强国'], modal:'zj'},
  {tag:'护童', img:'images/img_92.png', title:'护佑童心 · 阳光病房', desc:'与浙大儿院合作，400+次服务、72000小时、20000+受益患儿，荣获优秀志愿者团队。', ct:['72000小时','20000患儿','优秀团队'], modal:'ht'},
  {tag:'公益', img:'images/img_50.png', title:'西湖益行', desc:'96名志愿者坚持7小时，6个互动摊位，300+游客参与，用行动消除偏见。', ct:['96名志愿者','7小时','300+游客'], modal:'xh'},
  {tag:'校园', img:'images/img_79.png', title:'二教记忆书吧', desc:'集阅读、交流、公益于一体的文化空间，志愿人数1000+，指南下载3400+次。', ct:['1000+志愿者','文化空间','培训体系'], modal:'sb'},
  {tag:'心理', img:'images/img_42.png', title:'心灵驿站', desc:'手绘心情石、沙子瓶DIY、情绪交换，引导大学生关注自身情绪，用温暖打破疏离。', ct:['情绪关怀','心理健康','治愈系'], modal:'xl'},
];

// 渲染项目卡片
const pg = document.getElementById('pg');
projects.forEach((p, i) => {
  const d = document.createElement('div');
  d.className = 'pj rv' + (i % 3 ? ' rv' + (i % 3) : '');
  d.onclick = () => openM(p.modal);
  d.innerHTML = `<div class="pj-im"><img src="${p.img}" alt="${p.title}" loading="lazy"><div class="pj-ov"></div><div class="pj-tg">${p.tag}</div></div><div class="pj-bd"><h3>${p.title}</h3><p>${p.desc}</p><div class="pj-ct">${p.ct.map(c => '<span>● ' + c + '</span>').join('')}</div></div>`;
  pg.appendChild(d);
});

// === Hero 轮播 ===
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.hero-dot');

function goSlide(n) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = n;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

setInterval(() => goSlide((currentSlide + 1) % slides.length), 5000);

// === 数字滚动动画 ===
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

// === 日期选择器 ===
function initDateGrid() {
  const grid = document.getElementById('dateGrid');
  const today = new Date();
  const labels = ['一', '二', '三', '四', '五', '六', '日'];

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

// === 表单提交 ===
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
    alert('请至少选择一个日期');
    return;
  }

  // 检查重复
  const records = JSON.parse(localStorage.getItem('qxSignup') || '[]');
  const dup = records.find(r => r.studentId === data.studentId && data.dates.some(d => r.dates.includes(d)));
  if (dup) {
    alert('该学号在所选日期已有报名记录，请勿重复提交');
    return;
  }

  records.push(data);
  localStorage.setItem('qxSignup', JSON.stringify(records));

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

// === 管理后台 ===
function toggleAdmin() {
  document.getElementById('adminPanel').classList.toggle('open');
  document.getElementById('adminOverlay').classList.toggle('open');
  if (document.getElementById('adminPanel').classList.contains('open')) renderAdmin();
}

function renderAdmin() {
  const records = JSON.parse(localStorage.getItem('qxSignup') || '[]');
  const body = document.getElementById('adminBody');

  // Stats
  const totalPeople = new Set(records.map(r => r.studentId)).size;
  const totalSlots = records.reduce((s, r) => s + r.dates.length, 0);

  let shiftCounts = { '早班 8:00-10:00': 0, '中班 10:00-12:00': 0, '下午班 14:00-16:00': 0, '晚班 18:00-20:00': 0 };
  records.forEach(r => { if (shiftCounts[r.shift] !== undefined) shiftCounts[r.shift]++; });

  let html = `<div class="admin-stats">
    <div class="admin-stat"><div class="n">${records.length}</div><div class="l">报名人次</div></div>
    <div class="admin-stat"><div class="n">${totalPeople}</div><div class="l">不重复人数</div></div>
    <div class="admin-stat"><div class="n">${totalSlots}</div><div class="l">总班次</div></div>
  </div>`;

  // Shift distribution
  html += '<div style="margin-bottom:20px"><div style="font-weight:600;font-size:.84rem;margin-bottom:8px">班次分布</div>';
  for (const [shift, count] of Object.entries(shiftCounts)) {
    const pct = records.length ? Math.round(count / records.length * 100) : 0;
    const colors = { '早班 8:00-10:00': '#DCFCE7', '中班 10:00-12:00': '#FEF3C7', '下午班 14:00-16:00': '#DBEAFE', '晚班 18:00-20:00': '#F3E8FF' };
    const textColors = { '早班 8:00-10:00': '#166534', '中班 10:00-12:00': '#92400E', '下午班 14:00-16:00': '#1E40AF', '晚班 18:00-20:00': '#6B21A8' };
    html += `<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;font-size:.8rem">
      <span style="width:120px;color:var(--t2)">${shift}</span>
      <div style="flex:1;height:8px;background:var(--bd);border-radius:4px;overflow:hidden"><div style="width:${pct}%;height:100%;background:${colors[shift]};border-radius:4px"></div></div>
      <span style="width:40px;text-align:right;font-weight:600;color:${textColors[shift]}">${count}</span>
    </div>`;
  }
  html += '</div>';

  // Records table
  html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><div style="font-weight:600;font-size:.84rem">报名记录</div><button onclick="localStorage.removeItem(\'qxSignup\');renderAdmin()" style="font-size:.76rem;color:var(--p);padding:4px 10px;border-radius:6px;border:1px solid var(--pl);cursor:pointer;background:transparent">清空数据</button></div>';

  if (!records.length) {
    html += '<div class="admin-empty">暂无报名记录</div>';
  } else {
    html += '<table class="admin-table"><thead><tr><th>姓名</th><th>学号</th><th>班次</th><th>日期</th><th>时间</th><th>操作</th></tr></thead><tbody>';
    records.slice().reverse().forEach((r, i) => {
      const realIdx = records.length - 1 - i;
      const shiftClass = r.shift.includes('早') ? 'morning' : r.shift.includes('中') ? 'midday' : r.shift.includes('下午') ? 'afternoon' : 'evening';
      html += `<tr>
        <td style="font-weight:600">${esc(r.name)}</td>
        <td>${esc(r.studentId)}</td>
        <td><span class="admin-badge ${shiftClass}">${esc(r.shift)}</span></td>
        <td style="font-size:.76rem">${r.dates.join(', ')}</td>
        <td style="font-size:.72rem;color:var(--t3)">${r.time}</td>
        <td><button onclick="deleteRecord(${realIdx})" style="color:var(--p);font-size:.76rem;cursor:pointer;background:none;border:none">删除</button></td>
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

// === 模态框数据 ===
const modalData = {
  donghu: { t: '东湖街道 · 敬老活动', b: '<p>2025年，杭电自动化青协携手东湖养老院，开展了多场丰富多彩的志愿活动。从重阳节同做艾草锤到共制暖心桃酥，每一场活动都承载着无尽的关爱与祝福。</p><p>正如古人云："老吾老以及人之老"，我们用陪伴传递敬意，用手作承载关怀，让敬老爱老的种子在岁月中生根发芽。</p><div class="mo-imgs"><img src="images/img_0.png" alt=""><img src="images/img_1.png" alt=""><img src="images/img_2.png" alt=""><img src="images/img_7.png" alt=""></div>' },
  hy: { t: '海洋天堂 · 助残服务', b: '<p>2025年，"海洋天堂"志愿服务照亮了东湖、九堡、临平、丁桥、闸弄口残疾人之家的每一个角落。全年共举办27次活动，每一场都承载着无尽的关爱与祝福。</p><p>从手工制作到知识讲座，从趣味运动会到音乐节，志愿者们以微光之力，赴温暖之约，用日复一日的坚守与真诚，编织出暖意绵长的动人画卷。</p><div class="mo-imgs"><img src="images/img_10.png" alt=""><img src="images/img_13.png" alt=""><img src="images/img_16.png" alt=""><img src="images/img_23.png" alt=""></div>' },
  zj: { t: '暑期支教 · 教育帮扶', b: '<p>三支支教队伍——飞鸟夏令营（安徽祁门）、筑梦前陈（金华浦江）、逐梦清溪（温州大溪），用青春点燃乡村儿童的梦想。</p><p>飞鸟夏令营六年深耕，筑梦前陈十一年坚守，逐梦清溪获学习强国报道。从科学实验到国画课堂，从方山茶博园到趣味运动会，为乡村孩子打开看世界的窗。</p><div class="mo-imgs"><img src="images/img_62.png" alt=""><img src="images/img_65.png" alt=""><img src="images/img_69.png" alt=""><img src="images/img_76.png" alt=""></div>' },
  ht: { t: '护佑童心 · 阳光病房', b: '<p>2017年启动，与浙大儿院合作，围绕节日庆典、传统文化、科学启蒙、科技融合及兴趣培养五大维度开展活动。</p><p>从冬至包饺子到智能车科普，从非遗剪纸到情景剧，在陪伴式教育中填补长期住院儿童的教育服务空白。</p><div class="mo-imgs"><img src="images/img_92.png" alt=""><img src="images/img_94.png" alt=""><img src="images/img_96.png" alt=""><img src="images/img_97.png" alt=""></div>' },
  xh: { t: '西湖益行 · 公益徒步', b: '<p>2025年4月26日，96名志愿者坚持7小时，设置6个互动摊位，300+游客参与。</p><p>从"心桥共建"分发500+手册，到"慧声慧色"义卖慧灵作品，到"与爱共绘"漆扇DIY，用行动书写了一个关于"理解"的故事。</p><div class="mo-imgs"><img src="images/img_50.png" alt=""><img src="images/img_53.png" alt=""><img src="images/img_56.png" alt=""><img src="images/img_60.png" alt=""></div>' },
  sb: { t: '二教记忆书吧', b: '<p>2024年11月25日正式成立，确立"以书会友，服务社会"的宗旨。志愿人数扩展到1000+，培训指南下载3400+次。</p><p>涵盖英语角布置、学院招聘会、妇女节送花等大型活动支持。在这里放慢脚步，享受当下的美好。</p><div class="mo-imgs"><img src="images/img_78.png" alt=""><img src="images/img_81.png" alt=""><img src="images/img_83.png" alt=""><img src="images/img_84.png" alt=""></div>' },
  xl: { t: '心灵驿站', b: '<p>三个治愈系环节，引导大学生关注自身情绪，用温暖打破疏离。</p><p>手绘心情石——形态各异的鹅卵石成了承载悲喜的画板；沙子瓶DIY——封存了初夏日里最纯粹的治愈；情绪交换——陌生人间传递的善意悄然流淌。</p><div class="mo-imgs"><img src="images/img_42.png" alt=""><img src="images/img_43.png" alt=""><img src="images/img_44.png" alt=""><img src="images/img_45.png" alt=""></div>' },
  dh1: { t: '金秋伴长者，巧手庆重阳', b: '<p>2025年10月22日，开展"爱在重阳，情暖金秋"手工艾草锤制作活动。</p><p>手工老师介绍了艾草锤的养生寓意与制作步骤，志愿者一对一协助长者穿针引线，将艾草、布料缝制成一个个色彩鲜亮的艾草锤。现场暖意融融，大家谈笑风生。</p><div class="mo-imgs"><img src="images/img_0.png" alt=""><img src="images/img_1.png" alt=""></div>' },
  dh2: { t: '酥香满厅堂，温情共朝夕', b: '<p>11月12日，陪伴老人一起做桃酥。大家相互协作、热情交流，从揉面、塑形到等待出炉，全程充满欢声笑语。</p><div class="mo-imgs"><img src="images/img_2.png" alt=""><img src="images/img_3.png" alt=""><img src="images/img_4.png" alt=""><img src="images/img_5.png" alt=""></div>' },
  dh3: { t: '欢歌与笑语，享美好时光', b: '<p>12月24日，老年学校2025年度结业典礼。管乐、合唱、戏曲、二胡、萨克斯、舞蹈轮番上演。</p><p>全体合唱《祖国不会忘记》将现场推向高潮。结业不是结束，而是新的开始。</p><div class="mo-imgs"><img src="images/img_6.png" alt=""><img src="images/img_7.png" alt=""></div>' },
  hy1: { t: '东湖慧灵：情暖金秋', b: '<p>重阳佳节，与慧灵学员制作主题手作香囊。简单的纹样、质朴的话语，藏着对生活的热爱。</p><div class="mo-imgs"><img src="images/img_10.png" alt=""><img src="images/img_11.png" alt=""></div>' },
  hy2: { t: '九堡慧灵：艺术点亮生活', b: '<p>冬至时节走进九堡慧灵基地，用彩色橡皮泥制作花样饺子。</p><div class="mo-imgs"><img src="images/img_12.png" alt=""><img src="images/img_13.png" alt=""></div>' },
  hy3: { t: '临平慧灵：双旦同庆', b: '<p>桂花香里共赴国庆中秋团圆之约。香囊制作环节，大家将香粉揉成香泥，细心填入模具。</p><div class="mo-imgs"><img src="images/img_14.png" alt=""><img src="images/img_15.png" alt=""></div>' },
  hy4: { t: '丁桥慧灵：初冬欢歌', b: '<p>音乐节活动，流行曲、民谣、合唱轮番登场。每一句都饱含真心，没有隔阂，只有真诚的互动。</p><div class="mo-imgs"><img src="images/img_16.png" alt=""><img src="images/img_17.png" alt=""></div>' },
  hy5: { t: '闸弄口慧灵：辞旧迎新', b: '<p>喜迎元旦，抽奖环节、心愿环节，最后制作心形祈福牌。镜头定格下充满期盼的脸庞。</p><div class="mo-imgs"><img src="images/img_18.png" alt=""><img src="images/img_19.png" alt=""></div>' },
  zj1: { t: '飞鸟夏令营 · 安徽祁门', b: '<p>自2019年起，跨越400+公里山海。科学拓展课、艺术创作课、梦想主题班会多元课程。获杭州新闻2.8万浏览。</p><div class="mo-imgs"><img src="images/img_62.png" alt=""><img src="images/img_63.png" alt=""><img src="images/img_64.png" alt=""><img src="images/img_65.png" alt=""></div>' },
  zj2: { t: '筑梦前陈 · 浦江前陈村', b: '<p>十一年扎根前陈村。学业辅导、科普、艺术、体育特色课程。获评最佳实践团队，7.8w+浏览量。</p><div class="mo-imgs"><img src="images/img_68.png" alt=""><img src="images/img_69.png" alt=""><img src="images/img_70.png" alt=""><img src="images/img_71.png" alt=""></div>' },
  zj3: { t: '逐梦清溪 · 温州大溪', b: '<p>推普、爱国主题课程，方山茶博园调研。获学习强国、潮新闻等多平台报道。</p><div class="mo-imgs"><img src="images/img_75.png" alt=""><img src="images/img_76.png" alt=""><img src="images/img_77.png" alt=""></div>' },
  ht1: { t: '冬至暖娃', b: '<p>在浙大儿院为小朋友开展"暖冬冬至·趣味包饺子"活动，讲解冬至民俗常识。</p><div class="mo-imgs"><img src="images/img_94.png" alt=""><img src="images/img_95.png" alt=""></div>' },
  ht2: { t: '智驾随行', b: '<p>将智能车模型带入病房，现场讲解与演示，激发孩子们对科学的兴趣。</p><div class="mo-imgs"><img src="images/img_93.png" alt=""><img src="images/img_96.png" alt=""></div>' },
  ht3: { t: '指尖非遗 · 趣味剪纸', b: '<p>教授剪纸技艺，传承非遗文化，锻炼手部精细动作。</p><div class="mo-imgs"><img src="images/img_97.png" alt=""></div>' },
  qt1: { t: '二教记忆书吧', b: '<p>2024年11月成立，"以书会友，服务社会"。志愿人数1000+，指南下载3400+次。</p><div class="mo-imgs"><img src="images/img_78.png" alt=""><img src="images/img_79.png" alt=""><img src="images/img_81.png" alt=""><img src="images/img_84.png" alt=""></div>' },
  qt2: { t: '西湖益行', b: '<p>96名志愿者坚持7小时，6个摊位，300+游客。用行动书写"理解"的故事。</p><div class="mo-imgs"><img src="images/img_50.png" alt=""><img src="images/img_52.png" alt=""><img src="images/img_56.png" alt=""><img src="images/img_60.png" alt=""></div>' },
  qt3: { t: '心灵驿站', b: '<p>手绘心情石、沙子瓶DIY、情绪交换三个治愈系环节。</p><div class="mo-imgs"><img src="images/img_42.png" alt=""><img src="images/img_43.png" alt=""><img src="images/img_44.png" alt=""></div>' },
  qt4: { t: '全体大会', b: '<p>2025年共五次大会：五月大会、第二十三届青代会、迎新见面会、暖青大会、十二月大会。</p><div class="mo-imgs"><img src="images/img_27.png" alt=""><img src="images/img_31.png" alt=""><img src="images/img_37.png" alt=""><img src="images/img_39.png" alt=""></div>' },
  qt5: { t: '百团招新', b: '<p>2025年9月21日，106号摊位。项拓基拓、新媒体、志愿者管理、组织部办公室……无论热衷创意策划还是擅长幕后支持，都能找到自己的天地。</p><div class="mo-imgs"><img src="images/img_89.png" alt=""><img src="images/img_90.png" alt=""><img src="images/img_91.png" alt=""></div>' },
  join: { t: '加入杭电自动化青协', b: '<p style="font-weight:600">我们提供：</p><p>🤝 丰富的志愿活动 — 灵动翼行、飞鸟夏令营、护佑童心等品牌项目</p><p>📱 成长平台 — 新媒体运营、活动策划、组织管理等能力锻炼</p><p>💫 温暖集体 — 志同道合的小伙伴，真挚的友谊与归属感</p><p style="font-weight:600;margin-top:12px">加入方式：</p><p>关注官方公众号获取最新招新信息，或加入QQ答疑群了解详情。</p>' },
};

function openM(id) {
  const d = modalData[id]; if (!d) return;
  document.getElementById('mTitle').textContent = d.t;
  document.getElementById('mBody').innerHTML = d.b;
  document.getElementById('modal').classList.add('on');
  document.body.style.overflow = 'hidden';
}
function closeM() {
  document.getElementById('modal').classList.remove('on');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeM(); });

// === Scroll Effects ===
const nav = document.getElementById('nav');
const btt = document.getElementById('btt');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
  btt.classList.toggle('show', window.scrollY > 600);
});

// === Reveal on Scroll ===
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('vis');
      // Trigger number animation
      e.target.querySelectorAll('[data-target]').forEach(el => animateNumber(el));
      if (e.target.dataset.target) animateNumber(e.target);
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.rv').forEach(el => obs.observe(el));

// === Active Nav ===
const sectionIds = ['about', 'projects', 'data', 'events', 'signup', 'join'];
const navAs = document.querySelectorAll('.nav-links a:not(.nav-cta)');
window.addEventListener('scroll', () => {
  let cur = '';
  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.offsetTop - 200 <= window.scrollY) cur = id;
  });
  navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
});

// === Init ===
initDateGrid();

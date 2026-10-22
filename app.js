/**
 * MathVerse - High School Interactive Math Platform
 * Complete client-side interactive engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initParabolaLab();
  initInequalityVisualizer();
  initGeometryWorkbench();
  initQuizSystem();
  initSmoothScroll();
});

/* ==========================================================================
   Module 1: Parabola Interactive Lab
   ========================================================================== */

function initParabolaLab() {
  const canvas = document.getElementById('parabolaCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Parameters: y = a*x^2 + b*x + c
  let state = {
    a: -2,
    b: 4,
    c: 1,
    showGhost: false, // for translation comparison
    ghostA: 1,
    ghostH: 3,
    ghostK: -1,
    hoverX: null,
    hoverY: null
  };

  const sliderA = document.getElementById('sliderA');
  const sliderB = document.getElementById('sliderB');
  const sliderC = document.getElementById('sliderC');
  const valA = document.getElementById('valA');
  const valB = document.getElementById('valB');
  const valC = document.getElementById('valC');

  // Metric displays
  const vertexDisplay = document.getElementById('metricVertex');
  const axisDisplay = document.getElementById('metricAxis');
  const deltaDisplay = document.getElementById('metricDelta');
  const extremaDisplay = document.getElementById('metricExtrema');
  const equationDisplay = document.getElementById('metricEquation');

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    draw();
  }

  window.addEventListener('resize', resizeCanvas);

  function updateMetrics() {
    const a = state.a;
    const b = state.b;
    const c = state.c;

    valA.textContent = a.toFixed(1);
    valB.textContent = b.toFixed(1);
    valC.textContent = c.toFixed(1);

    if (Math.abs(a) < 0.001) {
      vertexDisplay.textContent = "退化為直線";
      axisDisplay.textContent = "無";
      deltaDisplay.textContent = "一次方程";
      extremaDisplay.textContent = "無極值";
      equationDisplay.textContent = `y = ${b.toFixed(1)}x + ${c.toFixed(1)}`;
      return;
    }

    const h = -b / (2 * a);
    const k = a * h * h + b * h + c;
    const D = b * b - 4 * a * c;

    vertexDisplay.textContent = `(${h.toFixed(2)}, ${k.toFixed(2)})`;
    axisDisplay.textContent = `x = ${h.toFixed(2)}`;

    if (D > 0.0001) {
      const r1 = (-b + Math.sqrt(D)) / (2 * a);
      const r2 = (-b - Math.sqrt(D)) / (2 * a);
      deltaDisplay.textContent = `D = ${D.toFixed(1)} (兩交點)`;
    } else if (Math.abs(D) <= 0.0001) {
      deltaDisplay.textContent = `D = 0 (相切於一點)`;
    } else {
      deltaDisplay.textContent = `D = ${D.toFixed(1)} (無交點)`;
    }

    const extType = a > 0 ? "最小值" : "最大值";
    extremaDisplay.textContent = `${extType} ${k.toFixed(2)}`;

    // Format equation nicely
    let eqStr = "y = ";
    if (a === 1) eqStr += "x²";
    else if (a === -1) eqStr += "-x²";
    else eqStr += `${a}x²`;

    if (b > 0) eqStr += ` + ${b === 1 ? '' : b}x`;
    else if (b < 0) eqStr += ` - ${Math.abs(b) === 1 ? '' : Math.abs(b)}x`;

    if (c > 0) eqStr += ` + ${c}`;
    else if (c < 0) eqStr += ` - ${Math.abs(c)}`;
    else if (a === 0 && b === 0) eqStr = "y = 0";

    equationDisplay.textContent = eqStr;
  }

  function draw() {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);
    ctx.clearRect(0, 0, width, height);

    const originX = width / 2;
    const originY = height / 2 + 30; // slightly shift down
    const scale = 28; // pixels per unit

    // 1. Draw Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;

    // Vertical grid lines
    for (let x = originX % scale; x < width; x += scale) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    // Horizontal grid lines
    for (let y = originY % scale; y < height; y += scale) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 2. Main Axes (X and Y)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2;

    // X Axis
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();

    // Y Axis
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Axis Labels & Ticks
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = '11px JetBrains Mono, monospace';

    // X ticks
    for (let i = -15; i <= 15; i++) {
      if (i === 0) continue;
      const px = originX + i * scale;
      if (px > 20 && px < width - 20) {
        ctx.fillRect(px - 0.5, originY - 3, 1, 6);
        if (i % 2 === 0) {
          ctx.fillText(i, px - 4, originY + 16);
        }
      }
    }

    // Y ticks
    for (let j = -12; j <= 12; j++) {
      if (j === 0) continue;
      const py = originY - j * scale;
      if (py > 20 && py < height - 20) {
        ctx.fillRect(originX - 3, py - 0.5, 6, 1);
        if (j % 2 === 0) {
          ctx.fillText(j, originX + 8, py + 4);
        }
      }
    }
    ctx.fillText("0", originX - 12, originY + 14);
    ctx.fillText("X", width - 15, originY - 8);
    ctx.fillText("Y", originX + 8, 16);

    // 3. Draw Ghost Parabola (if translation active)
    if (state.showGhost) {
      ctx.save();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      let startedGhost = false;
      for (let px = 0; px <= width; px += 2) {
        const x = (px - originX) / scale;
        const y = state.ghostA * Math.pow(x - state.ghostH, 2) + state.ghostK;
        const py = originY - y * scale;
        if (!startedGhost) {
          ctx.moveTo(px, py);
          startedGhost = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();

      // Ghost vertex
      const ghostVx = originX + state.ghostH * scale;
      const ghostVy = originY - state.ghostK * scale;
      ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
      ctx.beginPath();
      ctx.arc(ghostVx, ghostVy, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText(`原頂點 (${state.ghostH}, ${state.ghostK})`, ghostVx + 8, ghostVy - 8);
      ctx.restore();
    }

    // 4. Draw Axis of Symmetry
    const a = state.a;
    const b = state.b;
    const c = state.c;

    if (Math.abs(a) > 0.001) {
      const h = -b / (2 * a);
      const k = a * h * h + b * h + c;
      const axisPx = originX + h * scale;

      ctx.save();
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.5)';
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(axisPx, 0);
      ctx.lineTo(axisPx, height);
      ctx.stroke();

      ctx.fillStyle = '#f43f5e';
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.fillText(`對稱軸 x = ${h.toFixed(1)}`, axisPx + 6, 25);
      ctx.restore();

      // 5. Draw Parabola Curve
      ctx.save();
      ctx.strokeStyle = '#06b6d4';
      ctx.shadowColor = 'rgba(6, 182, 212, 0.75)';
      ctx.shadowBlur = 12;
      ctx.lineWidth = 3;
      ctx.beginPath();
      let started = false;

      for (let px = 0; px <= width; px += 2) {
        const x = (px - originX) / scale;
        const y = a * x * x + b * x + c;
        const py = originY - y * scale;

        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
      ctx.restore();

      // 6. Draw Vertex Point
      const vx = originX + h * scale;
      const vy = originY - k * scale;

      // Pulse circle
      ctx.save();
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(vx, vy, 6, 0, Math.PI * 2);
      ctx.fill();

      // Vertex label card
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.lineWidth = 1;
      const vText = `頂點 (${h.toFixed(1)}, ${k.toFixed(1)})`;
      const textWidth = ctx.measureText(vText).width;
      const boxX = vx + 10;
      const boxY = vy - 24;
      ctx.fillRect(boxX, boxY, textWidth + 14, 20);
      ctx.strokeRect(boxX, boxY, textWidth + 14, 20);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px JetBrains Mono, monospace';
      ctx.fillText(vText, boxX + 7, boxY + 14);
      ctx.restore();

      // 7. Draw Roots / X-intercepts
      const D = b * b - 4 * a * c;
      if (D >= 0) {
        const sqrtD = Math.sqrt(D);
        const roots = D === 0 ? [-b / (2 * a)] : [(-b + sqrtD) / (2 * a), (-b - sqrtD) / (2 * a)];
        roots.forEach(r => {
          const rx = originX + r * scale;
          const ry = originY;
          ctx.save();
          ctx.fillStyle = '#10b981';
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(rx, ry, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#6ee7b7';
          ctx.font = '10px JetBrains Mono, monospace';
          ctx.fillText(`(${r.toFixed(1)}, 0)`, rx - 18, ry + 16);
          ctx.restore();
        });
      }
    }

    // 8. Draw Mouse Hover Point if present
    if (state.hoverX !== null) {
      const hx = state.hoverX;
      const mathX = (hx - originX) / scale;
      const mathY = a * mathX * mathX + b * mathX + c;
      const hy = originY - mathY * scale;

      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(hx, originY);
      ctx.lineTo(hx, hy);
      ctx.stroke();

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(hx, hy, 4, 0, Math.PI * 2);
      ctx.fill();

      // Tooltip
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.strokeStyle = '#f59e0b';
      const tipText = `(${mathX.toFixed(1)}, ${mathY.toFixed(1)})`;
      ctx.fillRect(hx + 10, hy - 25, 75, 20);
      ctx.strokeRect(hx + 10, hy - 25, 75, 20);
      ctx.fillStyle = '#fbbf24';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillText(tipText, hx + 16, hy - 11);
      ctx.restore();
    }
  }

  // Event Listeners for Sliders
  function updateFromSliders() {
    state.a = parseFloat(sliderA.value);
    state.b = parseFloat(sliderB.value);
    state.c = parseFloat(sliderC.value);
    state.showGhost = false;
    updateMetrics();
    draw();
  }

  sliderA.addEventListener('input', updateFromSliders);
  sliderB.addEventListener('input', updateFromSliders);
  sliderC.addEventListener('input', updateFromSliders);

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    state.hoverX = e.clientX - rect.left;
    draw();
  });

  canvas.addEventListener('mouseleave', () => {
    state.hoverX = null;
    draw();
  });

  // Presets handling
  window.loadParabolaPreset = function(presetType) {
    document.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
    if (presetType === 'q1') {
      // y = -2x^2 + 4x + 1
      state.a = -2; state.b = 4; state.c = 1;
      state.showGhost = false;
    } else if (presetType === 'q2_1') {
      // y = x^2 - 3x + 5
      state.a = 1; state.b = -3; state.c = 5;
      state.showGhost = false;
    } else if (presetType === 'q2_2') {
      // y = -x^2 + 6x - 9
      state.a = -1; state.b = 6; state.c = -9;
      state.showGhost = false;
    } else if (presetType === 'fill4') {
      // translation: from (x-3)^2 - 1 to (x-5)^2 - 4
      // expanded: (x-5)^2 - 4 = x^2 - 10x + 21
      state.a = 1; state.b = -10; state.c = 21;
      state.showGhost = true;
      state.ghostA = 1;
      state.ghostH = 3;
      state.ghostK = -1;
    }

    sliderA.value = state.a;
    sliderB.value = state.b;
    sliderC.value = state.c;
    updateMetrics();
    draw();
  };

  // Initial call
  resizeCanvas();
  updateMetrics();
}

/* ==========================================================================
   Module 2: Inequality Visualizer (數線儀)
   ========================================================================== */

function initInequalityVisualizer() {
  const canvas = document.getElementById('inequalityCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let mode = 'q3'; // 'q3', 'q4', 'q7'

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    draw();
  }

  window.addEventListener('resize', resizeCanvas);

  function draw() {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);
    ctx.clearRect(0, 0, width, height);

    const originX = width / 2;
    const originY = height / 2 + 10;
    const scale = 36; // pixels per unit

    // 1. Draw Main Number Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(30, originY);
    ctx.lineTo(width - 30, originY);
    ctx.stroke();

    // Arrow heads
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.moveTo(width - 30, originY - 6);
    ctx.lineTo(width - 15, originY);
    ctx.lineTo(width - 30, originY + 6);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(30, originY - 6);
    ctx.lineTo(15, originY);
    ctx.lineTo(30, originY + 6);
    ctx.fill();

    // 2. Ticks and Numbers (-8 to +8)
    ctx.font = '12px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.textAlign = 'center';

    for (let i = -7; i <= 7; i++) {
      const px = originX + i * scale;
      if (px > 40 && px < width - 40) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px, originY - 6);
        ctx.lineTo(px, originY + 6);
        ctx.stroke();

        ctx.fillText(i, px, originY + 24);
      }
    }

    // 3. Highlight Range based on active problem
    const descEl = document.getElementById('inequalityDesc');
    const answerEl = document.getElementById('inequalityAnswer');

    if (mode === 'q3') {
      // 試卷第 3 題: |x + 3| <= 2 => -5 <= x <= -1
      descEl.textContent = "試卷第 3 題：求不等式 |x + 3| ≤ 2 的解";
      answerEl.innerHTML = "展開絕對值：-2 ≤ x + 3 ≤ 2 &nbsp;➔&nbsp; <strong style='color:#38bdf8'>-5 ≤ x ≤ -1</strong>（封閉區間，實心端點）";

      const x1 = originX + (-5) * scale;
      const x2 = originX + (-1) * scale;

      // Interval bar
      ctx.save();
      ctx.strokeStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 14;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(x1, originY);
      ctx.lineTo(x2, originY);
      ctx.stroke();

      // Shaded area above
      ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.fillRect(x1, originY - 40, x2 - x1, 40);

      // Solid endpoints
      [-5, -1].forEach(val => {
        const px = originX + val * scale;
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(px, originY, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
      ctx.restore();

    } else if (mode === 'q4') {
      // 試卷第 4 題: |2x - 5| > 3 => x < 1 或 x > 4
      descEl.textContent = "試卷第 4 題：求不等式 |2x - 5| > 3 的解";
      answerEl.innerHTML = "2x - 5 > 3 或 2x - 5 < -3 &nbsp;➔&nbsp; <strong style='color:#f43f5e'>x < 1 或 x > 4</strong>（開區間，空心端點向兩側發散）";

      const x1 = originX + 1 * scale;
      const x2 = originX + 4 * scale;

      ctx.save();
      ctx.strokeStyle = '#f43f5e';
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 14;
      ctx.lineWidth = 8;

      // Left ray: x < 1
      ctx.beginPath();
      ctx.moveTo(x1, originY);
      ctx.lineTo(35, originY);
      ctx.stroke();

      // Right ray: x > 4
      ctx.beginPath();
      ctx.moveTo(x2, originY);
      ctx.lineTo(width - 35, originY);
      ctx.stroke();

      // Hollow endpoints (open circles)
      [1, 4].forEach(val => {
        const px = originX + val * scale;
        ctx.fillStyle = '#0a0d14';
        ctx.beginPath();
        ctx.arc(px, originY, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 3;
        ctx.stroke();
      });
      ctx.restore();

    } else if (mode === 'q7') {
      // 試卷第 7 題: 2x^2 + 5x - 3 < 0 => (2x - 1)(x + 3) < 0 => -3 < x < 0.5
      descEl.textContent = "試卷第 7 題：解一元二次不等式 2x² + 5x - 3 < 0";
      answerEl.innerHTML = "因式分解：(2x - 1)(x + 3) < 0 &nbsp;➔&nbsp; 兩根為 -3 與 0.5 &nbsp;➔&nbsp; <strong style='color:#10b981'>-3 < x < 0.5</strong>（開區間，空心端點）";

      const x1 = originX + (-3) * scale;
      const x2 = originX + 0.5 * scale;

      ctx.save();
      ctx.strokeStyle = '#10b981';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 14;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(x1, originY);
      ctx.lineTo(x2, originY);
      ctx.stroke();

      // Hollow endpoints
      [-3, 0.5].forEach(val => {
        const px = originX + val * scale;
        ctx.fillStyle = '#0a0d14';
        ctx.beginPath();
        ctx.arc(px, originY, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#6ee7b7';
        ctx.fillText(val, px, originY - 15);
      });
      ctx.restore();
    }
  }

  window.setInequalityMode = function(newMode) {
    mode = newMode;
    document.querySelectorAll('#inequalityTabs .tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === newMode);
    });
    draw();
  };

  resizeCanvas();
}

/* ==========================================================================
   Module 3: Coordinate Geometry Workbench (解析幾何畫板)
   ========================================================================== */

function initGeometryWorkbench() {
  const canvas = document.getElementById('geometryCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let activeTab = 'circle'; // 'circle', 'centroid', 'parallelogram', 'distance'

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    draw();
  }

  window.addEventListener('resize', resizeCanvas);

  function draw() {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);
    ctx.clearRect(0, 0, width, height);

    const originX = width / 2;
    const originY = height / 2 + 10;
    const scale = 30; // 30px per unit

    // Draw Grid & Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = originX % scale; x < width; x += scale) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = originY % scale; y < height; y += scale) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, originY); ctx.lineTo(width, originY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(originX, 0); ctx.lineTo(originX, height); ctx.stroke();

    const infoEl = document.getElementById('geoInfoBox');

    if (activeTab === 'circle') {
      // 試卷計算第 6 題: A(-3, 2), B(0, 6)
      const ax = -3, ay = 2;
      const bx = 0, by = 6;
      const cx = (ax + bx) / 2; // -1.5
      const cy = (ay + by) / 2; // 4
      const diameter = Math.hypot(bx - ax, by - ay); // 5
      const radius = diameter / 2; // 2.5

      infoEl.innerHTML = `
        <div style="font-weight:700; color:#38bdf8; margin-bottom:0.4rem;">[試卷計算 6] 圓之圓心與直徑長</div>
        <div>端點 A(-3, 2), B(0, 6)</div>
        <div>圓心 (中點)：((-3+0)/2, (2+6)/2) = <strong>(-1.5, 4)</strong> (即 -3/2, 4)</div>
        <div>直徑長 d = √[ (0-(-3))² + (6-2)² ] = √(9+16) = √25 = <strong style="color:#10b981; font-size:1.1rem;">5</strong></div>
        <div style="color:#f59e0b; font-size:0.85rem; margin-top:0.3rem;">⚠ 試卷得分叮嚀：學生漏寫了「直徑長 = 5」，因此被扣 3 分！</div>
      `;

      // Draw Circle
      const cpx = originX + cx * scale;
      const cpy = originY - cy * scale;
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
      ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cpx, cpy, radius * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Diameter Line AB
      const apx = originX + ax * scale;
      const apy = originY - ay * scale;
      const bpx = originX + bx * scale;
      const bpy = originY - by * scale;

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(apx, apy);
      ctx.lineTo(bpx, bpy);
      ctx.stroke();

      // Points
      drawPoint(ctx, apx, apy, 'A(-3, 2)', '#38bdf8');
      drawPoint(ctx, bpx, bpy, 'B(0, 6)', '#38bdf8');
      drawPoint(ctx, cpx, cpy, '圓心 (-1.5, 4)', '#f43f5e');
      ctx.restore();

    } else if (activeTab === 'centroid') {
      // 試卷計算第 5 題: A(a, -5), B(3, b), C(4, -3), G(3, -1) => a=2, b=5
      const a = 2, b = 5;
      const ax = a, ay = -5;
      const bx = 3, by = b;
      const cx = 4, cy = -3;
      const gx = (ax + bx + cx) / 3; // 3
      const gy = (ay + by + cy) / 3; // -1

      infoEl.innerHTML = `
        <div style="font-weight:700; color:#38bdf8; margin-bottom:0.4rem;">[試卷計算 5] △ABC 重心坐標</div>
        <div>頂點 A(a, -5), B(3, b), C(4, -3)，已知重心 G(3, -1)</div>
        <div>重心公式：(a + 3 + 4)/3 = 3 ➔ 7 + a = 9 ➔ <strong style="color:#10b981;">a = 2</strong></div>
        <div>(-5 + b - 3)/3 = -1 ➔ -8 + b = -3 ➔ <strong style="color:#10b981;">b = 5</strong></div>
      `;

      const apx = originX + ax * scale;
      const apy = originY - ay * scale;
      const bpx = originX + bx * scale;
      const bpy = originY - by * scale;
      const cpx = originX + cx * scale;
      const cpy = originY - cy * scale;
      const gpx = originX + gx * scale;
      const gpy = originY - gy * scale;

      ctx.save();
      // Triangle fill & stroke
      ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
      ctx.strokeStyle = '#818cf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(apx, apy);
      ctx.lineTo(bpx, bpy);
      ctx.lineTo(cpx, cpy);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Medians
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(apx, apy); ctx.lineTo((bpx + cpx) / 2, (bpy + cpy) / 2);
      ctx.moveTo(bpx, bpy); ctx.lineTo((apx + cpx) / 2, (apy + cpy) / 2);
      ctx.moveTo(cpx, cpy); ctx.lineTo((apx + bpx) / 2, (apy + bpy) / 2);
      ctx.stroke();

      // Vertices
      drawPoint(ctx, apx, apy, 'A(2, -5)', '#38bdf8');
      drawPoint(ctx, bpx, bpy, 'B(3, 5)', '#38bdf8');
      drawPoint(ctx, cpx, cpy, 'C(4, -3)', '#38bdf8');
      drawPoint(ctx, gpx, gpy, '重心 G(3, -1)', '#f43f5e');
      ctx.restore();

    } else if (activeTab === 'parallelogram') {
      // 試卷計算第 8 題: A(3, 4), C(-1, -2), D(2, 5), 求 B(0, -3)
      const ax = 3, ay = 4;
      const cx = -1, cy = -2;
      const dx = 2, dy = 5;
      const bx = ax + cx - dx; // 0
      const by = ay + cy - dy; // -3

      infoEl.innerHTML = `
        <div style="font-weight:700; color:#38bdf8; margin-bottom:0.4rem;">[試卷計算 8] 平行四邊形第四頂點</div>
        <div>已知 A(3, 4), C(-1, -2), D(2, 5)</div>
        <div>對角線互相平分：AC 中點 = BD 中點 ➔ A + C = B + D</div>
        <div>故 B = A + C - D = (3-1-2, 4-2-5) = <strong style="color:#10b981; font-size:1.1rem;">B(0, -3)</strong></div>
      `;

      const apx = originX + ax * scale;
      const apy = originY - ay * scale;
      const bpx = originX + bx * scale;
      const bpy = originY - by * scale;
      const cpx = originX + cx * scale;
      const cpy = originY - cy * scale;
      const dpx = originX + dx * scale;
      const dpy = originY - dy * scale;

      ctx.save();
      // Parallelogram ABCD
      ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(apx, apy);
      ctx.lineTo(bpx, bpy);
      ctx.lineTo(cpx, cpy);
      ctx.lineTo(dpx, dpy);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Diagonals AC and BD
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.moveTo(apx, apy); ctx.lineTo(cpx, cpy);
      ctx.moveTo(bpx, bpy); ctx.lineTo(dpx, dpy);
      ctx.stroke();

      // Intersection / Midpoint
      const mx = (apx + cpx) / 2;
      const my = (apy + cpy) / 2;
      drawPoint(ctx, mx, my, '對角中點 (1, 1)', '#f59e0b');

      drawPoint(ctx, apx, apy, 'A(3, 4)', '#38bdf8');
      drawPoint(ctx, bpx, bpy, 'B(0, -3)', '#ec4899');
      drawPoint(ctx, cpx, cpy, 'C(-1, -2)', '#38bdf8');
      drawPoint(ctx, dpx, dpy, 'D(2, 5)', '#38bdf8');
      ctx.restore();

    } else if (activeTab === 'distance') {
      // 試卷填充第 5 題: A(-2, 5) 到 x 軸距離 a=5, 到 y 軸距離 b=2
      const ax = -2, ay = 5;
      const a = Math.abs(ay);
      const b = Math.abs(ax);

      infoEl.innerHTML = `
        <div style="font-weight:700; color:#38bdf8; margin-bottom:0.4rem;">[試卷填充 5] 點到坐標軸距離</div>
        <div>點 A(-2, 5)</div>
        <div>到 x 軸之距離 a = |y| = |5| = <strong style="color:#10b981;">5</strong></div>
        <div>到 y 軸之距離 b = |x| = |-2| = <strong style="color:#10b981;">2</strong></div>
      `;

      const apx = originX + ax * scale;
      const apy = originY - ay * scale;

      ctx.save();
      // Distance lines
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2.5;

      // To X axis
      ctx.beginPath();
      ctx.moveTo(apx, apy);
      ctx.lineTo(apx, originY);
      ctx.stroke();

      // To Y axis
      ctx.strokeStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(apx, apy);
      ctx.lineTo(originX, apy);
      ctx.stroke();

      drawPoint(ctx, apx, apy, 'A(-2, 5)', '#f59e0b');
      drawPoint(ctx, apx, originY, '投影到 X 軸 (距離 a = 5)', '#f43f5e');
      drawPoint(ctx, originX, apy, '投影到 Y 軸 (距離 b = 2)', '#38bdf8');
      ctx.restore();
    }
  }

  function drawPoint(ctx, x, y, label, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    const textW = ctx.measureText(label).width;
    ctx.fillRect(x + 9, y - 18, textW + 12, 18);
    ctx.strokeRect(x + 9, y - 18, textW + 12, 18);

    ctx.fillStyle = '#fff';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText(label, x + 15, y - 5);
    ctx.restore();
  }

  window.setGeometryTab = function(tabName) {
    activeTab = tabName;
    document.querySelectorAll('#geoTabs .tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });
    draw();
  };

  resizeCanvas();
}

/* ==========================================================================
   Module 4: Quiz Challenge Engine
   ========================================================================== */

function initQuizSystem() {
  const quizData = [
    {
      q: "二次函數 y = -2x² + 4x + 1 的頂點坐標為何？",
      opts: ["(1, 3)", "(-1, 3)", "(1, -3)", "(2, 1)"],
      ans: 0,
      exp: "對稱軸 x = -b/(2a) = -4/(-4) = 1。將 x=1 代入得 y = -2(1) + 4(1) + 1 = 3，頂點為 (1, 3)。"
    },
    {
      q: "若圓之直徑兩端點為 A(-3, 2) 與 B(0, 6)，則此圓的直徑長是多少？",
      opts: ["4", "5", "√13", "10"],
      ans: 1,
      exp: "直徑 d = √[(0 - (-3))² + (6 - 2)²] = √(9 + 16) = √25 = 5。"
    },
    {
      q: "解不等式 |2x - 5| > 3 的解為？",
      opts: ["1 < x < 4", "x < 1 或 x > 4", "-1 < x < 4", "x < -1 或 x > 4"],
      ans: 1,
      exp: "2x - 5 > 3 ➔ 2x > 8 ➔ x > 4；或 2x - 5 < -3 ➔ 2x < 2 ➔ x < 1。解為 x < 1 或 x > 4。"
    },
    {
      q: "將 f(x) = (x - 3)² - 1 圖形向右平移 2 單位，向下平移 3 單位，平移後的函數為何？",
      opts: ["(x - 5)² - 4", "(x - 1)² + 2", "(x - 5)² + 2", "(x - 1)² - 4"],
      ans: 0,
      exp: "向右平移 2 單位：x ➔ x - 2，變為 (x - 5)²；向下平移 3 單位：常數項 -1 - 3 = -4。平移後為 (x - 5)² - 4。"
    },
    {
      q: "坐標平面上點 A(-2, 5) 到 y 軸的距離為多少？",
      opts: ["5", "2", "-2", "√29"],
      ans: 1,
      exp: "到 y 軸的距離為 x 坐標的絕對值：|-2| = 2。"
    }
  ];

  let currentIdx = 0;
  let score = 0;
  let answered = false;

  const qText = document.getElementById('quizQuestionText');
  const qList = document.getElementById('quizOptionsList');
  const qExp = document.getElementById('quizExplanation');
  const qProgress = document.getElementById('quizProgressFill');
  const qNextBtn = document.getElementById('quizNextBtn');
  const qScoreDisplay = document.getElementById('quizScoreDisplay');

  function renderQuestion() {
    if (currentIdx >= quizData.length) {
      // Completed!
      qText.innerHTML = `<h3 style="color:#10b981;">🎉 測驗完成！</h3><p style="margin-top:0.5rem;">您獲得了 <strong>${score} / ${quizData.length * 20}</strong> 分！</p>`;
      qList.innerHTML = "";
      qExp.style.display = "none";
      qNextBtn.textContent = "重新測驗";
      qNextBtn.onclick = resetQuiz;
      launchConfetti();
      return;
    }

    answered = false;
    const item = quizData[currentIdx];
    qText.textContent = `第 ${currentIdx + 1} 題 / 共 ${quizData.length} 題：${item.q}`;
    qProgress.style.width = `${((currentIdx + 1) / quizData.length) * 100}%`;
    qExp.style.display = "none";
    qNextBtn.style.display = "none";

    qList.innerHTML = "";
    item.opts.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = "quiz-opt-btn";
      btn.innerHTML = `<span style="width:24px; height:24px; border-radius:50%; background:rgba(255,255,255,0.1); display:inline-flex; align-items:center; justify-content:center; font-weight:700;">${String.fromCharCode(65 + idx)}</span> <span>${opt}</span>`;
      btn.onclick = () => selectAnswer(idx);
      qList.appendChild(btn);
    });
  }

  function selectAnswer(choiceIdx) {
    if (answered) return;
    answered = true;
    const item = quizData[currentIdx];
    const buttons = qList.querySelectorAll('.quiz-opt-btn');

    if (choiceIdx === item.ans) {
      buttons[choiceIdx].classList.add('selected-correct');
      score += 20;
      qScoreDisplay.textContent = `得分: ${score}`;
    } else {
      buttons[choiceIdx].classList.add('selected-wrong');
      buttons[item.ans].classList.add('selected-correct');
    }

    qExp.innerHTML = `<strong>解析：</strong>${item.exp}`;
    qExp.style.display = "block";
    qNextBtn.style.display = "inline-flex";
    qNextBtn.textContent = (currentIdx === quizData.length - 1) ? "查看測驗成績" : "下一題 ➔";
    qNextBtn.onclick = () => {
      currentIdx++;
      renderQuestion();
    };
  }

  function resetQuiz() {
    currentIdx = 0;
    score = 0;
    qScoreDisplay.textContent = `得分: 0`;
    renderQuestion();
  }

  renderQuestion();
}

/* Confetti celebration */
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#06b6d4', '#6366f1', '#10b981', '#f59e0b', '#ec4899', '#a855f7'];

  for (let i = 0; i < 120; i++) {
    particles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.8) * 18,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeCount = 0;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.4; // gravity
      p.rotation += p.vRot;
      p.alpha -= 0.008;

      if (p.alpha > 0) {
        activeCount++;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (activeCount > 0) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  animate();
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

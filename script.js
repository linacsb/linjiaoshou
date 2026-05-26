/* ============================================================
   个人信息展示网页 - 交互逻辑
   包含：粒子背景、打字效果、滚动动画、主题切换等
   ============================================================ */

// ==================== 页面加载动画 ====================
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 600);
});

// ==================== 技能数据配置 ====================
// 【修改点】在此处增删/修改技能数据
const skillsData = [
    { name: 'HTML5 / CSS3',   percent: 95, category: 'frontend', icon: 'fab fa-html5' },
    { name: 'JavaScript',     percent: 92, category: 'frontend', icon: 'fab fa-js-square' },
    { name: 'React / Next.js',percent: 90, category: 'frontend', icon: 'fab fa-react' },
    { name: 'Vue.js / Nuxt',  percent: 85, category: 'frontend', icon: 'fab fa-vuejs' },
    { name: 'TypeScript',     percent: 88, category: 'frontend', icon: 'fas fa-code' },
    { name: 'Tailwind CSS',   percent: 90, category: 'frontend', icon: 'fas fa-wind' },
    { name: 'Node.js',        percent: 85, category: 'backend',  icon: 'fab fa-node-js' },
    { name: 'Python / Django',percent: 75, category: 'backend',  icon: 'fab fa-python' },
    { name: 'MySQL / PostgreSQL', percent: 80, category: 'backend', icon: 'fas fa-database' },
    { name: 'MongoDB / Redis',percent: 72, category: 'backend',  icon: 'fas fa-server' },
    { name: 'GraphQL / REST', percent: 82, category: 'backend',  icon: 'fas fa-project-diagram' },
    { name: 'Figma / Sketch', percent: 78, category: 'design',   icon: 'fab fa-figma' },
    { name: 'Adobe PS / AI',  percent: 70, category: 'design',   icon: 'fas fa-paint-brush' },
    { name: 'Docker / K8s',   percent: 72, category: 'devops',   icon: 'fab fa-docker' },
    { name: 'AWS / Cloud',    percent: 68, category: 'devops',   icon: 'fas fa-cloud' },
    { name: 'CI/CD / Git',    percent: 85, category: 'devops',   icon: 'fab fa-git-alt' },
];

// ==================== 渲染技能卡片 ====================
function renderSkills(filter = 'all') {
    const grid = document.getElementById('skillsGrid');
    const filtered = filter === 'all'
        ? skillsData
        : skillsData.filter(s => s.category === filter);

    grid.innerHTML = filtered.map(skill => `
        <div class="skill-card" data-category="${skill.category}">
            <div class="skill-card-header">
                <div class="skill-icon-box ${skill.category}">
                    <i class="${skill.icon}"></i>
                </div>
                <div>
                    <div class="skill-name">${skill.name}</div>
                    <div class="skill-category-badge">${getCategoryLabel(skill.category)}</div>
                </div>
            </div>
            <div class="skill-bar-wrapper">
                <div class="skill-bar" data-percent="${skill.percent}"></div>
            </div>
            <div class="skill-percent">
                <span>熟练度</span>
                <span class="skill-percent-value">0%</span>
            </div>
        </div>
    `).join('');
}

function getCategoryLabel(cat) {
    const map = { frontend: '前端', backend: '后端', design: '设计', devops: 'DevOps' };
    return map[cat] || cat;
}

// 初始渲染
renderSkills();

// ==================== 技能分类筛选 ====================
document.querySelectorAll('.skill-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.skill-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderSkills(tab.dataset.category);
    });
});

// ==================== 打字机效果 ====================
function initTypingEffect() {
    const titles = [
        '全栈开发工程师',
        '前端架构师',
        '开源贡献者',
        '技术博客作者',
        '终身学习者',
    ];
    const el = document.getElementById('typingText');
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 120;

    function type() {
        const current = titles[titleIndex];

        if (isDeleting) {
            el.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 60;
        } else {
            el.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 120;
        }

        if (!isDeleting && charIndex === current.length) {
            // 打完，停顿后开始删除
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // 删完，切换下一个
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typeSpeed = 400;
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1000);
}

initTypingEffect();

// ==================== 粒子背景 ====================
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;

    function resize() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.6;
            this.speedY = (Math.random() - 0.5) * 0.6;
            this.opacity = Math.random() * 0.6 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width ||
                this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            // 根据当前主题使用不同颜色
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            ctx.fillStyle = isDark
                ? `rgba(108, 99, 255, ${this.opacity})`
                : `rgba(59, 130, 246, ${this.opacity})`;
            ctx.fill();
        }
    }

    // 初始化粒子
    const particleCount = Math.min(80, Math.floor(canvas.width / 15));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // 连线
    function drawLines() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = isDark
                        ? `rgba(108, 99, 255, ${0.08 * (1 - dist / 120)})`
                        : `rgba(59, 130, 246, ${0.1 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawLines();
        animFrame = requestAnimationFrame(animate);
    }

    animate();
}

initParticles();

// ==================== 导航栏滚动效果 ====================
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // 导航栏毛玻璃效果
    if (scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // 返回顶部按钮
    if (scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

// 返回顶部
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ==================== 移动端菜单 ====================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// 点击菜单项后关闭
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ==================== 导航高亮 (IntersectionObserver) ====================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        }
    });
}, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });

sections.forEach(section => sectionObserver.observe(section));

// ==================== 滚动显示动画 (IntersectionObserver) ====================
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // 技能条动画（当技能区域进入视口）
            const skillBars = entry.target.querySelectorAll('.skill-bar');
            skillBars.forEach(bar => {
                const percent = bar.dataset.percent;
                if (percent) {
                    setTimeout(() => {
                        bar.style.width = percent + '%';
                        // 更新百分比数字
                        const percentEl = bar.closest('.skill-card').querySelector('.skill-percent-value');
                        if (percentEl) animateNumber(percentEl, 0, parseInt(percent), 1500);
                    }, 200);
                }
            });

            // 统计数字动画
            const statNumbers = entry.target.querySelectorAll('.stat-number[data-count]');
            statNumbers.forEach(el => {
                const target = parseInt(el.dataset.count);
                animateNumber(el, 0, target, 2000);
            });
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ==================== 数字递增动画 ====================
function animateNumber(el, start, end, duration) {
    const startTime = performance.now();

    function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutQuart
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (end - start) * eased);

        if (el.classList.contains('skill-percent-value')) {
            el.textContent = current + '%';
        } else {
            el.textContent = current + (el.dataset.suffix || '');
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ==================== 主题切换 ====================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// 从 localStorage 读取保存的主题
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// ==================== 联系表单处理 ====================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('formName').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    const message = document.getElementById('formMessage').value.trim();

    if (!name || !email || !message) {
        showToast('请填写所有必填字段', 'error');
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('请输入有效的邮箱地址', 'error');
        return;
    }

    // 模拟发送
    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发送中...';
    submitBtn.disabled = true;

    setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> 发送成功!';
        submitBtn.classList.add('success');
        showToast('消息发送成功！我会尽快回复您。', 'success');
        contactForm.reset();

        // 恢复按钮
        setTimeout(() => {
            submitBtn.innerHTML = originalHTML;
            submitBtn.classList.remove('success');
            submitBtn.disabled = false;
        }, 3000);
    }, 1500);
});

// ==================== Toast 消息提示 ====================
function showToast(msg, type) {
    // 移除已有 toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    if (type === 'error') {
        toast.style.background = '#EF4444';
        toast.style.boxShadow = '0 8px 30px rgba(239, 68, 68, 0.35)';
    }
    toast.textContent = msg;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3200);
}

// ==================== 平滑滚动到锚点 (防止浏览器URL hash) ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

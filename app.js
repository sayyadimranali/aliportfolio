/* =========================================================
   DevOps Animated Portfolio (Vanilla JS)
   - SPA-style navigation via hash routing
   - Animated transitions via a lightweight page-wipe overlay
   - Scroll reveal via IntersectionObserver
   - Project filtering + search
   - Blog list + article view with transitions
   - Contact form validation + mailto submit (no backend)
   - Honors prefers-reduced-motion + manual motion toggle
   ========================================================= */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const state = {
  filter: "all",
  query: "",
  motion: "auto", // "auto" | "on" | "off"
  currentBlogId: null
};

const data = {
  projects: [
    {
      id: "p1",
      category: ["cicd", "obs"],
      title: "Secure CI/CD Pipeline with Progressive Delivery",
      description:
        "A production-grade pipeline that builds, tests, scans, and deploys using canary releases with automated rollback. Designed to reduce lead time while improving release safety.",
      outcomes: [
        "Reduced deployment time by ~62% by optimizing caching, parallel jobs, and artifact reuse",
        "Added SAST + container scanning gates, blocking critical issues before deploy",
        "Canary rollout with automated rollback based on error budget signals"
      ],
      tech: ["GitHub Actions", "Docker", "Trivy", "OpenTelemetry", "Argo Rollouts", "Kubernetes"],
      repo: "https://github.com/your-username/secure-cicd-progressive-delivery",
      live: "https://your-live-demo.example.com",
      image: "assets/project-cicd.svg",
      video: "" // optional: "assets/demo-monitoring.mp4"
    },
    {
      id: "p2",
      category: ["iac"],
      title: "Terraform Landing Zone + Reusable Modules",
      description:
        "A modular Infrastructure-as-Code foundation for multi-environment cloud provisioning with policy guardrails, standardized networking, and secure defaults.",
      outcomes: [
        "Standardized VPC/VNet, IAM/RBAC, and logging across environments",
        "Introduced policy-as-code checks to prevent misconfigurations",
        "Reduced drift using remote state + plan/apply workflows"
      ],
      tech: ["Terraform", "Terragrunt", "OPA/Conftest", "GitOps", "Cloud IAM", "Vault (optional)"],
      repo: "https://github.com/your-username/terraform-landing-zone",
      live: "",
      image: "assets/project-iac.svg",
      video: ""
    },
    {
      id: "p3",
      category: ["k8s", "obs"],
      title: "Kubernetes Platform + Full-Stack Observability",
      description:
        "A Kubernetes platform setup with GitOps, service-level dashboards, logs, traces, alerts, and SLO-driven incident response workflows.",
      outcomes: [
        "Implemented GitOps (desired state) for safer cluster changes and auditability",
        "Built SLO dashboards + alerting to reduce noise and speed incident triage",
        "Unified logs/traces/metrics for faster root-cause analysis"
      ],
      tech: ["Kubernetes", "Argo CD", "Helm", "Prometheus", "Grafana", "Loki", "OpenTelemetry"],
      repo: "https://github.com/your-username/k8s-observability-platform",
      live: "",
      image: "assets/project-k8s.svg",
      video: "" // you can add a demo video file path here
    }
  ],

  blogPosts: [
    {
      id: "b1",
      title: "Modern CI/CD: From “Pipeline” to Delivery System",
      date: "2025-12-01",
      readTime: "8 min",
      tags: ["CI/CD", "Progressive Delivery", "Security"],
      excerpt:
        "CI/CD isn’t just a YAML file — it’s a delivery system with feedback loops. Here’s how to design pipelines that are fast, safe, and resilient.",
      contentHtml: `
        <p>
          Teams often treat CI/CD as “the pipeline file.” In practice, reliable delivery is a <strong>system</strong>:
          source control, build strategy, test pyramid, artifact promotion, security gates, deployment strategy,
          observability, and incident response all work together.
        </p>

        <h3>1) Design for feedback, not for ceremony</h3>
        <p>
          A great pipeline minimizes time-to-signal:
          run cheap checks early (lint/unit), parallelize integration tests, and use build caching.
          Favor small batch sizes — smaller changes reduce risk and speed debugging.
        </p>

        <h3>2) Security gates should be fast and intentional</h3>
        <ul>
          <li><strong>SAST</strong> for common coding flaws, tuned to reduce false positives.</li>
          <li><strong>Dependency and container scanning</strong> for critical CVEs with an allowlist process.</li>
          <li><strong>IaC checks</strong> to block risky cloud misconfigurations before provisioning.</li>
        </ul>

        <h3>3) Prefer progressive delivery in production</h3>
        <p>
          Blue/green and canary are not “extra.” They’re the mechanism for safe change.
          Wire automated rollback to error budgets or golden signals (latency, errors, saturation, traffic).
        </p>

        <h3>References</h3>
        <ul>
          <li><a href="https://sre.google/books/" target="_blank" rel="noreferrer">Google SRE Books (free online)</a></li>
          <li><a href="https://opentelemetry.io/" target="_blank" rel="noreferrer">OpenTelemetry</a></li>
          <li><a href="https://martinfowler.com/articles/continuousDelivery.html" target="_blank" rel="noreferrer">Continuous Delivery (Martin Fowler)</a></li>
        </ul>
      `
    },
    {
      id: "b2",
      title: "Infrastructure as Code at Scale: Modules, Guardrails, and Drift",
      date: "2025-11-14",
      readTime: "10 min",
      tags: ["Terraform", "IaC", "Governance"],
      excerpt:
        "IaC becomes powerful when it’s standardized and safe. This post covers module design, policy guardrails, and practical drift control.",
      contentHtml: `
        <p>
          Infrastructure as Code fails when it becomes a pile of copy-pasted stacks. The fix is <strong>reusable modules</strong>,
          consistent patterns, and guardrails that scale with the organization.
        </p>

        <h3>1) Reusable modules & versioning</h3>
        <p>
          Treat modules like software: semantic versioning, changelogs, tests, and a clear input/output contract.
          Keep modules opinionated (secure defaults) but configurable.
        </p>

        <h3>2) Guardrails before provisioning</h3>
        <p>
          Policy-as-code can prevent the classics: open security groups, public storage, missing encryption, and over-privileged roles.
          Build exception handling so teams can move quickly with accountability.
        </p>

        <h3>3) Drift: detect it, don’t fear it</h3>
        <ul>
          <li>Run scheduled plans for drift visibility.</li>
          <li>Use remote state with locking to reduce contention.</li>
          <li>Adopt GitOps for “desired state” workflows where possible.</li>
        </ul>

        <h3>References</h3>
        <ul>
          <li><a href="https://developer.hashicorp.com/terraform" target="_blank" rel="noreferrer">Terraform Documentation</a></li>
          <li><a href="https://www.openpolicyagent.org/" target="_blank" rel="noreferrer">Open Policy Agent</a></li>
          <li><a href="https://cloud.google.com/architecture/framework" target="_blank" rel="noreferrer">Google Cloud Architecture Framework</a></li>
        </ul>
      `
    },
    {
      id: "b3",
      title: "Observability That Actually Helps During Incidents",
      date: "2025-10-20",
      readTime: "9 min",
      tags: ["Observability", "SLO", "Incident Response"],
      excerpt:
        "Dashboards don’t prevent outages — feedback loops do. Learn how to use SLOs, golden signals, and tracing to cut MTTR.",
      contentHtml: `
        <p>
          The goal of observability is not “more charts.” It’s <strong>faster understanding</strong> under pressure:
          what changed, what broke, how users are impacted, and what to do next.
        </p>

        <h3>1) Start with SLOs and error budgets</h3>
        <p>
          If everything is critical, nothing is. SLOs define reliability targets, and error budgets let you balance speed and safety.
          Alert on symptoms (user impact), not on every low-level metric.
        </p>

        <h3>2) Golden signals + correlation</h3>
        <ul>
          <li><strong>Latency</strong>: p95/p99 trends over time</li>
          <li><strong>Traffic</strong>: request rates, saturation, queue depth</li>
          <li><strong>Errors</strong>: failure ratios, exception spikes</li>
          <li><strong>Saturation</strong>: CPU/memory, DB connections, throttling</li>
        </ul>

        <h3>3) Tracing reduces guesswork</h3>
        <p>
          Distributed traces answer: “Where is time being spent?” Combine traces with logs and metrics to move from detection to diagnosis quickly.
        </p>

        <h3>References</h3>
        <ul>
          <li><a href="https://grafana.com/docs/" target="_blank" rel="noreferrer">Grafana Docs</a></li>
          <li><a href="https://prometheus.io/docs/introduction/overview/" target="_blank" rel="noreferrer">Prometheus Overview</a></li>
          <li><a href="https://sre.google/workbook/alerting-on-slos/" target="_blank" rel="noreferrer">Alerting on SLOs (Google SRE Workbook)</a></li>
        </ul>
      `
    }
  ]
};

// ---------- Motion handling ----------
function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function isMotionEnabled() {
  if (state.motion === "on") return true;
  if (state.motion === "off") return false;
  return !prefersReducedMotion();
}
function setMotionLabel() {
  $("#motionState").textContent = state.motion === "auto" ? "Auto" : (state.motion === "on" ? "On" : "Off");
}

// ---------- Page transitions ----------
const wipe = $("#pageWipe");
async function transitionWipe(fn) {
  // This overlay transition is intentionally quick to keep UX snappy.
  if (!isMotionEnabled()) {
    fn?.();
    return;
  }
  wipe.classList.add("is-active");
  await sleep(140);
  fn?.();
  await sleep(140);
  wipe.classList.remove("is-active");
}
function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

// ---------- Scroll progress ----------
function updateScrollProgress(){
  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop;
  const scrollHeight = (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;
  const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  $("#scrollProgressBar").style.width = `${pct}%`;
}

// ---------- Mobile nav ----------
const navToggle = $("#navToggle");
const navMenu = $("#navMenu");

function closeMobileNav(){
  navMenu.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}
navToggle.addEventListener("click", () => {
  const open = navMenu.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
});

// Close mobile nav on outside click
document.addEventListener("click", (e) => {
  if (!navMenu.classList.contains("is-open")) return;
  const isClickInside = navMenu.contains(e.target) || navToggle.contains(e.target);
  if (!isClickInside) closeMobileNav();
});

// ---------- Reveal animations ----------
function initReveal(){
  const items = $$(".reveal");
  // If motion disabled, show everything immediately
  if (!isMotionEnabled()) {
    items.forEach(el => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12 });

  items.forEach(el => io.observe(el));
}

// ---------- Routing ----------
function scrollToHash(hash){
  const id = (hash || "#home").replace("#", "");
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: isMotionEnabled() ? "smooth" : "auto", block: "start" });
}

function handleRoute(){
  // Blog post route: #blog?post=b1
  const hash = window.location.hash || "#home";
  const [base, query] = hash.split("?");
  const params = new URLSearchParams(query || "");
  const postId = params.get("post");

  if (base === "#blog" && postId) {
    state.currentBlogId = postId;
    renderBlog();
    scrollToHash("#blog");
    return;
  }

  state.currentBlogId = null;
  renderBlog(); // ensures blog list view by default
  scrollToHash(base);
}

// Link clicks: animate wipe then route
document.addEventListener("click", async (e) => {
  const a = e.target.closest("a[data-route]");
  if (!a) return;
  const href = a.getAttribute("href");
  if (!href || !href.startsWith("#")) return;

  e.preventDefault();
  closeMobileNav();

  await transitionWipe(() => {
    window.location.hash = href;
  });
});

// Allow ESC to go back from blog post view
document.addEventListener("keydown", async (e) => {
  if (e.key === "Escape" && state.currentBlogId) {
    await transitionWipe(() => {
      window.location.hash = "#blog";
    });
  }
});

// ---------- Projects ----------
const projectGrid = $("#projectGrid");
const projectSearch = $("#projectSearch");

function matchesProject(p){
  const q = state.query.trim().toLowerCase();
  const inFilter = state.filter === "all" ? true : p.category.includes(state.filter);
  if (!q) return inFilter;

  const hay = [
    p.title, p.description,
    ...p.tech, ...(p.outcomes || [])
  ].join(" ").toLowerCase();

  return inFilter && hay.includes(q);
}

function renderProjects(){
  const items = data.projects.filter(matchesProject);

  projectGrid.innerHTML = items.map(p => `
    <article class="card project" data-project-id="${p.id}" tabindex="0" aria-label="Open project ${escapeHtml(p.title)}">
      <div class="project__thumb" aria-hidden="true">
        <img loading="lazy" src="${p.image}" alt="" />
      </div>
      <h3 class="project__title">${escapeHtml(p.title)}</h3>
      <p class="project__desc">${escapeHtml(p.description)}</p>
      <div class="pills" aria-label="Technologies used">
        ${p.tech.slice(0,6).map(t => `<span class="pillTag">${escapeHtml(t)}</span>`).join("")}
      </div>
    </article>
  `).join("") || `<p class="card">No projects found. Try another filter or search query.</p>`;
}

function initProjectFilters(){
  $$(".chip").forEach(btn => {
    btn.addEventListener("click", async () => {
      $$(".chip").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      state.filter = btn.dataset.filter;

      await transitionWipe(() => renderProjects());
    });
  });

  projectSearch.addEventListener("input", () => {
    state.query = projectSearch.value || "";
    renderProjects();
  });
}

// ---------- Project Modal ----------
const modal = $("#projectModal");
const modalContent = $("#modalContent");

function openModal(project){
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  modalContent.innerHTML = `
    <div class="modalContent">
      <div class="modalMedia">
        ${
          project.video
          ? `<video controls preload="metadata" poster="assets/poster-monitoring.svg">
               <source src="${project.video}" type="video/mp4" />
               Your browser does not support the video tag.
             </video>`
          : `<img src="${project.image}" alt="${escapeHtml(project.title)} screenshot" />`
        }
      </div>

      <div class="modalBody">
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.description)}</p>

        <h4>Key outcomes</h4>
        <ul>
          ${(project.outcomes || []).map(x => `<li>${escapeHtml(x)}</li>`).join("")}
        </ul>

        <h4>Technologies</h4>
        <div class="pills">
          ${project.tech.map(t => `<span class="pillTag">${escapeHtml(t)}</span>`).join("")}
        </div>

        <div class="linksRow">
          ${project.repo ? `<a class="btn btn--primary" href="${project.repo}" target="_blank" rel="noreferrer">Repository ↗</a>` : ""}
          ${project.live ? `<a class="btn" href="${project.live}" target="_blank" rel="noreferrer">Live Demo ↗</a>` : ""}
        </div>

        <p class="postMeta" style="margin-top:12px;">
          Tip: replace SVG placeholders in <code>/assets</code> with real screenshots for a stronger employer impact.
        </p>
      </div>
    </div>
  `;

  // Modal open animation (Web Animations API)
  if (isMotionEnabled()) {
    const panel = $(".modal__panel", modal);
    panel.animate(
      [
        { transform: "translate(-50%,-50%) scale(0.98)", opacity: 0 },
        { transform: "translate(-50%,-50%) scale(1)", opacity: 1 }
      ],
      { duration: 220, easing: "cubic-bezier(.2,.8,.2,1)" }
    );
  }
}

function closeModal(){
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function initModal(){
  modal.addEventListener("click", (e) => {
    if (e.target.matches("[data-close-modal]")) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });

  // Click project card
  projectGrid.addEventListener("click", (e) => {
    const card = e.target.closest("[data-project-id]");
    if (!card) return;
    const p = data.projects.find(x => x.id === card.dataset.projectId);
    if (p) openModal(p);
  });

  // Keyboard: Enter/Space
  projectGrid.addEventListener("keydown", (e) => {
    const card = e.target.closest("[data-project-id]");
    if (!card) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const p = data.projects.find(x => x.id === card.dataset.projectId);
      if (p) openModal(p);
    }
  });

  $("[data-close-modal]")?.addEventListener("click", closeModal);
  $$(".modal__close").forEach(btn => btn.addEventListener("click", closeModal));
}

// ---------- Blog ----------
const blogView = $("#blogView");

function renderBlog(){
  if (!state.currentBlogId) {
    // List view
    const posts = [...data.blogPosts].sort((a,b) => (a.date < b.date ? 1 : -1));
    const tags = Array.from(new Set(posts.flatMap(p => p.tags))).sort();

    blogView.innerHTML = `
      <div class="blogList">
        <div class="card">
          <h3 style="margin:0 0 10px 0;">Latest articles</h3>
          <div style="display:grid;gap:12px;">
            ${posts.map(p => `
              <article class="card postCard" style="padding:14px;">
                <div class="postMeta">${formatDate(p.date)} • ${p.readTime}</div>
                <h3>${escapeHtml(p.title)}</h3>
                <p class="postExcerpt">${escapeHtml(p.excerpt)}</p>
                <div class="tagCloud" aria-label="Post tags">
                  ${p.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
                </div>
                <div style="display:flex; gap:10px; flex-wrap:wrap;">
                  <a class="btn btn--primary" data-blog-open href="#blog?post=${encodeURIComponent(p.id)}">Read</a>
                  <a class="btn" data-route href="#contact">Discuss</a>
                </div>
              </article>
            `).join("")}
          </div>
        </div>

        <aside class="postAside">
          <div class="card">
            <h3 style="margin:0 0 10px 0;">Topics</h3>
            <div class="tagCloud">
              ${tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
            </div>
            <p class="postMeta" style="margin-top:10px;">
              Tip: write about trade-offs you made, metrics you improved, and incident learnings.
            </p>
          </div>

          <div class="card">
            <h3 style="margin:0 0 10px 0;">How I write</h3>
            <p class="postExcerpt">
              Short, practical, and measurable: “what changed”, “why”, “how”, and “what I’d do differently.”
            </p>
            <p class="postMeta">Shortcut: press <kbd>Esc</kbd> to go back from a post.</p>
          </div>
        </aside>
      </div>
    `;

    // Blog open links (animated transition)
    $$("a[data-blog-open]", blogView).forEach(a => {
      a.addEventListener("click", async (e) => {
        e.preventDefault();
        const href = a.getAttribute("href");
        await transitionWipe(() => (window.location.hash = href));
      });
    });

    return;
  }

  // Article view
  const post = data.blogPosts.find(p => p.id === state.currentBlogId);
  if (!post) {
    blogView.innerHTML = `<div class="card">Post not found. <a data-route href="#blog">Back to blog</a></div>`;
    return;
  }

  blogView.innerHTML = `
    <article class="card article">
      <div class="backRow">
        <a class="btn" id="backToBlog" href="#blog">← Back</a>
        <div class="postMeta">${formatDate(post.date)} • ${post.readTime}</div>
      </div>
      <h2>${escapeHtml(post.title)}</h2>
      <div class="tagCloud" aria-label="Post tags" style="margin: 10px 0 14px;">
        ${post.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
      </div>
      <div>${post.contentHtml}</div>
    </article>
  `;

  $("#backToBlog")?.addEventListener("click", async (e) => {
    e.preventDefault();
    await transitionWipe(() => (window.location.hash = "#blog"));
  });

  // Animate article in
  if (isMotionEnabled()) {
    blogView.animate(
      [
        { opacity: 0, transform: "translateY(8px)" },
        { opacity: 1, transform: "translateY(0)" }
      ],
      { duration: 260, easing: "cubic-bezier(.2,.8,.2,1)" }
    );
  }
}

// ---------- Contact form ----------
function validateField(input){
  const name = input.name;
  const val = (input.value || "").trim();
  let error = "";

  if (input.required && !val) error = "This field is required.";
  if (!error && input.minLength > 0 && val.length < input.minLength) {
    error = `Please enter at least ${input.minLength} characters.`;
  }
  if (!error && name === "email") {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    if (!ok) error = "Please enter a valid email address.";
  }

  const errorEl = $(`[data-error-for="${CSS.escape(name)}"]`);
  if (errorEl) errorEl.textContent = error;

  input.setAttribute("aria-invalid", error ? "true" : "false");
  return !error;
}

function initContact(){
  const form = $("#contactForm");
  const toast = $("#toast");

  const inputs = $$("input, textarea", form);
  inputs.forEach(i => i.addEventListener("blur", () => validateField(i)));

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const ok = inputs.map(validateField).every(Boolean);
    if (!ok) {
      toast.textContent = "Please fix the highlighted fields.";
      return;
    }

    const name = $("#name").value.trim();
    const email = $("#email").value.trim();
    const subject = $("#subject").value.trim();
    const message = $("#message").value.trim();

    // No backend: build a mailto link. Replace destination email here:
    const to = "your.email@example.com";
    const body =
`Name: ${name}
Email: ${email}

Message:
${message}

---
Sent from DevOps Portfolio Contact Form`;

    const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    toast.textContent = "Opening your email client…";
    window.location.href = mailto;
  });
}

// ---------- Motion toggle ----------
function initMotionToggle(){
  setMotionLabel();
  $("#motionToggle").addEventListener("click", async () => {
    // Cycle: auto -> on -> off -> auto
    state.motion = state.motion === "auto" ? "on" : (state.motion === "on" ? "off" : "auto");
    setMotionLabel();

    await transitionWipe(() => {
      // Re-init reveal to reflect motion preference
      $$(".reveal").forEach(el => el.classList.remove("is-visible"));
      initReveal();
    });
  });
}

// ---------- Utils ----------
function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[m]));
}
function formatDate(iso){
  // ISO YYYY-MM-DD -> readable
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

// ---------- Init ----------
function init(){
  $("#year").textContent = new Date().getFullYear();

  // Render content
  renderProjects();
  renderBlog();

  // Features
  initProjectFilters();
  initModal();
  initContact();
  initReveal();
  initMotionToggle();

  // Routing
  window.addEventListener("hashchange", handleRoute);
  handleRoute();

  // Scroll progress
  updateScrollProgress();
  window.addEventListener("scroll", updateScrollProgress, { passive: true });

  // Accessibility: focus main after navigation
  window.addEventListener("hashchange", () => $("#app").focus());

  // Close mobile nav if resizing to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 640) closeMobileNav();
  });
}

init();

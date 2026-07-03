/* ==========================================================================
   老小孩 · leige 个人主页交互脚本
   ========================================================================== */
(function () {
    "use strict";

    /* ---------- 导航栏滚动效果 ---------- */
    var navbar = document.getElementById("navbar");
    var backToTop = document.getElementById("backToTop");

    function onScroll() {
        var y = window.scrollY || document.documentElement.scrollTop;
        if (navbar) navbar.classList.toggle("scrolled", y > 20);
        if (backToTop) backToTop.classList.toggle("show", y > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---------- 移动端菜单切换 ---------- */
    var navToggle = document.getElementById("navToggle");
    var navLinks = document.querySelector(".nav-links");

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", function () {
            var isOpen = navLinks.classList.toggle("open");
            navToggle.classList.toggle("open", isOpen);
            navToggle.setAttribute("aria-expanded", String(isOpen));
        });
        // 点击链接后自动收起
        navLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navLinks.classList.remove("open");
                navToggle.classList.remove("open");
                navToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    /* ---------- 回到顶部 ---------- */
    if (backToTop) {
        backToTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    /* ---------- 滚动出现动画 (IntersectionObserver) ---------- */
    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && revealEls.length) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

        revealEls.forEach(function (el, i) {
            // 错开延迟，让出现更有节奏
            el.style.transitionDelay = (i % 4) * 0.08 + "s";
            io.observe(el);
        });
    } else {
        // 回退：直接全部显示
        revealEls.forEach(function (el) { el.classList.add("visible"); });
    }

    /* ---------- 页脚年份 ---------- */
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    /* ---------- 规律演示小彩蛋：点击 ? 给提示 ---------- */
    document.querySelectorAll(".pd-q, .pattern-demo .pd-q").forEach(function (q) {
        q.style.cursor = "pointer";
        q.addEventListener("click", function () {
            var original = q.textContent;
            if (original === "?") {
                // 根据相邻元素推断答案
                var parent = q.parentElement;
                var items = parent.querySelectorAll(".pd-item, .pd-dot");
                if (items.length >= 2) {
                    var last = items[items.length - 2];
                    // 数字序列：+2 递增
                    var n = parseInt(last.textContent, 10);
                    if (!isNaN(n)) {
                        q.textContent = String(n + 2);
                    } else {
                        // 颜色交替
                        var isRed = last.classList.contains("pd-red");
                        q.textContent = isRed ? "蓝" : "红";
                    }
                }
                setTimeout(function () { q.textContent = original; }, 1400);
            }
        });
    });
})();

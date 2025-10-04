let lastScrollTop = 0;
let autoScrolling = false;

// Скрытие/показ навигации при скролле
window.addEventListener("scroll", () => {
  if (autoScrolling) return;

  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  if (currentScroll > lastScrollTop) {
    nav.classList.add("hide");
  } else {
    nav.classList.remove("hide");
  }
  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

// Аккордеоны
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".accordion-header");

  buttons.forEach(button => {
    const textSpan = button.querySelector(".fancy-font");
    const content = button.nextElementSibling;

    button.addEventListener("click", () => {
      const isOpen = content.classList.contains("active");

      // Закрываем все вкладки
      document.querySelectorAll(".accordion-content").forEach(c => {
        c.classList.remove("active");
        c.style.maxHeight = null;
      });

      // Убираем подсветку с заголовков
      document.querySelectorAll(".accordion-header .fancy-font").forEach(span => {
        span.classList.remove("highlight");
      });

      // Если текущий был закрыт или был открыт скриптом
      if (!isOpen || button.getAttribute("data-opened-by-script") === "true") {
        content.classList.add("active");
        content.style.maxHeight = content.scrollHeight + "px";
        textSpan?.classList.add("highlight");
      }

      button.removeAttribute("data-opened-by-script");

      // Плавный скролл
      autoScrolling = true;
      setTimeout(() => {
        window.scrollTo({
          top: button.offsetTop - 100,
          behavior: "smooth"
        });
        setTimeout(() => autoScrolling = false, 800);
      }, 100);
    });

    // Закрытие контента по клику
    content.addEventListener("click", () => {
      content.classList.remove("active");
      content.style.maxHeight = null;
      textSpan?.classList.remove("highlight");
      button.removeAttribute("data-opened-by-script");
    });
  });

  // ====== Поиск и открытие аккордеона по anchor/highlight ======
  const params = new URLSearchParams(window.location.search);
  const highlight = params.get("highlight");
  const anchor = params.get("anchor");

  if (!highlight) return;

  const accordionSel = ".accordion, .accordion-item, .acc, .faq-item, .accordion-block, .collapse";
  const headerSel = "button, .accordion-header, .acc-header, h1, h2, h3, .title, .heading";
  const contentSel = ".accordion-content, .content, .panel, .acc-body, .body, div";

  function escRE(s){ return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }
  const re = new RegExp(escRE(highlight), "gi");

  function highlightInElement(el) {
    if (!el) return false;
    try {
      const html = el.innerHTML;
      const newHtml = html.replace(re, match => `<mark>${match}</mark>`);
      if (newHtml !== html) {
        el.innerHTML = newHtml;
        return true;
      }
    } catch (e) {}
    return false;
  }

  function openAccordion(acc, header) {
    if (!acc) return;
    const content = acc.querySelector(contentSel);
    if (!content) return;

    // Закрываем все
    document.querySelectorAll(".accordion-content").forEach(c => {
      c.classList.remove("active");
      c.style.maxHeight = null;
    });
    document.querySelectorAll(".accordion-header .fancy-font").forEach(span => {
      span.classList.remove("highlight");
    });

    // Открываем нужный
    content.classList.add("active");
    content.style.maxHeight = content.scrollHeight + "px";

    if (header) {
      header.querySelector(".fancy-font")?.classList.add("highlight");
      header.setAttribute("data-opened-by-script", "true");
      header.setAttribute("aria-expanded", "true");
    }

    // Скроллим к аккордеону
    autoScrolling = true;
    setTimeout(() => {
      content.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => autoScrolling = false, 500);
    }, 100);
  }

  function openAccordionByHeaderText(headerText) {
    const accs = document.querySelectorAll(accordionSel);
    for (const acc of accs) {
      const header = acc.querySelector(headerSel);
      if (header && header.textContent.toLowerCase().includes(headerText.toLowerCase())) {
        openAccordion(acc, header);
        return acc;
      }
    }
    const heads = document.querySelectorAll(headerSel);
    for (const h of heads) {
      if (h.textContent.toLowerCase().includes(headerText.toLowerCase())) {
        const acc = h.closest(accordionSel) || h.parentElement;
        openAccordion(acc, h);
        return acc;
      }
    }
    return null;
  }

  (function main() {
    let targetAcc = null;

    if (anchor) {
      targetAcc = openAccordionByHeaderText(anchor);
      if (targetAcc) {
        const content = targetAcc.querySelector(contentSel) || targetAcc;
        highlightInElement(content);
        return;
      }
    }

    const contentCandidates = document.querySelectorAll(contentSel + ", p, li, div");
    for (const cand of contentCandidates) {
      if ((cand.innerText || "").toLowerCase().includes(highlight.toLowerCase())) {
        const acc = cand.closest(accordionSel);
        if (acc) {
          const header = acc.querySelector(headerSel);
          openAccordion(acc, header);
        }
        if (highlightInElement(cand)) {
          const mark = cand.querySelector("mark");
          if (mark) mark.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }
    }
  })();

});






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

// Аккордеон
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".accordion-header");

  buttons.forEach(button => {
    const textSpan = button.querySelector(".fancy-font");

    button.addEventListener("click", () => {
      const content = button.nextElementSibling;
      const isOpen = content.classList.contains("active");

      // Закрыть все вкладки
      document.querySelectorAll(".accordion-content").forEach(c => {
        c.classList.remove("active");
        c.style.maxHeight = null;
      });

      // Удалить жёлтый цвет со всех заголовков
      document.querySelectorAll(".accordion-header .fancy-font").forEach(span => {
        span.classList.remove("highlight");
      });

      if (!isOpen) {
        content.classList.add("active");
        content.style.maxHeight = content.scrollHeight + "px";

        textSpan.classList.add("highlight"); // Жёлтый цвет

        autoScrolling = true;

        setTimeout(() => {
          window.scrollTo({
            top: button.offsetTop - 100,
            behavior: "smooth"
          });

          setTimeout(() => {
            autoScrolling = false;
          }, 800);
        }, 300);
      }
    });

    // Закрытие по клику на контент
    const content = button.nextElementSibling;
    content.addEventListener("click", () => {
      content.classList.remove("active");
      content.style.maxHeight = null;
      textSpan.classList.remove("highlight"); // Убрать жёлтый цвет
    });
  });

});
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const highlight = params.get("highlight");
  const anchor = params.get("anchor");

  if (!highlight) return;

  // экранирование для RegExp
  function escRE(s){ return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }
  const re = new RegExp(escRE(highlight), "gi");

  // возможные селекторы аккордеонов / заголовков / содержимого
  const accordionSel = ".accordion, .accordion-item, .acc, .faq-item, .accordion-block, .collapse";
  const headerSel = "button, .accordion-header, .acc-header, h1, h2, h3, .title, .heading";
  const contentSel = ".accordion-content, .content, .panel, .acc-body, .body, div";

  // найти и открыть аккордеон по anchor (заголовку)
  function openAccordionByHeaderText(headerText) {
    const accs = document.querySelectorAll(accordionSel);
    for (const acc of accs) {
      const header = acc.querySelector(headerSel);
      if (header && header.textContent.toLowerCase().includes(headerText.toLowerCase())) {
        openAccordion(acc, header);
        return acc;
      }
    }
    // fallback: искать среди заголовков по всей странице
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

  // открыть аккордеон: попытка click(), затем раскрыть контент вручную
  function openAccordion(acc, header) {
    if (!acc) return;
    // если есть кнопка/заголовок — попробуем кликнуть (встроенные обработчики сработают)
    if (header && typeof header.click === "function") {
      try { header.click(); } catch(e) {}
    }
    // затем вручную показать контент, если он скрыт
    const content = acc.querySelector(contentSel) || acc.querySelector("div");
    if (content) {
      // иногда аккордеон скрывает содержимое через max-height или display
      content.style.display = "block";
      // добавить класс active, aria-expanded = true
      acc.classList.add("active");
      if (header) header.setAttribute("aria-expanded", "true");
    }
  }

  // подсветить слово внутри элемента (меняем innerHTML — простой, но обычно сработает для статичного контента)
  function highlightInElement(el) {
    if (!el) return false;
    try {
      const html = el.innerHTML;
      const newHtml = html.replace(re, match => `<mark>${match}</mark>`);
      if (newHtml !== html) {
        el.innerHTML = newHtml;
        return true;
      }
    } catch (e) {
      // если innerHTML заменить нельзя, используем textContent перебор — пропускаем
    }
    return false;
  }

  // основной алгоритм:
  (function main() {
    let targetAcc = null;

    if (anchor) {
      targetAcc = openAccordionByHeaderText(anchor);
      if (targetAcc) {
        // подсветить внутри этого аккордеона
        const content = targetAcc.querySelector(contentSel) || targetAcc;
        if (highlightInElement(content)) {
          // скроллим к первому <mark>
          const mark = content.querySelector("mark");
          if (mark) mark.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
      }
    }

    // если не нашли аккордеон по anchor — ищем первое вхождение слова по странице в блоках содержимого и открываем родительский аккордеон
    const contentCandidates = document.querySelectorAll(contentSel + ", p, li, div");
    for (const cand of contentCandidates) {
      if ((cand.innerText || "").toLowerCase().includes(highlight.toLowerCase())) {
        // если cand внутри аккордеона — откроем его
        const acc = cand.closest(accordionSel);
        if (acc) {
          const header = acc.querySelector(headerSel);
          openAccordion(acc, header);
        }
        // подсветка и скролл
        if (highlightInElement(cand)) {
          const mark = cand.querySelector("mark");
          if (mark) mark.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }
    }

    // fallback: ничего не найдено — ничего не делаем
  })();
});





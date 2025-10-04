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
  const searchInput = document.querySelector("#search-input"); // твое поле поиска
  const resultsBox = document.querySelector("#search-results"); // контейнер с результатами
  const accordions = document.querySelectorAll(".accordion");

  // Когда кликаем на элемент результата поиска
  resultsBox.addEventListener("click", e => {
    const item = e.target.closest(".search-result-item");
    if (!item) return;

    const targetId = item.dataset.target; // аккордеон, к которому перейти
    const targetAccordion = document.querySelector(`#${targetId}`);

    if (targetAccordion) {
      // Свернуть все остальные аккордеоны
      accordions.forEach(acc => {
        const content = acc.querySelector(".accordion-content");
        if (content) content.style.display = "none";
      });

      // Раскрыть нужный аккордеон
      const content = targetAccordion.querySelector(".accordion-content");
      if (content) {
        content.style.display = "block";
      }

      // Плавно прокрутить к нему
      targetAccordion.scrollIntoView({ behavior: "smooth", block: "center" });

      // Очистить поле поиска и результаты
      searchInput.value = "";
      resultsBox.innerHTML = "";
    }
  });
});

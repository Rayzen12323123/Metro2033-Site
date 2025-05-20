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
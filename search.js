(() => {
  const pages = [
    { file: "index.html", name: "Главная" },
    { file: "about.html", name: "О проекте" },
    { file: "administration.html", name: "Администрация" },
    { file: "fuction.html", name: "Фракции" }, 
    { file: "general-rules.html", name: "Основные правила" },
    { file: "iventolog.html", name: "Ивентология" },
    { file: "rules-for-players.html", name: "Правила игроков" }
  ];

  const input = document.getElementById("searchInput") || document.querySelector("#searchInput");
  const results = document.getElementById("results") || document.querySelector("#results");

  if (!input || !results) {
    console.warn("search.js: не найден searchInput или results. Проверь id в search.html.");
    return;
  }

  // debounce
  let timer = null;
  input.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => doSearch(input.value.trim()), 220);
  });

  // helper: escape html
  function escapeHtml(s) {
    return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  async function doSearch(query) {
    results.innerHTML = "";
    if (!query || query.length < 2) return;

    const qlc = query.toLowerCase();
    const found = [];

    for (const p of pages) {
      try {
        const url = encodeURI(p.file);
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("fetch failed " + resp.status);
        const txt = await resp.text();

        // чистый текст страницы для быстрого поиска
        const parser = new DOMParser();
        const doc = parser.parseFromString(txt, "text/html");
        const bodyText = (doc.body && doc.body.innerText) ? doc.body.innerText.toLowerCase() : txt.toLowerCase();

        if (!bodyText.includes(qlc)) continue;

        // пытаемся найти конкретный аккордеон, в котором есть совпадение
        const accordionSelectors = [
          ".accordion", ".accordion-item", ".acc", ".faq-item", ".accordion-block", ".collapse"
        ];
        let matchedAccordionHeader = null;

        for (const sel of accordionSelectors) {
          const list = doc.querySelectorAll(sel);
          for (const acc of list) {
            const accText = (acc.innerText || "").toLowerCase();
            if (accText.includes(qlc)) {
              // нашли аккордеон, попробуем взять заголовок внутри него
              const header = acc.querySelector("button, .accordion-header, .acc-header, h1, h2, h3, .title, .heading");
              matchedAccordionHeader = header ? header.textContent.trim() : acc.querySelector("div, p")?.textContent?.slice(0,50)?.trim();
              break;
            }
          }
          if (matchedAccordionHeader) break;
        }

        // snippet: берем кусок текста вокруг первого вхождения
        const origText = (doc.body && doc.body.innerText) ? doc.body.innerText : txt.replace(/<[^>]+>/g, " ");
        const lowerOrig = origText.toLowerCase();
        const idx = lowerOrig.indexOf(qlc);
        const start = Math.max(0, idx - 60);
        const end = Math.min(origText.length, idx + 80);
        let snippet = origText.slice(start, end);
        snippet = escapeHtml(snippet);

        // подсветка в snippet (вставляем <mark>)
        const re = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), "gi");
        snippet = snippet.replace(re, m => `<mark>${escapeHtml(m)}</mark>`);

        found.push({
          file: p.file,
          name: p.name || p.file.replace(".html",""),
          snippet,
          anchor: matchedAccordionHeader ? matchedAccordionHeader : null
        });

      } catch (err) {
        console.warn("Ошибка загрузки", p.file, err);
        // не прерываем цикл — просто продолжаем
      }
    }

    if (found.length === 0) {
      results.innerHTML = `<p>Ничего не найдено.</p>`;
      return;
    }

    // отрисуем результаты
    for (const item of found) {
      // формируем ссылку: ?highlight=... &anchor=...
      const href = `${item.file}?highlight=${encodeURIComponent(query)}${item.anchor ? "&anchor=" + encodeURIComponent(item.anchor) : ""}`;
      const div = document.createElement("div");
      div.className = "result-item";
      div.innerHTML = `
        <a class="result-link" href="${href}"><strong>${item.name}</strong></a>
        <div class="snippet">...${item.snippet}...</div>
      `;
      results.appendChild(div);
    }
  }
})();



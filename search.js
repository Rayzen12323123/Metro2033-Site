document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector("#search-input");
  const searchResults = document.querySelector("#search-results");

  async function searchSite(query) {
    searchResults.innerHTML = "";
    if (!query.trim()) return;

    const pages = [
      "index.html",
      "rules-for-players.html",
      "iventolog.html",
      "general-rules.html",
      "fuction.html",
      "administration.html",
    ];

    const results = [];

    for (const page of pages) {
      const response = await fetch(page);
      const text = await response.text();

      const lowerText = text.toLowerCase();
      const lowerQuery = query.toLowerCase();

      if (lowerText.includes(lowerQuery)) {
        const index = lowerText.indexOf(lowerQuery);
        const snippetStart = Math.max(0, index - 60);
        const snippetEnd = Math.min(text.length, index + 60);
        const snippet = text
          .slice(snippetStart, snippetEnd)
          .replace(new RegExp(query, "gi"), match => `<mark>${match}</mark>`);

        // Красивое русское название вместо file.html
        const titles = {
          "index.html": "Главная",
          "rules-for-players.html": "Основные правила игроков",
          "iventolog.html": "Правила Ивентологии",
          "general-rules.html": "Общие правила проекта",
          "fuction.html": "Правила Фракций",
          "administration.html"
        };

        results.push({
          page,
          title: titles[page] || page.replace(".html", ""),
          snippet
        });
      }
    }

    if (results.length === 0) {
      searchResults.innerHTML = `<p>Ничего не найдено...</p>`;
      return;
    }

    results.forEach(res => {
      const div = document.createElement("div");
      div.classList.add("search-result-item");
      div.innerHTML = `
        <a href="${res.page}?highlight=${encodeURIComponent(query)}" class="search-link">
          <strong>${res.title}</strong>
        </a>
        <p>${res.snippet}...</p>
      `;
      searchResults.appendChild(div);
    });
  }

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();
    searchSite(query);
  });
});


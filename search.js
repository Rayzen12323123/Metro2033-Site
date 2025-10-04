const pages = [
  { file: "index.html", name: "Главная страница" },
  { file: "about.html", name: "О проекте" },
  { file: "administration.html", name: "Администрация" },
  { file: "fuction (1).html", name: "Фракции" },
  { file: "general-rules.html", name: "Основные правила" },
  { file: "iventolog.html", name: "Ивентология" },
  { file: "rules-for-players.html", name: "Правила игроков" }
];

const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("results");

searchInput.addEventListener("input", async () => {
  const query = searchInput.value.trim().toLowerCase();
  resultsContainer.innerHTML = "";

  if (query.length < 2) return;

  for (const { file, name } of pages) {
    try {
      const response = await fetch(file);
      const text = await response.text();
      const cleanText = text.replace(/<[^>]*>?/gm, " ").toLowerCase();

      if (cleanText.includes(query)) {
        const index = cleanText.indexOf(query);
        const snippetStart = Math.max(0, index - 50);
        const snippetEnd = Math.min(cleanText.length, index + 100);
        let snippet = cleanText.substring(snippetStart, snippetEnd);

        // Подсветка найденного слова
        const regex = new RegExp(query, "gi");
        snippet = snippet.replace(regex, (match) => `<mark>${match}</mark>`);

        const resultDiv = document.createElement("div");
        resultDiv.classList.add("result-item");
        resultDiv.innerHTML = `
          <a href="${file}" target="_blank">${name}</a>
          <div class="snippet">...${snippet}...</div>
        `;
        resultsContainer.appendChild(resultDiv);
      }
    } catch (err) {
      console.error(`Ошибка загрузки ${file}:`, err);
    }
  }

  if (!resultsContainer.hasChildNodes()) {
    resultsContainer.innerHTML = `<p>Ничего не найдено.</p>`;
  }
});

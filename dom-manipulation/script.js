// ====== Initial Quotes ======
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Stay hungry, stay foolish.", category: "Motivation" }
];

// ====== DOM Elements ======
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const categoryFilter = document.getElementById("categoryFilter");
const exportBtn = document.getElementById("exportBtn");
const importFile = document.getElementById("importFile");
const syncBtn = document.getElementById("syncBtn");
const syncStatus = document.getElementById("syncStatus");

// ====== Utility Functions ======
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function getRandomQuote(category = "all") {
  let filteredQuotes = category === "all" ? quotes : quotes.filter(q => q.category === category);
  if (filteredQuotes.length === 0) return { text: "No quotes in this category yet.", category: "" };
  return filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
}

// ====== Display Random Quote ======
function displayRandomQuote() {
  const selectedCategory = categoryFilter.value || "all";
  const randomQuote = getRandomQuote(selectedCategory);
  quoteDisplay.textContent = `"${randomQuote.text}" (${randomQuote.category})`;

  // Save last viewed quote in session storage
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

// ====== Add Quote ======
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim() || "General";

  if (text === "") {
    alert("Please enter a quote!");
    return;
  }

  const newQ = { text, category };
  quotes.push(newQ);
  saveQuotes();
  populateCategories();
  newQuoteText.value = "";
  newQuoteCategory.value = "";
  alert("Quote added!");
}

// ====== Populate Categories ======
function populateCategories() {
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join("");

  // restore last filter
  const lastFilter = localStorage.getItem("lastFilter") || "all";
  categoryFilter.value = lastFilter;
}

// ====== Filter Quotes ======
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("lastFilter", selected);
  displayRandomQuote();
}

// ====== Export Quotes ======
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ====== Import Quotes ======
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (err) {
      alert("Error reading JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ====== Server Sync (Simulation) ======
async function syncWithServer() {
  syncStatus.textContent = "Syncing...";
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverData = await res.json();

    // simulate server quotes
    const serverQuotes = serverData.slice(0, 3).map(item => ({
      text: item.title,
      category: "Server"
    }));

    // conflict resolution: server wins
    quotes = [...quotes, ...serverQuotes];
    saveQuotes();
    populateCategories();
    syncStatus.textContent = "Sync complete. Server quotes added.";
  } catch (err) {
    syncStatus.textContent = "Sync failed.";
  }
}

// ====== Event Listeners ======
newQuoteBtn.addEventListener("click", displayRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
categoryFilter.addEventListener("change", filterQuotes);
exportBtn.addEventListener("click", exportToJson);
importFile.addEventListener("change", importFromJsonFile);
syncBtn.addEventListener("click", syncWithServer);

// ====== Init ======
populateCategories();

// Load last viewed quote from sessionStorage
const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
if (lastQuote) {
  quoteDisplay.textContent = `"${lastQuote.text}" (${lastQuote.category})`;
} else {
  displayRandomQuote();
}

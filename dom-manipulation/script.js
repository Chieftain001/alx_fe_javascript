// Array of quotes with text and category
let quotes = [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Don't let yesterday take up too much of today.", category: "Inspiration" },
    { text: "It's not whether you get knocked down, it's whether you get up.", category: "Perseverance" }
];

// Function to display a random quote
function showRandomQuote() {
    let randomIndex = Math.floor(Math.random() * quotes.length);
    let quote = quotes[randomIndex];
    document.getElementById("quoteDisplay").innerHTML = `<p>${quote.text}</p><small>${quote.category}</small>`;
}

// Function to add a new quote
function addQuote() {
    let text = document.getElementById("newQuoteText").value;
    let category = document.getElementById("newQuoteCategory").value;

    if (text && category) {
        quotes.push({ text: text, category: category });
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
        showRandomQuote();
    }
}

// Event listener for "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Event listener for "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);



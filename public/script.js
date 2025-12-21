const form = document.getElementById("contentForm");
const ideaInput = document.getElementById("ideaInput");
const resultsSection = document.getElementById("resultsSection");
const errorSection = document.getElementById("errorSection");
const errorMessage = document.getElementById("errorMessage");
const linkedinContent = document.getElementById("linkedinContent");
const twitterContent = document.getElementById("twitterContent");
const charCount = document.getElementById("charCount");
const submitBtn = form.querySelector('button[type="submit"]');
const btnText = submitBtn.querySelector(".btn-text");
const spinner = submitBtn.querySelector(".spinner");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const idea = ideaInput.value.trim();

  if (!idea) {
    showError("Please enter a content idea");
    return;
  }

  resultsSection.classList.add("hidden");
  errorSection.classList.add("hidden");

  submitBtn.disabled = true;
  btnText.textContent = "Generating...";
  spinner.classList.remove("hidden");

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idea }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to generate content");
    }

    const data = await response.json();

    linkedinContent.textContent = data.linkedin;
    twitterContent.textContent = data.twitter;
    charCount.textContent = data.twitter.length;

    resultsSection.classList.remove("hidden");
    errorSection.classList.add("hidden");
  } catch (error) {
    showError(error.message);
  } finally {
    submitBtn.disabled = false;
    btnText.textContent = "Generate Content";
    spinner.classList.add("hidden");
  }
});

// Copy to clipboard
document.querySelectorAll(".copy-btn").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    const targetId = btn.dataset.target;
    const content = document.getElementById(targetId).textContent;

    try {
      await navigator.clipboard.writeText(content);
      const originalText = btn.textContent;
      btn.textContent = "✓ Copied!";
      btn.classList.add("copied");

      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove("copied");
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  });
});

function showError(message) {
  errorMessage.textContent = message;
  errorSection.classList.remove("hidden");
  resultsSection.classList.add("hidden");
}

const linkedInFeed = document.querySelector("[data-linkedin-feed]");
const documentLinks = document.querySelectorAll("[data-document-link]");

function renderLinkedInMessage(message) {
  if (!linkedInFeed) {
    return;
  }

  linkedInFeed.innerHTML = `
    <article class="linkedin-card">
      <span>LinkedIn Feed</span>
      <p>${message}</p>
      <a href="https://www.linkedin.com/in/adamclaird/" target="_blank" rel="noreferrer">View LinkedIn profile</a>
    </article>
  `;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderLinkedInPosts(posts) {
  if (!linkedInFeed) {
    return;
  }

  if (!posts.length) {
    renderLinkedInMessage("No public LinkedIn posts are available yet.");
    return;
  }

  linkedInFeed.innerHTML = posts.map((post) => `
    <article class="linkedin-card">
      <span>${escapeHtml(post.publishedAt || "LinkedIn Post")}</span>
      <h3>${escapeHtml(post.title || "Recent LinkedIn Update")}</h3>
      <p>${escapeHtml(post.text || "")}</p>
      <a href="${escapeHtml(post.url)}" target="_blank" rel="noreferrer">Read on LinkedIn</a>
    </article>
  `).join("");
}

async function loadLinkedInPosts() {
  if (!linkedInFeed) {
    return;
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch("api/linkedin-posts", {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error("LinkedIn feed request failed.");
    }

    const data = await response.json();
    renderLinkedInPosts(data.posts || []);
  } catch (error) {
    renderLinkedInMessage("LinkedIn auto-sync needs the API endpoint deployed with LinkedIn credentials. View the profile for the latest posts.");
  } finally {
    window.clearTimeout(timeout);
  }
}

async function updateDocumentLinks() {
  await Promise.all([...documentLinks].map(async (link) => {
    try {
      const response = await fetch(link.href, { method: "HEAD" });

      if (!response.ok) {
        throw new Error("Document not found.");
      }
    } catch (error) {
      link.classList.add("is-unavailable");
      link.setAttribute("aria-disabled", "true");
      link.addEventListener("click", (event) => event.preventDefault());
    }
  }));
}

loadLinkedInPosts();
updateDocumentLinks();

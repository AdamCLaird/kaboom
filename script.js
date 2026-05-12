const linkedInFeed = document.querySelector("[data-linkedin-feed]");

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

  try {
    const response = await fetch("/api/linkedin-posts");

    if (!response.ok) {
      throw new Error("LinkedIn feed request failed.");
    }

    const data = await response.json();
    renderLinkedInPosts(data.posts || []);
  } catch (error) {
    renderLinkedInMessage("Recent LinkedIn posts will appear here after the feed is connected.");
  }
}

loadLinkedInPosts();

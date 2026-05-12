const documentLinks = document.querySelectorAll("[data-document-link]");

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

updateDocumentLinks();

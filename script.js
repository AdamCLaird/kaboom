const documentLinks = document.querySelectorAll("[data-document-link]");
const modalOpen = document.querySelector("[data-modal-open]");
const posterModal = document.querySelector("[data-poster-modal]");
const modalClose = document.querySelector("[data-modal-close]");

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

function openPosterModal(event) {
  event.preventDefault();

  if (!posterModal) {
    return;
  }

  posterModal.classList.add("is-open");
  posterModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modalClose?.focus();
}

function closePosterModal() {
  if (!posterModal) {
    return;
  }

  posterModal.classList.remove("is-open");
  posterModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  modalOpen?.focus();
}

modalOpen?.addEventListener("click", openPosterModal);
modalClose?.addEventListener("click", closePosterModal);
posterModal?.addEventListener("click", (event) => {
  if (event.target === posterModal) {
    closePosterModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && posterModal?.classList.contains("is-open")) {
    closePosterModal();
  }
});

updateDocumentLinks();

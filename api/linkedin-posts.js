const LINKEDIN_POSTS_URL = "https://api.linkedin.com/rest/posts";

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function postUrl(post) {
  const urn = post.id || "";
  const id = urn.split(":").pop();
  return id ? `https://www.linkedin.com/feed/update/${urn}/` : "https://www.linkedin.com/in/adamclaird/";
}

function normalizePost(post) {
  const commentary = post.commentary || post.specificContent?.["com.linkedin.ugc.ShareContent"]?.shareCommentary?.text;
  const publishedAt = post.createdAt || post.created?.time;

  return {
    title: "Recent LinkedIn Update",
    text: cleanText(commentary).slice(0, 260),
    url: postUrl(post),
    publishedAt: publishedAt ? new Date(publishedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) : "LinkedIn Post",
  };
}

module.exports = async function handler(request, response) {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const authorUrn = process.env.LINKEDIN_AUTHOR_URN;

  if (!accessToken || !authorUrn) {
    response.status(503).json({
      error: "LinkedIn feed is not configured.",
      posts: [],
    });
    return;
  }

  const url = new URL(LINKEDIN_POSTS_URL);
  url.searchParams.set("q", "author");
  url.searchParams.set("author", authorUrn);
  url.searchParams.set("count", "3");
  url.searchParams.set("sortBy", "LAST_MODIFIED");

  try {
    const linkedInResponse = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Linkedin-Version": "202601",
        "X-Restli-Protocol-Version": "2.0.0",
      },
    });

    if (!linkedInResponse.ok) {
      response.status(linkedInResponse.status).json({
        error: "Unable to load LinkedIn posts.",
        posts: [],
      });
      return;
    }

    const data = await linkedInResponse.json();
    const posts = (data.elements || []).slice(0, 3).map(normalizePost);

    response.status(200).json({ posts });
  } catch (error) {
    response.status(500).json({
      error: "Unable to load LinkedIn posts.",
      posts: [],
    });
  }
};

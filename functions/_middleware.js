// functions/_middleware.js
export const onRequest = async ({ request, env, next }) => {
  const unauthorized = new Response("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Protected"' },
  });

  const auth = request.headers.get("Authorization");
  if (!auth || !auth.startsWith("Basic ")) {
    return unauthorized;
  }

  try {
    const base64 = auth.split(" ")[1];
    const [user, pass] = atob(base64).split(":");

    // Cloudflare Pages の 環境変数（Secrets）を参照
    const ok = user === env.USERNAME && pass === env.PASSWORD;
    if (!ok) return unauthorized;

    return next(); // 認証OK → サイトをそのまま表示
  } catch {
    return unauthorized;
  }
};

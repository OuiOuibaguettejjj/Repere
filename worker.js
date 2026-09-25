var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// worker.js
var security = { "X-Content-Type-Options": "nosniff", "X-Frame-Options": "DENY", "Referrer-Policy": "strict-origin-when-cross-origin", "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=()", "Strict-Transport-Security": "max-age=31536000; includeSubDomains", "Content-Security-Policy": "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'" };
var groups = { compare: [["/comparateur/prix-unitaire/", "Prix unitaire"], ["/conversion/devises/", "EUR / USD"], ["/outil/remise/", "Remise"], ["/outil/promotions/", "Promotions"], ["/outil/pourcentage/", "Pourcentage"]], fiscal: [["/outil/impot-sur-le-revenu/", "Imp\xF4t sur le revenu"], ["/outil/tva/", "TVA"], ["/outil/frais-kilometriques/", "Frais kilom\xE9triques"], ["/outil/plus-value-immobiliere/", "Plus-value immobili\xE8re"], ["/outil/plus-value-mobiliere/", "Plus-value mobili\xE8re"]], immobilier: [["/outil/pret-immobilier/", "Pr\xEAt immobilier"], ["/outil/capacite-emprunt/", "Capacit\xE9 d\u2019emprunt"], ["/outil/frais-de-notaire/", "Frais de notaire"], ["/outil/ptz/", "PTZ"], ["/outil/rendement-locatif/", "Rendement locatif"]], emploi: [["/outil/salaire-brut-net/", "Salaire brut net"], ["/outil/are-chomage/", "Allocation ch\xF4mage"], ["/outil/rupture-conventionnelle/", "Rupture conventionnelle"], ["/outil/indemnite-licenciement/", "Indemnit\xE9 de licenciement"], ["/outil/conges-payes/", "Cong\xE9s pay\xE9s"]], social: [["/outil/prime-activite/", "Prime d\u2019activit\xE9"], ["/outil/rsa/", "RSA"], ["/outil/age-retraite/", "\xC2ge de retraite"], ["/outil/indemnites-maladie/", "IJ maladie"], ["/outil/indemnites-maternite-paternite/", "IJ maternit\xE9 / paternit\xE9"]], patrimoine: [["/outil/donation/", "Donation"], ["/outil/succession/", "Succession"], ["/outil/comparateur-placements/", "Placements"], ["/outil/inflation/", "Inflation"], ["/outil/epargne-mensuelle/", "\xC9pargne mensuelle"]], finance: [["/outil/pourcentage/", "Pourcentage"], ["/outil/remise/", "Remise"], ["/outil/tva/", "TVA"], ["/outil/prix-unitaire/", "Prix unitaire"]], time: [["/outil/age/", "\xC2ge"], ["/outil/difference-dates/", "Diff\xE9rence de dates"], ["/outil/jours-ouvres/", "Jours ouvr\xE9s"], ["/outil/temps-travail/", "Temps de travail"]], measure: [["/conversion/poids/", "Poids"], ["/conversion/longueur/", "Longueur"], ["/conversion/volume/", "Volume"], ["/conversion/aire/", "Aire"]], math: [["/outil/calculatrice/", "Calculatrice"], ["/outil/fractions/", "Fractions"], ["/outil/moyenne/", "Moyenne"], ["/outil/arrondi/", "Arrondi"], ["/outil/median-mode/", "M\xE9diane & mode"]] };
function secure(res, extra = {}) {
  const h = new Headers(res.headers);
  for (const [k, v] of Object.entries(security)) h.set(k, v);
  for (const [k, v] of Object.entries(extra)) h.set(k, v);
  return new Response(res.body, { status: res.status, headers: h });
}
__name(secure, "secure");
function enhance(res, path) {
  const type = res.headers.get("content-type") || "";
  if (!type.includes("text/html")) return secure(res);
  return res.text().then((html) => {
    const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    const plain = (s) => String(s).replace(/<[^>]+>/g, " ").replace(/\\s+/g, " ").trim();
    const url = "https://simulateur.site" + (path === "/" ? "/" : path.endsWith("/") ? path : path + "/");
    const h1Match = html.match(/<h1\b[^>]*>([\\s\\S]*?)<\\/h1>/i);
    const existingTitle = (html.match(/<title>([\\s\\S]*?)<\\/title>/i) || [])[1] || "";
    const existingDesc = (html.match(/<meta\\s+name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) || [])[1] || "";
    const title = plain(existingTitle) || plain(h1Match ? h1Match[1] : "") || "Simulateur — calculateurs et outils gratuits";
    const description = plain(existingDesc) || plain((html.match(/<p[^>]*class=["'][^"']*(?:tool-intro|lead|muted)[^"']*["'][^>]*>([\\s\\S]*?)<\\/p>/i) || [])[1] || "") || ("Utilisez gratuitement " + title.replace(/\\s*\\|\\s*Simulateur.*$/i, "") + " sur Simulateur.");
    const canonicalTag = '<link rel="canonical" href="' + esc(url) + '">';
    if (/<link\\s+[^>]*rel=["']canonical["']/i.test(html)) {
      html = html.replace(/<link\\s+[^>]*rel=["']canonical["'][^>]*>/i, canonicalTag);
    } else {
      html = html.replace("</head>", canonicalTag + "</head>");
    }
    if (!/<meta\\s+name=["']description["']/i.test(html)) html = html.replace("</head>", '<meta name="description" content="' + esc(description) + '"></head>');
    if (!/<meta\\s+name=["']robots["']/i.test(html)) html = html.replace("</head>", '<meta name="robots" content="index,follow"></head>');
    const meta = [
      ['og:type','website'],['og:title',title],['og:description',description],['og:url',url],['og:site_name','Simulateur'],['og:locale','fr_FR'],
      ['twitter:card','summary'],['twitter:title',title],['twitter:description',description]
    ];
    for (const [name, value] of meta) {
      const attr = name.startsWith("og:") ? "property" : "name";
      const re = new RegExp('<meta\\\\s+(?:name|property)=["\\\']' + name.replace(":", "\\:") + '["\\\'][^>]*>', "i");
      if (!re.test(html)) html = html.replace("</head>", '<meta ' + attr + '="' + name + '" content="' + esc(value) + '"></head>');
    }
    if (!/<link\\s+[^>]*rel=["']icon["']/i.test(html)) html = html.replace("</head>", '<link rel="icon" href="/favicon.svg" type="image/svg+xml"></head>');
    if (!/<script\\s+[^>]*type=["']application\\/ld\\+json["']/i.test(html)) {
      const parts = path.split("/").filter(Boolean);
      const crumbs = [{ "@type":"ListItem", position:1, name:"Accueil", item:"https://simulateur.site/" }];
      let acc = "";
      parts.forEach((part, i) => {
        acc += "/" + part;
        if (i === parts.length - 1) return;
        crumbs.push({ "@type":"ListItem", position:crumbs.length+1, name:part.replace(/-/g," "), item:"https://simulateur.site" + acc + "/" });
      });
      const data = [
        { "@context":"https://schema.org", "@type":"WebPage", name:title, description, url },
        { "@context":"https://schema.org", "@type":"BreadcrumbList", itemListElement:crumbs }
      ];
      html = html.replace("</head>", '<script type="application/ld+json">' + JSON.stringify(data) + "</script></head>");
    }
    if (!/<footer\\b/i.test(html)) {
      html = html.replace("</body>", '<footer><div class="wrap"><div class="footerlinks"><a href="/a-propos/">À propos</a><a href="/contact/">Contact</a><a href="/mentions-legales/">Mentions légales</a><a href="/confidentialite/">Confidentialité</a><a href="/cookies/">Cookies</a><a href="/cgu/">CGU</a></div></div></footer></body>');
    } else if (!/href=["']\\/contact\\/?["']/i.test(html)) {
      html = html.replace(/<div[^>]*class=["']footerlinks["'][^>]*>/i, "$&<a href=\"/contact/\">Contact</a>");
    }
    if (path !== "/" && !path.includes("/mentions-legales") && !path.includes("/confidentialite") && !path.includes("/cookies") && !path.includes("/cgu") && !html.includes("related-tools")) {
      let g = path.startsWith("/conversion/devises") ? groups.compare : path.startsWith("/conversion/") ? groups.measure : path.startsWith("/comparateur/") ? groups.compare : path.includes("/outil/") ? path.includes("impot") || path.includes("tva") || path.includes("frais-kilometriques") || path.includes("plus-value") ? groups.fiscal : path.includes("pret") || path.includes("emprunt") || path.includes("notaire") || path.includes("ptz") || path.includes("rendement") || path.includes("cash-flow") ? groups.immobilier : path.includes("salaire") || path.includes("chomage") || path.includes("rupture") || path.includes("licenciement") || path.includes("preavis") || path.includes("solde") || path.includes("conges") ? groups.emploi : path.includes("prime") || path.includes("rsa") || path.includes("retraite") || path.includes("indemnites") ? groups.social : path.includes("donation") || path.includes("succession") || path.includes("placement") || path.includes("inflation") || path.includes("epargne") ? groups.patrimoine : path.includes("age") || path.includes("date") || path.includes("temps") ? groups.time : path.includes("fraction") || path.includes("moyenne") || path.includes("arrondi") || path.includes("calculatrice") ? groups.math : groups.finance : null;
      if (g) {
        const cards = g.filter((x) => !path.startsWith(x[0])).map((x) => '<a class="related-link" href="' + x[0] + '">' + x[1] + " →</a>").join("");
        html = html.replace("</main>", '<section class="related-tools"><div><div class="eyebrow">POUR ALLER PLUS LOIN</div><h2>Outils associés</h2><p class="muted">Poursuivez avec un calcul complémentaire.</p></div><div class="related-links">' + cards + "</div></section></main>");
      }
    }
    const h = new Headers(res.headers);
    h.delete("content-length");
    return secure(new Response(html, { status: res.status, headers: h }));
  });
}var worker_default = { async fetch(request, env) {
  const u = new URL(request.url);
if (u.pathname === "/robots.txt") return secure(new Response("User-agent: *\nAllow: /\nSitemap: https://simulateur.site/sitemap.xml\n", { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" } }));
  if (u.pathname === "/sitemap.xml") return secure(new Response("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n  <url><loc>https://simulateur.site/a-propos/</loc></url>\n  <url><loc>https://simulateur.site/argent/</loc></url>\n  <url><loc>https://simulateur.site/calculateurs/</loc></url>\n  <url><loc>https://simulateur.site/cgu/</loc></url>\n  <url><loc>https://simulateur.site/comparateur/prix-unitaire/</loc></url>\n  <url><loc>https://simulateur.site/comparateurs/</loc></url>\n  <url><loc>https://simulateur.site/confidentialite/</loc></url>\n  <url><loc>https://simulateur.site/contact/</loc></url>\n  <url><loc>https://simulateur.site/conversion/aire/</loc></url>\n  <url><loc>https://simulateur.site/conversion/devises/</loc></url>\n  <url><loc>https://simulateur.site/conversion/donnees/</loc></url>\n  <url><loc>https://simulateur.site/conversion/longueur/</loc></url>\n  <url><loc>https://simulateur.site/conversion/poids/</loc></url>\n  <url><loc>https://simulateur.site/conversion/temperature/</loc></url>\n  <url><loc>https://simulateur.site/conversion/volume/</loc></url>\n  <url><loc>https://simulateur.site/conversions/</loc></url>\n  <url><loc>https://simulateur.site/cookies/</loc></url>\n  <url><loc>https://simulateur.site/index.html</loc></url>\n  <url><loc>https://simulateur.site/mentions-legales/</loc></url>\n  <url><loc>https://simulateur.site/mesures/</loc></url>\n  <url><loc>https://simulateur.site/outil/age-retraite/</loc></url>\n  <url><loc>https://simulateur.site/outil/age/</loc></url>\n  <url><loc>https://simulateur.site/outil/are-chomage/</loc></url>\n  <url><loc>https://simulateur.site/outil/arrondi/</loc></url>\n  <url><loc>https://simulateur.site/outil/calculatrice/</loc></url>\n  <url><loc>https://simulateur.site/outil/capacite-emprunt/</loc></url>\n  <url><loc>https://simulateur.site/outil/cash-flow-immobilier/</loc></url>\n  <url><loc>https://simulateur.site/outil/charges-independant/</loc></url>\n  <url><loc>https://simulateur.site/outil/coefficient/</loc></url>\n  <url><loc>https://simulateur.site/outil/comparateur-placements/</loc></url>\n  <url><loc>https://simulateur.site/outil/conges-payes/</loc></url>\n  <url><loc>https://simulateur.site/outil/consommation-carburant/</loc></url>\n  <url><loc>https://simulateur.site/outil/cout-km/</loc></url>\n  <url><loc>https://simulateur.site/outil/difference-dates/</loc></url>\n  <url><loc>https://simulateur.site/outil/donation/</loc></url>\n  <url><loc>https://simulateur.site/outil/electricite/</loc></url>\n  <url><loc>https://simulateur.site/outil/epargne-mensuelle/</loc></url>\n  <url><loc>https://simulateur.site/outil/epargne/</loc></url>\n  <url><loc>https://simulateur.site/outil/fractions/</loc></url>\n  <url><loc>https://simulateur.site/outil/frais-de-notaire/</loc></url>\n  <url><loc>https://simulateur.site/outil/frais-kilometriques/</loc></url>\n  <url><loc>https://simulateur.site/outil/impot-sur-le-revenu/</loc></url>\n  <url><loc>https://simulateur.site/outil/indemnite-licenciement/</loc></url>\n  <url><loc>https://simulateur.site/outil/indemnites-maladie/</loc></url>\n  <url><loc>https://simulateur.site/outil/indemnites-maternite-paternite/</loc></url>\n  <url><loc>https://simulateur.site/outil/inflation/</loc></url>\n  <url><loc>https://simulateur.site/outil/interets-composes/</loc></url>\n  <url><loc>https://simulateur.site/outil/jours-ouvres/</loc></url>\n  <url><loc>https://simulateur.site/outil/marge/</loc></url>\n  <url><loc>https://simulateur.site/outil/median-mode/</loc></url>\n  <url><loc>https://simulateur.site/outil/mensualite-pret/</loc></url>\n  <url><loc>https://simulateur.site/outil/micro-entrepreneur/</loc></url>\n  <url><loc>https://simulateur.site/outil/moyenne-ponderee/</loc></url>\n  <url><loc>https://simulateur.site/outil/moyenne/</loc></url>\n  <url><loc>https://simulateur.site/outil/partage-depenses/</loc></url>\n  <url><loc>https://simulateur.site/outil/perimetre/</loc></url>\n  <url><loc>https://simulateur.site/outil/plus-value-immobiliere/</loc></url>\n  <url><loc>https://simulateur.site/outil/plus-value-mobiliere/</loc></url>\n  <url><loc>https://simulateur.site/outil/pourboire/</loc></url>\n  <url><loc>https://simulateur.site/outil/pourcentage/</loc></url>\n  <url><loc>https://simulateur.site/outil/preavis-demission/</loc></url>\n  <url><loc>https://simulateur.site/outil/pret-immobilier/</loc></url>\n  <url><loc>https://simulateur.site/outil/prime-activite/</loc></url>\n  <url><loc>https://simulateur.site/outil/prix-unitaire/</loc></url>\n  <url><loc>https://simulateur.site/outil/promotions/</loc></url>\n  <url><loc>https://simulateur.site/outil/proportion/</loc></url>\n  <url><loc>https://simulateur.site/outil/ptz/</loc></url>\n  <url><loc>https://simulateur.site/outil/ratio/</loc></url>\n  <url><loc>https://simulateur.site/outil/recette/</loc></url>\n  <url><loc>https://simulateur.site/outil/remise/</loc></url>\n  <url><loc>https://simulateur.site/outil/rendement-locatif/</loc></url>\n  <url><loc>https://simulateur.site/outil/retraite-simplifiee/</loc></url>\n  <url><loc>https://simulateur.site/outil/rsa/</loc></url>\n  <url><loc>https://simulateur.site/outil/rupture-conventionnelle/</loc></url>\n  <url><loc>https://simulateur.site/outil/salaire-brut-net/</loc></url>\n  <url><loc>https://simulateur.site/outil/salaire-horaire/</loc></url>\n  <url><loc>https://simulateur.site/outil/sasu-vs-ei-micro/</loc></url>\n  <url><loc>https://simulateur.site/outil/solde-tout-compte/</loc></url>\n  <url><loc>https://simulateur.site/outil/succession/</loc></url>\n  <url><loc>https://simulateur.site/outil/surface/</loc></url>\n  <url><loc>https://simulateur.site/outil/tableau-amortissement/</loc></url>\n  <url><loc>https://simulateur.site/outil/temps-calcul/</loc></url>\n  <url><loc>https://simulateur.site/outil/temps-travail/</loc></url>\n  <url><loc>https://simulateur.site/outil/temps/</loc></url>\n  <url><loc>https://simulateur.site/outil/tva/</loc></url>\n  <url><loc>https://simulateur.site/outil/vitesse/</loc></url>\n  <url><loc>https://simulateur.site/temps/</loc></url>\n  <url><loc>https://simulateur.site/vie-quotidienne/</loc></url>\n</urlset>\n", { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=86400" } }));
  if (u.pathname === "/api/devises") {
    if (request.method !== "GET") return secure(new Response("Method Not Allowed", { status: 405 }), { "Allow": "GET" });
    try {
      const x = await fetch("https://data-api.ecb.europa.eu/service/data/EXR/D..EUR.SP00.A?format=csvdata&lastNObservations=1", { cf: { cacheTtl: 21600, cacheEverything: true } });
      if (!x.ok) throw new Error("ECB");
      const csv = await x.text(), lines = csv.trim().split(/\r?\n/), head = lines.shift().split(","), ci = head.indexOf("CURRENCY"), oi = head.indexOf("OBS_VALUE"), datei = head.indexOf("TIME_PERIOD"), rates = { EUR: 1 };
      let date = "";
      for (const line of lines) {
        const p = line.split(",");
        if (ci >= 0 && oi >= 0 && p[ci] && p[oi]) {
          rates[p[ci]] = Number(p[oi]);
          date = p[datei] || date;
        }
      }
      return secure(new Response(JSON.stringify({ date, rates, source: "BCE" }), { headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=21600" } }), { "Access-Control-Allow-Origin": "https://simulateur.site", "Vary": "Origin" });
    } catch {
      return secure(new Response(JSON.stringify({ error: "source_unavailable" }), { status: 502, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } }));
    }
  }
  return enhance(await env.ASSETS.fetch(request), u.pathname);
} };
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map

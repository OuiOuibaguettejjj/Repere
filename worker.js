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
    if (!html.includes('rel="icon"')) html = html.replace("</head>", '<link rel="icon" href="/favicon.svg" type="image/svg+xml"></head>');
    if (path != "/" && !path.includes("/mentions-legales") && !path.includes("/confidentialite") && !path.includes("/cookies") && !path.includes("/cgu") && !html.includes("related-tools")) {
      let g = path.startsWith("/conversion/devises") ? groups.compare : path.startsWith("/conversion/") ? groups.measure : path.startsWith("/comparateur/") ? groups.compare : path.includes("/outil/") ? path.includes("impot") || path.includes("tva") || path.includes("frais-kilometriques") || path.includes("plus-value") ? groups.fiscal : path.includes("pret") || path.includes("emprunt") || path.includes("notaire") || path.includes("ptz") || path.includes("rendement") || path.includes("cash-flow") ? groups.immobilier : path.includes("salaire") || path.includes("chomage") || path.includes("rupture") || path.includes("licenciement") || path.includes("preavis") || path.includes("solde") || path.includes("conges") ? groups.emploi : path.includes("prime") || path.includes("rsa") || path.includes("retraite") || path.includes("indemnites") ? groups.social : path.includes("donation") || path.includes("succession") || path.includes("placement") || path.includes("inflation") || path.includes("epargne") ? groups.patrimoine : path.includes("age") || path.includes("date") || path.includes("temps") ? groups.time : path.includes("fraction") || path.includes("moyenne") || path.includes("arrondi") || path.includes("calculatrice") ? groups.math : groups.finance : null;
      if (g) {
        const cards = g.filter((x) => !path.startsWith(x[0])).map((x) => '<a class="related-link" href="' + x[0] + '">' + x[1] + " \u2192</a>").join("");
        html = html.replace("</main>", '<section class="related-tools"><div><div class="eyebrow">POUR ALLER PLUS LOIN</div><h2>Outils associ\xE9s</h2><p class="muted">Poursuivez avec un calcul compl\xE9mentaire.</p></div><div class="related-links">' + cards + "</div></section></main>");
      }
    }
    const h = new Headers(res.headers);
    h.delete("content-length");
    h.delete("content-encoding");
    h.delete("content-range");
    return secure(new Response(html, { status: res.status, headers: h }));
  });
}
__name(enhance, "enhance");
var worker_default = { async fetch(request, env) {
  const u = new URL(request.url);
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

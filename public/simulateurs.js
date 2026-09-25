(function(){
  const $=id=>document.getElementById(id);
  const euro=value=>Number(value).toLocaleString("fr-FR",{style:"currency",currency:"EUR",maximumFractionDigits:2});
  const num=value=>Number(value).toLocaleString("fr-FR",{maximumFractionDigits:2});
  function addBreadcrumbSchema(tool){
    const slug=(location.pathname.match(/\/outil\/([^/]+)/)||[])[1];
    if(!slug) return;
    const groups={
      "salaire-brut-net":["Salaire","/salaire/"],"salaire-horaire":["Salaire","/salaire/"],"conges-payes":["Travail","/travail/"],"rupture-conventionnelle":["Travail","/travail/"],"indemnite-licenciement":["Travail","/travail/"],"preavis-demission":["Travail","/travail/"],"solde-tout-compte":["Travail","/travail/"],"are-chomage":["Travail","/travail/"],"indemnites-maladie":["Travail","/travail/"],"indemnites-maternite-paternite":["Travail","/travail/"],
      "capacite-emprunt":["Immobilier","/immobilier/"],"pret-immobilier":["Immobilier","/immobilier/"],"mensualite-pret":["Immobilier","/immobilier/"],"tableau-amortissement":["Immobilier","/immobilier/"],"frais-de-notaire":["Immobilier","/immobilier/"],"ptz":["Immobilier","/immobilier/"],"rendement-locatif":["Immobilier","/immobilier/"],"cash-flow-immobilier":["Immobilier","/immobilier/"],"plus-value-immobiliere":["Immobilier","/immobilier/"],
      "impot-sur-le-revenu":["Fiscalité","/fiscalite/"],"tva":["Fiscalité","/fiscalite/"],"plus-value-mobiliere":["Fiscalité","/fiscalite/"],"donation":["Fiscalité","/fiscalite/"],"succession":["Fiscalité","/fiscalite/"],
      "age-retraite":["Retraite","/retraite/"],"retraite-simplifiee":["Retraite","/retraite/"]
    };
    const group=groups[slug];
    const itemList=[{"@type":"ListItem","position":1,"name":"Accueil","item":"https://simulateur.site/"}];
    if(group) itemList.push({"@type":"ListItem","position":2,"name":group[0],"item":"https://simulateur.site"+group[1]});
    itemList.push({"@type":"ListItem","position":itemList.length+1,"name":tool.title||document.title,"item":location.href.split("#")[0]});
    const script=document.createElement("script");
    script.type="application/ld+json";
    script.textContent=JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":itemList});
    document.head.appendChild(script);
  }

  window.Simulateurs={
    render(){
      const tool=window.TOOL;
      if(!tool){ $("result").textContent="Calculateur indisponible."; return; }
      try{
        $("ey").textContent=tool.ey||"";
        $("title").textContent=tool.title||"";
        $("intro").textContent=tool.intro||"";
        const renderedFields=typeof tool.fields==="function"?tool.fields():"";
        if(renderedFields) $("fields").innerHTML=renderedFields;
        $("source").textContent=tool.source||"";
        document.title=(tool.title||"Simulateur")+" | Simulateur";
        addBreadcrumbSchema(tool);
      }catch(error){
        $("result").textContent="Impossible de charger ce calculateur.";
        console.error("Simulateurs.render:",error);
      }
    },
    calc(){
      const tool=window.TOOL;
      if(!tool){ $("result").textContent="Calculateur indisponible."; return; }
      try{
        $("result").innerHTML=tool.calc.call({$,euro,num});
      }catch(error){
        $("result").textContent="Valeurs invalides ou insuffisantes.";
        console.error("Simulateurs.calc:",error);
      }
    }
  };
})();
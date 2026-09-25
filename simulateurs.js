(function(){
  const $=s=>document.querySelector(s);
  const euro=x=>Number(x).toLocaleString("fr-FR",{style:"currency",currency:"EUR",maximumFractionDigits:2});
  const num=x=>Number(x).toLocaleString("fr-FR",{maximumFractionDigits:2});
  window.Simulateurs={
    render(){
      const c=window.TOOL;
      $("#ey").textContent=c.ey;
      $("#title").textContent=c.title;
      $("#intro").textContent=c.intro;
      $("#fields").innerHTML=c.fields();
      $("#source").textContent=c.source;
      document.title=c.title+" | Simulateur";
    },
    calc(){
      try{$("#result").innerHTML=window.TOOL.calc({$: $, euro:euro, num:num, n:id=>Number($(id)?.value||0)});}
      catch(e){$("#result").textContent="Valeurs invalides ou insuffisantes.";}
    }
  };
})();
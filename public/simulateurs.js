(function(){
  const $=selector=>document.querySelector(selector);
  const euro=value=>Number(value).toLocaleString("fr-FR",{style:"currency",currency:"EUR",maximumFractionDigits:2});
  const num=value=>Number(value).toLocaleString("fr-FR",{maximumFractionDigits:2});

  function helpers(){
    return {
      $,
      euro,
      num,
      n:id=>Number($(id)?.value||0)
    };
  }

  function showRuntimeError(message){
    const result=$("#result");
    if(result) result.textContent=message;
  }

  window.Simulateurs={
    render(){
      const tool=window.TOOL;
      if(!tool){
        showRuntimeError("Calculateur indisponible.");
        return;
      }
      try{
        $("#ey").textContent=tool.ey||"";
        $("#title").textContent=tool.title||"";
        $("#intro").textContent=tool.intro||"";
        $("#fields").innerHTML=tool.fields();
        $("#source").textContent=tool.source||"";
        document.title=(tool.title||"Simulateur")+" | Simulateur";
      }catch(error){
        showRuntimeError("Impossible de charger ce calculateur.");
        console.error("Simulateurs.render:",error);
      }
    },

    calc(){
      const tool=window.TOOL;
      if(!tool){
        showRuntimeError("Calculateur indisponible.");
        return;
      }
      try{
        const result=tool.calc.call(helpers());
        const target=$("#result");
        if(target) target.innerHTML=result;
      }catch(error){
        showRuntimeError("Valeurs invalides ou insuffisantes.");
        console.error("Simulateurs.calc:",error);
      }
    }
  };
})();
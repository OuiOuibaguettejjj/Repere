(function(){
  function enableEnterToCalculate(){
    document.addEventListener('keydown', function(event){
      if(event.key !== 'Enter' || event.isComposing) return;
      const target=event.target;
      if(!target || target.tagName !== 'INPUT' || target.type === 'hidden') return;
      const tool=target.closest('.tool');
      if(!tool) return;
      const button=tool.querySelector('button.button-main');
      if(!button || button.disabled) return;
      event.preventDefault();
      button.click();
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enableEnterToCalculate, {once:true});
  else enableEnterToCalculate();
})();

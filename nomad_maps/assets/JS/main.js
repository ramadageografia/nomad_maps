// main minimal loader
fetch('Assets/Dados/festivals.json').then(r=>r.json()).then(data=>console.log('festivals loaded',data.length)).catch(e=>console.error(e));
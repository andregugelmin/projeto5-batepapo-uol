let mensagens =[];

setInterval(getMensagensServidor, 3000);

function getMensagensServidor(){    
    let promisseMensagensServidor = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
    promisseMensagensServidor.then(armazenarMensagens);

}

function armazenarMensagens(resposta){
    mensagens = resposta.data;
    mostrarMensagensRecebidas();
}

function mostrarMensagensRecebidas(){
    let mainHTML = document.querySelector("main");
    mainHTML.innerHTML = "";
    for(let i = 0; i<mensagens.length; i++){

        if(mensagens[i].type === 'status'){
            mainHTML.innerHTML += `
            <div class="mensagem ${mensagens[i].type}">
                <p> <time>(${mensagens[i].time})</time> <strong>${mensagens[i].from} </strong> ${mensagens[i].text}</p>
            </div>
            `;
        }

        else if(mensagens[i].type === 'message'){
            mainHTML.innerHTML += `
            <div class="mensagem ${mensagens[i].type}">
                <p> <time>(${mensagens[i].time})</time> <strong>${mensagens[i].from}</strong>  para <strong>${mensagens[i].to}</strong>: ${mensagens[i].text}</p>
            </div>
            `;
        }

        else if(mensagens[i].type === 'private_message'){
            mainHTML.innerHTML += `
            <div class="mensagem ${mensagens[i].type}">
                <p> <time>(${mensagens[i].time})</time> <strong>${mensagens[i].from}</strong> reservadamente para <strong>${mensagens[i].to}</strong>: ${mensagens[i].text}</p>
            </div>
            `;
        }        
    }
    
    let ultimaMensagem = mainHTML.lastElementChild;
    ultimaMensagem.scrollIntoView();
}

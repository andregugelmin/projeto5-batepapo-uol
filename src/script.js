let mensagens =[];
let usuario;
let mensagemInput;

getNomeUsuario();

function getNomeUsuario(){
    const nomeUsuario = prompt("Qual seu lindo nome?");
    usuario = {
        name: nomeUsuario
    }
    realizarLogin();
}

function realizarLogin(){
    const requisaoLogin = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', usuario);

    requisaoLogin.then(entrarNaSala);
    requisaoLogin.catch(erroRealizarLogin);
}

function erroRealizarLogin(erro){
    if(erro.response.status === 400){
        const nomeUsuario = prompt("Nome ja em uso, escolha outro nome");
        usuario = {
            name: nomeUsuario
        }
        realizarLogin();
    }    
}

function entrarNaSala(){
    setInterval(atualizarStatusUsuarioOnline, 5000);
    setInterval(getMensagensServidor, 3000);

}

function atualizarStatusUsuarioOnline(){
    const requisaoConexao = axios.post('https://mock-api.driven.com.br/api/v4/uol/status', usuario);
    requisaoConexao.then(conexaoAtualizada);
    requisaoConexao.catch(erroAtualizarConexao);
}

function conexaoAtualizada(resposta){
    console.log(resposta.data);
}
function erroAtualizarConexao(erro){
    console.log("Falha em atualizar conexao\n" + erro.data);
}

function getMensagensServidor(){    
    const promisseMensagensServidor = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
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
            <div class="mensagem ${mensagens[i].type}" data-identifier="message">
                <p> <time>(${mensagens[i].time})</time> <strong>${mensagens[i].from} </strong> ${mensagens[i].text}</p>
            </div>
            `;
        }

        else if(mensagens[i].type === 'message'){
            mainHTML.innerHTML += `
            <div class="mensagem ${mensagens[i].type}" data-identifier="message">
                <p> <time>(${mensagens[i].time})</time> <strong>${mensagens[i].from}</strong>  para <strong>${mensagens[i].to}</strong>: ${mensagens[i].text}</p>
            </div>
            `;
        }

        else if(mensagens[i].type === 'private_message'){
            mainHTML.innerHTML += `
            <div class="mensagem ${mensagens[i].type}" data-identifier="message">
                <p> <time>(${mensagens[i].time})</time> <strong>${mensagens[i].from}</strong> reservadamente para <strong>${mensagens[i].to}</strong>: ${mensagens[i].text}</p>
            </div>
            `;
        }        
    }
    
    let ultimaMensagem = mainHTML.lastElementChild;
    ultimaMensagem.scrollIntoView();
}

function enviarMensagem(){
    let mensagem = document.querySelector("input").value;
    console.log(mensagem);
   
    if(mensagem!==""){
        enviarMensagemServidor(mensagem);
    }    
}

function enviarMensagemServidor(mensagem){
    mensagemInput = {
        from: usuario.name,
        to: "Todos",
        text: mensagem,
        type: "message"
    }
    const requisaoEnviarMensagem = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages', mensagemInput);
       
    requisaoEnviarMensagem.catch(erroEnviarMensagem);
    mensagemInput.mensagem = "";
    document.querySelector("input").value = ""
}


function erroEnviarMensagem(erro){
    console.log("Erro ao enviar mensagem " + erro);
    window.location.reload();
}
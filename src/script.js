let mensagens =[];
let usuario;
let mensagemInput;
let usuariosOnline = [];
let usuarioSelecionado = "Todos";
let visibilidade = "Público"

getNomeUsuario();
atualizarStatusUsuarioOnline();
getMensagensServidor();
getUsuariosOnlineServidor();


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
    else{
        window.location.reload();
    }
}

function entrarNaSala(){
    setInterval(atualizarStatusUsuarioOnline, 5000);
    setInterval(getMensagensServidor, 3000);
    setInterval(getUsuariosOnlineServidor, 10000);
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

function checarMensagensNovas(resposta){
    let diferente = 0;
    
    if(mensagens[mensagens.length - 1].time !== resposta.data[resposta.data.length - 1].time){
        armazenarMensagens(resposta);
    }    
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
    let tipo = "";
    if(visibilidade === "Público"){
        tipo = "message";
    }
    else{
        tipo = "private_message";
    }

    mensagemInput = {
        from: usuario.name,
        to: usuarioSelecionado,
        text: mensagem,
        type: tipo
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

function toggleMenu(){
    document.querySelector(".menu-lateral").classList.toggle("escondido");
}



function getUsuariosOnlineServidor(){
    const requisiçãoUsuariosOnline = axios.get('https://mock-api.driven.com.br/api/v4/uol/participants');
    requisiçãoUsuariosOnline.then(armazenarUsuariosOnline);
    
}

function armazenarUsuariosOnline(resposta){    
    const novaListaUsuariosOnline = resposta.data;
    checarNovosUsuariosOnline(novaListaUsuariosOnline);
}

function checarNovosUsuariosOnline(listaUsuariosOnline){
    let diferente = 0;
    for(let i = 0; i < listaUsuariosOnline.length; i++){
        if(usuariosOnline[i] != listaUsuariosOnline[i]){
            diferente = 1;
        }
    }

    if (diferente == 1){
        usuariosOnline = listaUsuariosOnline;
        mostrarUsuariosOnline();
    }
}

function mostrarUsuariosOnline(){
    const listaUsuarios = document.querySelector(".lista-usuarios");
    if(usuarioSelecionado === "Todos"){
        listaUsuarios.innerHTML = `
        <div class="lista-usuarios">
            <div class="opcao selecionado" onclick="selecionarOpcaoPessoa(this)">
                <ion-icon name="people"></ion-icon>
                <p>Todos</p>
                <div class="icone-selecionado"><ion-icon name="checkmark-outline"></ion-icon></ion-icon></div>
            </div>                              
        </div>
        `
    }
    else{
        listaUsuarios.innerHTML = `
        <div class="lista-usuarios">
            <div class="opcao" onclick="selecionarOpcaoPessoa(this)">
                <ion-icon name="people"></ion-icon>
                <p>Todos</p>
                <div class="icone-selecionado escondido"><ion-icon name="checkmark-outline"></ion-icon></ion-icon></div>
            </div>                              
        </div>
        `
    }
    
    for(let i = 0; i < usuariosOnline.length; i++){
        if(usuariosOnline[i].name !== usuario.name){
            if(usuariosOnline[i].name === usuarioSelecionado){
                listaUsuarios.innerHTML += `
                <div class="opcao" onclick="selecionarOpcaoPessoa(this)">
                    <ion-icon name="person-circle"></ion-icon>
                    <p>${usuariosOnline[i].name}</p>
                    <div class="icone-selecionado"><ion-icon name="checkmark-outline"></ion-icon></ion-icon></div>
                </div>
                `
            }
            else{
                listaUsuarios.innerHTML += `
                <div class="opcao" onclick="selecionarOpcaoPessoa(this)">
                    <ion-icon name="person-circle"></ion-icon>
                    <p>${usuariosOnline[i].name}</p>
                    <div class="icone-selecionado escondido"><ion-icon name="checkmark-outline"></ion-icon></ion-icon></div>
                </div>
                `
            } 
        }                  
    }    
}

function selecionarOpcaoPessoa(novaOpcaoSelecionada){
    const opcaoSelecionada = novaOpcaoSelecionada.querySelector('p');
    usuarioSelecionado = opcaoSelecionada.innerText;  
    mostrarUsuariosOnline(usuariosOnline);
    mudarHTMLCaixaInput();
}

function selecionarOpcaoVisibilidade(novaOpcaoSelecionada){
    const opcaoSelecionada = novaOpcaoSelecionada.querySelector('p');
    visibilidade = opcaoSelecionada.innerText;  
    mudarHTMLVisibilidade(visibilidade, novaOpcaoSelecionada);
    mudarHTMLCaixaInput();
}

function mudarHTMLVisibilidade(opcaoSelecionada, opcaoSelecionadaHTML){
    const visibilidadeSelecionada = document.querySelector(".visibilidade .selecionado");

    if(visibilidadeSelecionada !== opcaoSelecionadaHTML){
        visibilidadeSelecionada.classList.remove("selecionado");
        visibilidadeSelecionada.querySelector(".icone-selecionado").classList.add("escondido");
        opcaoSelecionadaHTML.classList.add("selecionado");
        opcaoSelecionadaHTML.querySelector(".icone-selecionado").classList.remove("escondido");
    }

    
}

function mudarHTMLCaixaInput(){    
    const caixaInput = document.querySelector(".caixa-input");

    if(usuarioSelecionado === "Todos"){
        caixaInput.innerHTML = `
            <input type="text" placeholder="Escreva aqui...">
        ` 
    }
    else{
        caixaInput.innerHTML = `
            <input type="text" placeholder="Escreva aqui...">
            <p>Enviando para ${usuarioSelecionado} (${visibilidade.toLowerCase()})</p>
        `
    }
}

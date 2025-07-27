
const apiKeyInput = document.getElementById('apiKey')
const gameSelect = document.getElementById('gameSelect')
const questaoInput = document.getElementById('questaoInput')
const botao = document.getElementById('botao')
const form = document.getElementById('form')
const aiResponde = document.getElementById('aiResponde')

const markdownToHTML = (text) => {
    const converter = new showdown.Converter()
    return converter.makeHtml(text)
}

const perguntaIA = async (questao, game, apiKey) => {
    const model = "gemini-2.0-flash"
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

    const pergunta = `
    
   ## Especialidade
   Você é um especialista assistente de meta para o jogo ${game}

   ## Tarefa
    Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, build e dicas

   ## Regras

   - Se você não sabe a resposta, reponda com 'Não sei' e não tente inventar uma resposta.
   - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionda ao jogo.
   - Considere a data atual ${new Date().toLocaleDateString()}
   - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
   - Nunca responda itens que você não tenha certeza de que existe no patch atual.

   ## Resposta
    - Economiza na resposta, seja direto e responda no máximo 500 caracteres. 
    - Responda em markdown
    - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.

   ## Exemplo de resposta

   pergunta do usuário: Melhor build rengar jungle
   resposta: a build mais atual é \n\n **Itens:**\n\n coloque os itens aqui. \n\n **Runas:\n\n exemplo de runas\n\n

   ---

   Aqui está a pergunta do usuário: ${questao}


    `

    const contents = [{
        role: "user",
        parts: [{
            text: pergunta
        }]
    }]

    const tools = [{
        google_search: {}
    }]
    const response = await fetch(geminiURL, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            contents,
            tools
        })
    })

    const data = await response.json()

    return data.candidates[0].content.parts[0].text
}

const enviarFormulario = async (event) => {
    event.preventDefault()
    const apiKey = apiKeyInput.value
    const game = gameSelect.value
    const questao = questaoInput.value

    // console.log({ apiKey, game, questao })


    if (apiKey == '' || game == '' || questao == '') {
        alert('Por favor, preencha todos os campos')
        return
    }

    botao.disabled = true
    botao.textContent = 'Perguntando...'
    botao.classList.add('carregando')




    console.log(apiKey, game, questao)


    try {
        //pergunta IA
        const text = await perguntaIA(questao, game, apiKey)

        aiResponde.querySelector('.reponse-content').innerHTML = markdownToHTML(text)
        aiResponde.classList.remove('hidden')

    } catch (error) {
        console.log('Erro', error)

    } finally {
        botao.disabled = false
        botao.textContent = 'Perguntar'
        botao.classList.remove('carregando')
    }
}

form.addEventListener('submit', enviarFormulario)



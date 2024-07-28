document.getElementById("btn-search").addEventListener("click", () => {
    let userName = document.getElementById("input-search").value
    if (userName === "") {
        alert("Digite o usuário do GitHub")
        return
    }
    getUserProfile(userName)
})

document.getElementById("input-search").addEventListener("keypress", (e) => {
    let userName = e.target.value
    if (e.key === 'Enter') {
        if (userName === "") {
            alert("Digite o usuário do GitHub")
            return
        }
        getUserProfile(userName)
    }
})

async function user(userName) {
    const response = await fetch(`https://api.github.com/users/${userName}`)
    if (response.status != 200) {
        document.querySelector(".profile-data").innerHTML = "<h2>Usuário não existe</h2>"
        userName = " "
        return
    }
    return await response.json()
}

async function repos(userName) {
    const response = await fetch(`https://api.github.com/users/${userName}/repos?per_page=10`)
    return await response.json()
}

async function eventos(userName) {
    const response = await fetch(`https://api.github.com/users/${userName}/events?per_page=10`)
    return await response.json()
}

function getUserProfile(userName) {
    user(userName).then(userData => {
        let userInfo = `<div class="info">
                            <img src="${userData.avatar_url} alt="imagem do usuário" />
                            <div class="dados"> 
                                <h1>${userData.name ?? "Usuário não possui nome cadastrado😢"}</h1>
                                <p>${userData.bio ?? "Usuário não possui bio cadastrada😢"}</p><br>
                                <p>🧑‍🤝‍🧑 ${userData.followers} followers ${userData.following} followings</p>
                            </div>   
                        </div>`
        document.querySelector(".profile-data").innerHTML = userInfo
        getUserRepositories(userName)
        getEvents(userName)
    })
}

function getUserRepositories(userName) {
    repos(userName).then(reposData => {
        let reposItens = ""
        reposData.forEach(repo => {
            reposItens += `<li><a href="${repo.html_url}" target=_blank>${repo.name}<br>
                                  Forks:${repo.forks} Watchers:${repo.watchers}<br> 
                                  Stars:${repo.stargazers_count} Language:${repo.language}</a></li>`
        });

        document.querySelector(".profile-data").innerHTML += `<div class="repositories section">
                                                                    <h2>Repositórios</h2>
                                                                    <ul>${reposItens}</ul>
                                                               </div>`
    })
}

function getEvents(userName) {
    eventos(userName).then(events => {
        let listaEventos = ""
        events.forEach(evt => {
        if (evt.type == "CreateEvent") {
                listaEventos += `<li>${evt.repo.name} - Sem mensagem de commit</li>`
            } else {
                listaEventos += `<li>${evt.repo.name} - ${evt.payload.commits.message}</li>`
            }
        })
        document.querySelector(".profile-data").innerHTML += `<div>
                                                                <h2>Eventos</h2>
                                                                <div class="eventos">
                                                                    <ul>${listaEventos}</ul>
                                                                </div>
                                                              </div>`
    })

}

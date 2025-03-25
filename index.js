const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`JSON Server is running on port ${PORT}`);
});

//start function
function getplayer() {
    let playerbox = document.getElementById("username").value.trim();
    if (playerbox === "") {
        console.log("Username is empty");
        return;
    }

    fetch("https://guess-the-country-ofgg.onrender.com/players")
        .then(response => response.json())
        .then(players => {
            let playerExists = false;

            for (let i = 0; i < players.length; i++) {
                if (players[i].username === playerbox) {
                    playerExists = true;
                    console.log("Player exists:", players[i]);
                    break;
                }
            }

            if (!playerExists) {
                console.log(`player not found adding ${playerbox}`);
                
                let newPlayer = { username: playerbox, score: 0, Wins:0 };

                fetch("https://guess-the-country-ofgg.onrender.com/players", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newPlayer)
                })
                .then(response => response.json())
                .then(data => {
                    console.log("New player added:", data);
                });
            }
        })
}

function login() {
    getplayer();
}


async function getCountries() {
    let url;
    let continent = document.getElementById("continent").value;
    document.getElementById("new-country").innerText = "Next Country"
    if (continent === "all") {
        url = "https://restcountries.com/v3.1/all";
    } else {
        url = `https://restcountries.com/v3.1/region/${continent}`;
    }
    
    let response = await fetch(url);
    let result = await response.json();
    console.log(result);
}


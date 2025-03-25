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
var user = ""
//start function
function getplayer() {
    let playerbox = document.getElementById("username").value.trim();
    user = playerbox
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
    updatePlayerScore(user)
}

var dataimg = ""
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
    function randomize() {
        let randomcountry = result.length
        console.log(randomcountry)

        let i = Math.floor(Math.random()*randomcountry)
        console.log(i)
        dataimg= result[i].name.common
        document.getElementById("flag").src = result[i].flags.png;

    }
    randomize()

}


function checkanswer() {
    console.log(dataimg)
if (document.getElementById("guess").value == dataimg) {
    console.log("correct") 
    updatePlayerScore(user)
    getCountries()
} else {
    console.log("incorrect")
}
}
async function updatePlayerScore(username) {
    let response = await fetch("https://guess-the-country-ofgg.onrender.com/players");
    let players = await response.json();
    let player = players.find(p => p.username === username);

    if (!player) return console.log("Player not found.");

    let updatedResponse = await fetch(`https://guess-the-country-ofgg.onrender.com/players/${player.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: player.score + 1 })
    });

    let updatedPlayer = await updatedResponse.json();
    document.getElementById("score").innerText = `Score: ${updatedPlayer.score}`
}


var hintIndex = 0;

async function hint() {
    let res = await fetch("https://restcountries.com/v3.1/name/" + dataimg);
    let c = (await res.json())[0];

    let languagesText;
    if (c.languages) {
        languagesText = Object.values(c.languages).join(", ");
    } else {
        languagesText = "No Languages";
    }

    let capitalText;
    if (c.capital && c.capital.length > 0) {
        capitalText = c.capital[0];
    } else {
        capitalText = "No Capital";
    }

    let hints = [
        `Region: ${c.region}`,
        `SubRegion: ${c.subregion}`,
        `Capital: ${capitalText}`,
        `Languages: ${languagesText}`
    ];

    if (isNaN(hintIndex)) {
        hintIndex = 0;
    } else {
        hintIndex = hintIndex % hints.length;
    }

    document.getElementById("hints").innerHTML = hints[hintIndex++];
}

console.log("spotify");

let currentSong = new Audio();
let currentSongIndex = 0;
let currFolder = "";
let songs = [];

async function getSongs(folder) {
    currFolder = folder;

    let res = await fetch("songs/songs.json");
    let data = await res.json();

    songs = data[folder];
    return songs;
}


function secondsToMinSec(sec) {
    if (isNaN(sec)) return "00:00";
    let minutes = Math.floor(sec / 60);
    let seconds = Math.floor(sec % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


function playMusic(track, pause = false) {
    currentSong.src = `songs/${currFolder}/${track}`;

    if (!pause) {
        currentSong.play();
        play.src = "./Imagess/pause.svg";
    }

    document.querySelector(".songinfo").innerText = track;
    document.querySelector(".songtime").innerText = "00:00 / 00:00";
}


async function displayAlbums() {
    let cardContainer = document.querySelector(".cardcontainer");

    let res = await fetch("songs/songs.json");
    let data = await res.json();

    cardContainer.innerHTML = "";

    for (let folder in data) {
        cardContainer.innerHTML += `
            <div class="card" data-folder="${folder}">
                <div>
                    <div class="circle-btn">▶</div>
                    <img src="songs/${folder}/cover.jpg" alt="${folder}">
                    <h2>${folder}</h2>
                    <p>${data[folder].length} songs</p>
                </div>
            </div>
        `;
    }

    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", async () => {
            let folder = card.dataset.folder;
            songs = await getSongs(folder);
            currentSongIndex = 0;

            let songUL = document.querySelector(".songlist ul");
            songUL.innerHTML = "";

            songs.forEach((song, index) => {
                songUL.innerHTML += `
                    <li data-index="${index}">
                        <img src="./Imagess/music.svg" class="invert">
                        <div class="info">${song}</div>
                    </li>
                `;
            });

            document.querySelectorAll(".songlist li").forEach(li => {
                li.addEventListener("click", () => {
                    currentSongIndex = li.dataset.index;
                    playMusic(songs[currentSongIndex]);
                });
            });

            playMusic(songs[0]);
        });
    });
}


async function main() {
    await getSongs("HipHop");
    playMusic(songs[0], true);
    displayAlbums();


    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "./Imagess/pause.svg";
        } else {
            currentSong.pause();
            play.src = "./Imagess/play.svg";
        }
    });


    next.addEventListener("click", () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        playMusic(songs[currentSongIndex]);
    });


    previous.addEventListener("click", () => {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        playMusic(songs[currentSongIndex]);
    });


    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerText =
            `${secondsToMinSec(currentSong.currentTime)} / ${secondsToMinSec(currentSong.duration)}`;

        document.querySelector(".circle").style.left =
            (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = e.offsetX / e.target.clientWidth;
        currentSong.currentTime = currentSong.duration * percent;
    });

    document.querySelector(".volume input").addEventListener("change", e => {
        currentSong.volume = e.target.value / 100;
    });
}

main();

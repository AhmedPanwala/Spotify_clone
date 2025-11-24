console.log("spotify");

let currentSong = new Audio()
let currentSongIndex = 0
let currFolder;
let songs

// Fetched the songs from the folder
async function getSongs(folder) {
    currFolder = folder
    let a = await fetch(`http://127.0.0.1:5500/songs/${folder}`)
    let response = await a.text();

    //  stored stored in the playlist  
    let currentsong
    let div = document.createElement('div')
    div.innerHTML = response
    let links = div.getElementsByTagName('a')
    songs = []
    for (let index = 0; index < links.length; index++) {
        let element = links[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    return songs
}
function secondsToMinSec(sec) {
    let minutes = Math.floor(sec / 60);
    let seconds = Math.floor(sec % 60);

    // add leading zeros
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    return `${minutes}:${seconds}`;
}


const playMusic = (track, pause = false) => {
    currentSong.src = `/songs/${currFolder}/${track}`;
    if (!pause) {
        currentSong.play()
        play.src = "./Imagess/pause.svg"
    }
    document.querySelector('.songinfo').innerHTML = decodeURI(track)
    document.querySelector('.songtime').innerHTML = "00:00/00:00"

}

async function displayAlbums() {

    let card = document.querySelector('.cardcontainer')
    let a = await fetch(`http://127.0.0.1:5500/songs/`)
    let response = await a.text();
    let div = document.createElement('div')
    div.innerHTML = response
    let anchor = div.querySelectorAll('a')

    for (const e of anchor) {
        if (e.href.includes('/songs/')) {
            let folder = e.href.split('/').slice(-1).pop()
            let b = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
            let response = await b.json();

            card.innerHTML += `
                <div class="card" data-folder="${folder}">
                    <div>
                        <div class="circle-btn">
                            <svg data-encore-id="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path>
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.Title}</h2>
                        <p>${response.description}</p>
                    </div>
                </div>`
        }
    }

    let cards = document.querySelectorAll('.card');

    cards.forEach((e) => {
        e.addEventListener('click', async () => {

            let folder = e.dataset.folder  
            let songUL = document.querySelector('.songlist ul');

            songs = await getSongs(folder);

            songUL.innerHTML = "";

            songs.forEach(song => {
                songUL.innerHTML += `
                    <li>
                        <img src="./Imagess/music.svg" class="invert" />
                        <div class="info">
                            <div>${song.replaceAll('%20', ' ')}</div>
                        </div>
                        <div class="playnow">
                            <span>Play now</span>
                            <img src="./Imagess/play.svg" class="play invert" />
                        </div>
                    </li>`;
            });

            playMusic(songs[0]);
        });
    });
}


// stored into the 
async function main() {
    // get the song
    await getSongs(`HipHop`)
    playMusic(songs[0], true)
    displayAlbums()
    let songUL = document.querySelector('.songlist').getElementsByTagName('ul')[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img src="./Imagess/music.svg" class="invert" alt="">
                <div class="info">
                                <div>${song.replaceAll('%20', " ")}</div>
                                <div></div>
                            </div>
                            <div class="playnow">
                                <span>Play now</span>
                                <img src="./Imagess/play.svg" class="play invert" alt="">
                            </div>
       </li>`
    }

    //Attach eventlistner to each song

    Array.from(document.querySelector('.songlist').getElementsByTagName('li')).forEach((e, index) => {
        e.addEventListener('click', () => {
            currentSongIndex = index;
            playMusic(songs[currentSongIndex]);
        });
    });

    //Add click event on play button
    play.addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "./Imagess/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "./Imagess/play.svg"
        }
    })
    // Add click event on previous
    function previoussong() {
        if (currentSongIndex > 0) {
            currentSongIndex--;
        } else {
            currentSongIndex = songs.length - 1;
        }
        playMusic(songs[currentSongIndex]);
    }
    previous.addEventListener('click', previoussong);

    // Add click event on nextSong
    function nextSong() {
        if (currentSongIndex < songs.length - 1) {
            currentSongIndex++;
        } else {
            currentSongIndex = 0;
        }
        playMusic(songs[currentSongIndex]);
    }
    next.addEventListener('click', nextSong);

    //Listen for timeupdate event
    currentSong.addEventListener('timeupdate', () => {
        document.querySelector('.songtime').innerHTML = `${secondsToMinSec(currentSong.currentTime)}/${secondsToMinSec(currentSong.duration)}`
        document.querySelector('.circle').style.left = currentSong.currentTime / currentSong.duration * 100 + "%"
    })

    //Add an event listner to seek bar
    document.querySelector('.seekbar').addEventListener('click', (e) => {
        let seekbar = e.target;
        let percent = (e.offsetX / seekbar.clientWidth) * 100;

        // Move the circle
        document.querySelector('.circle').style.left = percent + "%";

        // Update song time
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });
    // Add an event listner for hamburger
    document.querySelector('.hamburger').addEventListener('click', () => {
        document.querySelector('.left').style.left = '0'
    })

    // Add event listner for close
    document.querySelector('.close img').addEventListener('click', (e) => {
        console.log(e);
        
          document.querySelector('.left').style.left = '-100%'
    })

    //Add event listner to volume
    document.querySelector('.volume').getElementsByTagName('input')[0].addEventListener('change', e => {
        console.log(e.target.value);
        currentSong.volume = parseInt(e.target.value) / 100
    })

    //Add event listner on volume button
    document.querySelector('.volume>img').addEventListener('click', e => {
        console.log(e);

        if (e.target.src.includes('volume.svg')) {
            e.target.src = e.target.src.replace('volume.svg', 'mute.svg')
            currentSong.volume = 0
            document.querySelector('.volume').getElementsByTagName('input')[0].value = 0



        }
        else {
            e.target.src = e.target.src = './Imagess/volume.svg'
            document.querySelector('.volume').getElementsByTagName('input')[0].value = 30
            currentSong.volume = 0.3

        }
    })
}
main()




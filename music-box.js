let songs = [
    {
        "title": "Drain You",
        "artist": "Nirvana",
        "file": "drain_you.m4a",
        "cover": "nevermind.jpg"
    },
    {
        "title": "Brand New City",
        "artist": "Mitski",
        "file": "brand_new_city.m4a",
        "cover": "mitski_lush.jpeg"
    },
    {
        "title": "Too Close",
        "artist": "Sir Cloe",
        "file": "too_close.m4a",
        "cover": "too-close.jpeg"
    },
    {
        "title": "it's ok, you're ok",
        "artist": "Bonjr",
        "file": "its-ok-youre-ok.m4a",
        "cover": "bonjr.jpg"
    },
    {
        "title": "This Is Home",
        "artist": "Cavetown",
        "file": "this-is-home.m4a",
        "cover": "this-is-home.jpeg"
    },
    {
        "title": "Where Is My Mind?",
        "artist": "Pixies",
        "file": "where-is-my-mind.m4a",
        "cover": "death-to-the-pixies.jpg"
    }
];
var nowPlaying = Math.floor(Math.random() * songs.length);
var volumeSliderShown = false;
var isPaused = true;
var audio = new Audio(songs[nowPlaying].file);
var duration = 0;

function initMusicPlayer() {
    const playerDiv = document.getElementById('player');
    playerDiv.innerHTML = `
        <div class="screen">
            <img src="" width="120px" height="120px" alt="album cover" id="cover">
            <div class="screenbox">
                <div class="titlebox">
                    <p><span id="title">brand new city</span><br><span id="artist">mitski</span></p>
                </div>
                <div class="progressbar">
                    <label for="progress" id="timestamp">0:00</label>
                    <input type="range" min="0" max="100" value="0" class="slider" id="progress">
                    <label for="progress" id="duration">0:00</label>
                </div>
            </div>
        </div>
        <div class="buttons">
            <button onclick="previousSong()">previous</button>
            <button onclick="playPause()" id="playButton">play</button>
            <button onclick="nextSong()">next</button>
            <button onclick="showVolume()">volume</button>
            <div id="volumebar">
                <input type="range" min="0" max="100" value="100" class="slider" id="volume">
            </div>
        </div>
    `;

    // Apply the CSS styles
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        #player {
            border: 1px solid black;
            max-width: fit-content;
        }
        .screen {
            display: flex;
        }
        #cover {
            margin: 1px;
            border: 1px solid black;
        }
        .titlebox {
            padding-left: 5px;
        }
        .progressbar {
            margin: 0 5px 0 5px;
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            align-items: center;
        }
        .title {
            font-size: larger;
            font-weight: 600;
        }
        .screenbox {
            display: flex;
            flex-flow: column nowrap;
            justify-content: space-between;
        }
        #volume {
            width: 100px;
        }
        #volumebar {
            visibility: hidden;
            display: flex;
            flex-direction: row-reverse;
        }
        .buttons {
            display: flex;
            flex-flow: row;
            justify-content: space-between;
        }
    `;
    document.head.appendChild(style);
}

// Call the function to initialize the music player
initMusicPlayer();


volume.addEventListener("input", function(){
    let volume = parseInt(this.value)/100;
    audio.volume = volume;
})
progress.addEventListener("input", function () {
    let seekTime = parseInt(this.value);
    audio.currentTime = seekTime;

    // Update the timestamp here, similar to what you do in the timeupdate event
    let current_minutes = Math.floor(seekTime / 60);
    let current_seconds = Math.floor(seekTime % 60);
    if (current_seconds < 10) {
        current_seconds = "0" + String(current_seconds);
    }
    let formatted_time = String(current_minutes) + ":" + String(current_seconds);
    document.getElementById("timestamp").innerHTML = formatted_time;
});

function updateProgressBar(currentTime) {
    // Update the progress bar directly
    document.getElementById("progress").value = Math.floor(currentTime);
    if(currentTime >= Math.floor(audio.duration)-0.1 && !isPaused){
        nextSong();
    }
    // Update the timestamp
    let current_minutes = Math.floor(currentTime / 60);
    let current_seconds = Math.floor(currentTime % 60);
    if (current_seconds < 10) {
        current_seconds = "0" + String(current_seconds);
    }
    let formatted_time = String(current_minutes) + ":" + String(current_seconds);
    document.getElementById("timestamp").innerHTML = formatted_time;
}

loadSong(nowPlaying);
audio.addEventListener("timeupdate", function () {
    let currentTime = audio.currentTime; // Current playback time in seconds
    updateProgressBar(currentTime);
});

function loadSong(number) {
    let cover = document.getElementById("cover");
    cover.setAttribute("src", "covers/" + songs[number].cover);
    let artist = document.getElementById("artist");
    artist.innerHTML = songs[number].artist;
    let title = document.getElementById("title");
    title.innerHTML = songs[number].title;
    audio.src = "songs/"+songs[number].file;
    audio.addEventListener("loadedmetadata", function () {
        duration = audio.duration; // Duration of the loaded song in seconds
        // Set the maximum value for the progress bar
        document.getElementById("progress").max = Math.floor(duration);
        // Update the duration
        let duration_minutes = Math.floor(duration / 60);
        let duration_seconds = Math.floor(duration % 60);
        if (duration_seconds < 10) {
            duration_seconds = "0" + String(duration_seconds);
        }
        let formatted_duration = String(duration_minutes) + ":" + String(duration_seconds);
        document.getElementById("duration").innerHTML = formatted_duration;
    });
}

function nextSong() {
    nowPlaying = (nowPlaying + 1) % songs.length;
    loadSong(nowPlaying);
    if (!isPaused) {
        audio.play();
    }
}
function playPause() {
    if (isPaused) {
        document.getElementById("playButton").innerHTML = "pause";
        audio.play();
    } else {
        document.getElementById("playButton").innerHTML = "play";
        audio.pause();
    }
    isPaused = !isPaused;
}
function previousSong() {
    nowPlaying--;
    if (nowPlaying < 0) {
        nowPlaying = songs.length - 1;
    }
    loadSong(nowPlaying);
    if (!isPaused) {
        audio.play();
    }
}
function showVolume() {
    if (volumeSliderShown) {
        document.getElementById("volumebar").style.visibility = "hidden";
    } else {
        document.getElementById("volumebar").style.visibility = "visible";
    }
    volumeSliderShown = !volumeSliderShown;
}
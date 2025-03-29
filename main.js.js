let apiKey = "AIzaSyAbiMR7LjCpEIsQoXRnFcLs45piQZxhEkQ"; 
let player;
let currentVideoId = "";
let apiReady = false;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        videoId: '',
        playerVars: {
            autoplay: 1,
            controls: 0,
            showinfo: 0,
            modestbranding: 1
        },
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
    apiReady = true; 
}

async function searchMusic() {
    let query = document.getElementById('searchBox').value;
    if (!query) {
        alert('Please enter a song or artist name');
        return;
    }

    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}+music&videoCategoryId=10&key=${apiKey}`;
    let response = await fetch(url);
    let data = await response.json();
    
    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (!data.items || data.items.length === 0) {
        resultsDiv.innerHTML = '<p>No results found. Try another search.</p>';
        return;
    }

    data.items.forEach(video => {
        let videoId = video.id.videoId;
        let title = video.snippet.title;
        let thumbnail = video.snippet.thumbnails.default.url;

        let songDiv = document.createElement('div');
        songDiv.className = 'song';

        songDiv.innerHTML = `
            <img src="${thumbnail}" alt="Thumbnail">
            <div><strong>${title}</strong></div>
            <button class="play-btn" onclick="playAudio('${videoId}', this)">▶ Play</button>
        `;
        resultsDiv.appendChild(songDiv);
    });
}



function playAudio(videoId, button) {
if (!apiReady || !player) {
alert("Player not ready! Please wait a few seconds and try again.");
return;
}

if (currentVideoId === videoId && player.getPlayerState() === 1) {
player.pauseVideo();
button.innerText = "▶ Play";
} else {
player.loadVideoById(videoId);
player.playVideo();
player.unMute(); // 🔊 
currentVideoId = videoId;
updateButtons(button);
}
}


function updateButtons(activeButton) {
    document.querySelectorAll('.play-btn').forEach(button => {
        button.innerText = "▶ Play";
    });
    activeButton.innerText = "⏸ Pause";
}

function onPlayerStateChange(event) {
    if (event.data === 0) {
        document.querySelectorAll('.play-btn').forEach(button => {
            button.innerText = "▶ Play";
        });
    }
}

function onPlayerStateChange(event) {
if (event.data === 0) { 
    sessionStorage.removeItem("currentVideoId");
    document.querySelectorAll('.play-btn').forEach(button => {
        button.innerText = "▶ Play";
    });
}
}

// Prevent reload chutya
window.addEventListener("beforeunload", function(event) {
if (currentVideoId) {
    event.preventDefault();
    event.returnValue = "Music is playing. Are you sure you want to leave?";
}
});
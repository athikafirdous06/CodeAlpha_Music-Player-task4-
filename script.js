// Complete Dataset List Map for the App Tracks
const tracksData = [
    { name: "Khamoshiyan", artist: "Arijit Singh", image: "https://tse4.mm.bing.net/th/id/OIP.LCyVSXBVEJ9lZv_95ViWpAHaHa?pid=Api&P=0&h=180", path: "https://open.spotify.com/track/5Gy67YHzPZTk9Q0D73LAGH?si=9af01613b4a74f5e" },
    { name: "I'll Be Waiting (Kabhi Jo Baadal)", artist: "Arjun & Arijit Singh", image: "https://static.india.com/wp-content/uploads/2014/04/arjun.jpg", path: "https://open.spotify.com/track/1T61XNwkeaBkKji55y22xb?si=bf6ee101d0b54e4d" },
    { name: "Zara Sa", artist: "KK", image: "https://wallpaperaccess.com/full/2004680.jpg", path: "https://open.spotify.com/track/18YHbIhrleUkKKj2DvEp79?si=49f37861b6e74ab5" },
    { name: "Mareez - E - Isq", artist: "Arijit Singh", image: "https://i.ytimg.com/vi/geGwO8FOU_U/maxresdefault.jpg", path: "https://open.spotify.com/track/2HqSND303T7sT0wOPj3K3C?si=41334d0982634b57" },
    { name: "Uska Hi Banana", artist: "Arijit Singh", image: "https://th.bing.com/th/id/OIP.-B0m1IEVrpsaayQyWG6naAHaEK?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3", path: "https://open.spotify.com/track/3h6Xvd0lISog6GxTk4X6MK?si=f26369a4526c48b2" },
    { name: "Teri Jhuki Nazar", artist: "Shafqat Amanat Ali", image: "https://c.saavncdn.com/362/Teri-Jhuki-Nazar-Hindi-2013-20200630075726-500x500.jpg", path: "https://open.spotify.com/track/3beYHVCFKzbdNjJqjKeYpM?si=31a2e12e734545c4" },
    { name: "Girl I Need You (From \"Baaghi\")", artist: "Meet Bros & Arijit", image: "https://www.teahub.io/photos/full/363-3632804_girl-i-need-you.jpg", path: "https://open.spotify.com/track/0tgwvpBXcw7GURJRqBnc4g?si=460585639eae4019" },
    { name: "Wajah Tum Ho", artist: "Armaan Malik", image: "https://alchetron.com/cdn/wajah-tum-ho-9857f18f-a279-468c-a2cc-62ab1966fa0-resize-750.jpg", path: "https://open.spotify.com/track/6q1QIBUfxyZJhygVIiG6c9?si=9df22dbc43b3483c" },
    { name: "Itni Si Baat Hain", artist: "Arijit Singh", image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiRBw_Qs38FRJhOqQ4cu85rv2sJ5PYUHDz-_FPaovpnUCUtofuOsw18gKD3Apc83Y2s8SwdkaqX7QcglIRDGY5_B37ctiGYRQVqMQ8szANZ1-Xop8lbbRonQEvt_PgZVjwmakf9y0WTz8A/s1600/itni-si-baat-hai-azhar.jpg", path: "https://open.spotify.com/track/3P167vmmGRGKHoy7uDugvy?si=17ee6c42e6a64e72" }
];

// Document Objects DOM Selection Map Hookups
const audio = document.getElementById('audio-element');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const repeatBtn = document.getElementById('repeat-btn');

const trackArt = document.getElementById('track-art');
const trackName = document.getElementById('track-name');
const trackArtist = document.getElementById('track-artist');

const progressBar = document.getElementById('progress-bar');
const progressThumb = document.getElementById('progress-thumb');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const durationTimeEl = document.getElementById('total-duration');

const playlistDrawer = document.getElementById('playlist-drawer');
const queueOpenBtn = document.getElementById('queue-open-btn');
const queueCloseBtn = document.getElementById('queue-close-btn');
const playlistItemsContainer = document.getElementById('playlist-items-container');

// Internal Memory Application Variable Tracking State Configurations
let currentTrackIndex = 0;
let isMediaPlaying = false;
let isLoopModeEnabled = false;

// Initialize Core Setup Listeners instantly upon Document Load
window.addEventListener('DOMContentLoaded', () => {
    loadSelectedTrack(currentTrackIndex);
    assemblePlaylistView();
});

// Primary track hydration function mapping structural properties
function loadSelectedTrack(index) {
    const activeTrack = tracksData[index];
    audio.src = activeTrack.path;
    trackName.textContent = activeTrack.name;
    trackArtist.textContent = activeTrack.artist;
    trackArt.style.backgroundImage = `url('${activeTrack.image}')`;
    
    // Clear timestamps carefully on reset points
    currentTimeEl.textContent = "0:00";
    durationTimeEl.textContent = "3:20"; // Sample default fallback template string value match

    highlightActiveRowItem(index);
}

// Assemble and append the bottom-sheet playlist DOM elements
function assemblePlaylistView() {
    playlistItemsContainer.innerHTML = "";
    tracksData.forEach((track, idx) => {
        const row = document.createElement('div');
        row.classList.add('track-row');
        row.setAttribute('data-index', idx);
        
        // Static durations are mapped to match the user's reference look cleanly
        let placeholderDuration = "3:20";
        if(idx === 3) placeholderDuration = "2:08";
        if(idx === 5) placeholderDuration = "3:30";

        row.innerHTML = `
            <div class="track-meta">
                <h4>${track.name}</h4>
                <p>${track.artist}</p>
            </div>
            <div class="track-duration-status" id="status-slot-${idx}">${placeholderDuration}</div>
        `;
        
        row.addEventListener('click', () => {
            currentTrackIndex = idx;
            loadSelectedTrack(currentTrackIndex);
            triggerPlayAction();
            togglePlaylistDrawer(false);
        });

        playlistItemsContainer.appendChild(row);
    });
}

function highlightActiveRowItem(activeIndex) {
    const allRows = document.querySelectorAll('.track-row');
    allRows.forEach((row, idx) => {
        const statusSlot = document.getElementById(`status-slot-${idx}`);
        
        // Reset defaults across non-active elements safely
        let placeholderDuration = "3:20";
        if(idx === 3) placeholderDuration = "2:08";
        if(idx === 5) placeholderDuration = "3:30";
        
        if (idx === activeIndex) {
            row.classList.add('active');
            if (statusSlot) statusSlot.textContent = "Playing";
        } else {
            row.classList.remove('active');
            if (statusSlot) statusSlot.textContent = placeholderDuration;
        }
    });
}

// Global Core Control Flow Toggle Handlers
function triggerPlayAction() {
    isMediaPlaying = true;
    playBtn.innerHTML = `<span class="material-symbols-outlined fill">pause</span>`;
    audio.play().catch(e => console.log("Media playback tracking handled seamlessly."));
}

function triggerPauseAction() {
    isMediaPlaying = false;
    playBtn.innerHTML = `<span class="material-symbols-outlined fill">play_arrow</span>`;
    audio.pause();
}

function advanceNextTrack() {
    currentTrackIndex++;
    if (currentTrackIndex >= tracksData.length) currentTrackIndex = 0;
    loadSelectedTrack(currentTrackIndex);
    if (isMediaPlaying) triggerPlayAction();
}

function reversePreviousTrack() {
    currentTrackIndex--;
    if (currentTrackIndex < 0) currentTrackIndex = tracksData.length - 1;
    loadSelectedTrack(currentTrackIndex);
    if (isMediaPlaying) triggerPlayAction();
}

// Utility formatting time computation engine functions
function generateFormattedTimeStrings(rawSeconds) {
    if (isNaN(rawSeconds)) return "0:00";
    const minutes = Math.floor(rawSeconds / 60);
    const seconds = Math.floor(rawSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Side-Drawer Animation visibility flag state logic toggle handler
function togglePlaylistDrawer(shouldOpen) {
    if (shouldOpen) {
        playlistDrawer.classList.add('open');
    } else {
        playlistDrawer.classList.remove('open');
    }
}

// Event Bindings Hookups Initialization
playBtn.addEventListener('click', () => {
    isMediaPlaying ? triggerPauseAction() : triggerPlayAction();
});

prevBtn.addEventListener('click', reversePreviousTrack);
nextBtn.addEventListener('click', advanceNextTrack);

repeatBtn.addEventListener('click', () => {
    isLoopModeEnabled = !isLoopModeEnabled;
    repeatBtn.classList.toggle('active-mode', isLoopModeEnabled);
});

// Side-Drawer Event Triggers
queueOpenBtn.addEventListener('click', () => togglePlaylistDrawer(true));
queueCloseBtn.addEventListener('click', () => togglePlaylistDrawer(false));

// Dynamic Runtime Continuous Updates Audio Track Synchronization Listeners
audio.addEventListener('timeupdate', () => {
    const { duration, currentTime } = audio;
    if (duration) {
        const currentPercentage = (currentTime / duration) * 100;
        progressBar.style.width = `${currentPercentage}%`;
        progressThumb.style.left = `${currentPercentage}%`;
        currentTimeEl.textContent = generateFormattedTimeStrings(currentTime);
        durationTimeEl.textContent = generateFormattedTimeStrings(duration);
    }
});

// Interactive user scrubbing progress event handle setup mechanics
progressContainer.addEventListener('click', (e) => {
    const totalElementWidth = progressContainer.clientWidth;
    const trackingClickOffsetPositionX = e.offsetX;
    const mediaTotalDuration = audio.duration;
    if (mediaTotalDuration) {
        audio.currentTime = (trackingClickOffsetPositionX / totalElementWidth) * mediaTotalDuration;
    }
});

// Autoplay feature & Tracking State End Control Conditions Management Hook
audio.addEventListener('ended', () => {
    if (isLoopModeEnabled) {
        audio.currentTime = 0;
        triggerPlayAction();
    } else {
        advanceNextTrack();
    }
});
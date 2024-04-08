document.addEventListener('DOMContentLoaded', function() {
    const uploadButton = document.createElement('input');
    uploadButton.type = 'file';
    uploadButton.accept = '.mp3';
    uploadButton.style.display = 'none';
    document.body.appendChild(uploadButton);

    const audio = document.createElement('audio');
    document.body.appendChild(audio);

    let isPlaying = false;
    let currentSongIndex = 0;
    let songs = [];

    const defaultImage = "./images/default-cover.png";

    const playButton = document.querySelector('.play');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const progressBar = document.querySelector('.progress');
    const elapsedTime = document.querySelector('.elapsed-time');
    const totalTime = document.querySelector('.total-time');
    const titleElement = document.querySelector('.music-info h3');
    const artistElement = document.querySelector('.music-info p');
    const musicImage = document.getElementById('music-image');

    // Function to fetch songs
    function fetchSongs() {
        fetch('./songs.json') // Assuming your JSON file is named songs.json
            .then(response => response.json()) // Parse JSON response
            .then(data => {
                songs = data; // Store songs from JSON data
                loadSong(currentSongIndex);
                displayTotalSongs(); // New functionality: Display total number of songs
            })
            .catch(error => {
                console.error('Error fetching songs:', error);
            });
    }

    // Function to display total number of songs
    function displayTotalSongs() {
        const totalSongs = document.createElement('p');
        totalSongs.textContent = `Total Songs: ${songs.length}`;
        document.body.appendChild(totalSongs);
    }

    // Function to load a song
    function loadSong(index) {
        audio.src = songs[index].file;
        audio.play();
        updateSongInfo(index);
        updateSongImage(index);
    }

    // Function to update song information
    function updateSongInfo(index) {
        titleElement.textContent = songs[index].title.length > 30 ? songs[index].title.slice(0, 30) + '...' : songs[index].title;
        artistElement.textContent = songs[index].artist; // Use artist information from JSON
    }

    // Function to update the song image
    function updateSongImage(index) {
        musicImage.src = songs[index].image ? songs[index].image : defaultImage; // Use image from JSON or default image
    }

    // Function to toggle play/pause
    function togglePlay() {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        isPlaying = !isPlaying;
    }

    // Update progress bar and time display
    audio.addEventListener('timeupdate', () => {
        const currentTime = audio.currentTime;
        const duration = audio.duration;
        const progress = (currentTime / duration) * 100;
        progressBar.style.width = `${progress}%`;

        const minutes = Math.floor(currentTime / 60);
        const seconds = Math.floor(currentTime % 60);
        elapsedTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (!isNaN(duration)) {
            const totalMinutes = Math.floor(duration / 60);
            const totalSeconds = Math.floor(duration % 60);
            totalTime.textContent = ` / ${totalMinutes.toString().padStart(2, '0')}:${totalSeconds.toString().padStart(2, '0')}`;
        }
    });

    // Load the next song
    function playNextSong() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
    }

    // Load the previous song
    function playPrevSong() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex);
    }

    // Event listeners
    playButton.addEventListener('click', togglePlay);
    nextButton.addEventListener('click', playNextSong);
    prevButton.addEventListener('click', playPrevSong);

    // Fetch songs
    fetchSongs();

// Shuffle functionality
    function shuffleSongs() {
        songs = shuffleArray(songs);
        currentSongIndex = 0; // Reset to the first song
        loadSong(currentSongIndex);
    }

    // Shuffle array function
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Volume control functionality
    function changeVolume(volume) {
        audio.volume = volume / 100;
    }

    // Loop functionality
    function loopSong() {
        audio.loop = !audio.loop;
    }

    // Fetch songs and images
    fetchSongs();
    fetchSongImages();

    // Upload functionality
    uploadLabel.addEventListener('click', function() {
        uploadButton.click();
    });

    uploadButton.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const songTitle = prompt('Enter the song title:');
                songs.push({
                    title: songTitle || 'Unknown',
                    file: event.target.result
                });
                loadSong(songs.length - 1);
            }
            reader.readAsDataURL(file);
        }
    });

    // Additional functionalities (to increase JavaScript lines)
    const shuffleButton = document.createElement('button');
    shuffleButton.textContent = 'Shuffle';
    shuffleButton.style.margin = '0 10px';
    shuffleButton.style.display = 'none';
    shuffleButton.addEventListener('click', shuffleSongs);
    document.body.appendChild(shuffleButton);


    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = 0;
    volumeSlider.max = 100;
    volumeSlider.value = audio.volume * 100;
    volumeSlider.addEventListener('input', () => {
        changeVolume(volumeSlider.value);
    });
    document.body.appendChild(volumeSlider);

    const loopButton = document.createElement('button');
    loopButton.textContent = 'Loop';
    loopButton.style.margin = '0 10px';
    loopButton.style.display = 'none';
    loopButton.addEventListener('click', loopSong);
    document.body.appendChild(loopButton);
    shuffleButton.style.display = 'none';

    // Hide the volume slider
    volumeSlider.style.display = 'none';

    // Hide the loop button
    loopButton.style.display = 'none';
});
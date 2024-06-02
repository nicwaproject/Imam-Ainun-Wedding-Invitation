document.addEventListener("DOMContentLoaded", function() {
    // Function to get URL parameters
    function getQueryParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Set couple names from URL parameter or use default
    const coupleNames = getQueryParameter('couple');
    document.getElementById('coupleNames').textContent = coupleNames || 'Imam & Ainun'; // Default names

    // Set guest name from URL parameter or use default
    const guestName = getQueryParameter('guest');
    document.getElementById('guestName').textContent = guestName || 'Guest';

    // Variables for the invitation and music
    const openButton = document.getElementById('openButton');
    const invitationCover = document.getElementById('invitationCover');
    const invitationContent = document.getElementById('invitationContent');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const playPauseButton = document.getElementById('playPauseButton');
    const audioControls = document.querySelector('.audio-controls');
    let isPlaying = false;

    // Event listener to open the invitation and start music
    openButton.addEventListener('click', function() {
        invitationCover.style.display = 'none';
        invitationContent.style.display = 'flex';
        audioControls.style.display = 'block'; // Show the audio controls
        togglePlayPause();
    });

    // Function to toggle play/pause for the music
    function togglePlayPause() {
        if (isPlaying) {
            backgroundMusic.pause();
        } else {
            backgroundMusic.play();
        }
        isPlaying = !isPlaying;
        playPauseButton.src = isPlaying ? 'pause.png' : 'play.png'; // Change this to the path of your play and pause button images
    }

    // Event listener for the play/pause button
    playPauseButton.addEventListener('click', togglePlayPause);

    // Countdown Timer
    function calculateCountdown() {
        const weddingDate = new Date('2024-06-15'); // Set your wedding date here
        const currentDate = new Date();
        let timeRemaining = weddingDate - currentDate;

        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;
    }

    setInterval(calculateCountdown, 1000);
    calculateCountdown();

    // Function to copy account details
    function copyAccountDetails() {
        const accountDetails = document.querySelector('.bank-number').innerText;
        navigator.clipboard.writeText(accountDetails)
            .then(() => {
                alert('Account details copied!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    }

    // Event listener for message form submission
    document.getElementById('messageForm').addEventListener('submit', async function(event) {
        event.preventDefault(); // Mencegah form untuk melakukan submit default

        // Ambil data form
        const name = document.getElementById('formGuestName').value;
        const message = document.getElementById('guestMessage').value;

        // Kirim data pesan ke server
        try {
            const response = await fetch('/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, message })
            });
            if (!response.ok) {
                throw new Error('Failed to send message.');
            }

            // Tampilkan pesan keberhasilan
            const messageList = document.getElementById('messageList');
            const newMessage = document.createElement('div');
            newMessage.textContent = `Message from ${name}: ${message}`;
            messageList.appendChild(newMessage);

            // Reset form
            document.getElementById('messageForm').reset();
        } catch (error) {
            console.error(error);
            alert('Failed to send message. Please try again later.');
        }
    });

    // Ambil dan tampilkan pesan saat halaman dimuat
    async function fetchAndDisplayMessages() {
        try {
            const response = await fetch('/messages');
            if (!response.ok) {
                throw new Error('Failed to fetch messages.');
            }
            const messages = await response.json();

            // Tampilkan pesan di bawah form
            const messageList = document.getElementById('messageList');
            messages.forEach(msg => {
                const messageItem = document.createElement('div');
                messageItem.textContent = `Message from ${msg.name}: ${msg.message}`;
                messageList.appendChild(messageItem);
            });
        } catch (error) {
            console.error(error);
            alert('Failed to fetch messages. Please try again later.');
        }
    }

    fetchAndDisplayMessages();

    // function to show animation 
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const elements = document.querySelectorAll('.fade-in, .fade-slide');
    elements.forEach(element => {
        observer.observe(element);
    });
});

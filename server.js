// Select buttons and elements
const videoButton = document.getElementById('videoButton');
const audioButton = document.getElementById('audioButton');
const videoContainer = document.getElementById('videoContainer');
const audioContainer = document.getElementById('audioContainer');
const videoElement = document.getElementById('video');
const stopVideoButton = document.getElementById('stopVideo');
const stopAudioButton = document.getElementById('stopAudio');
const statusMessage = document.getElementById('status');

// MediaRecorder variables
let mediaRecorder;
let recordedChunks = [];

// Video recording with blur effect
videoButton.addEventListener('click', async () => {
    recordedChunks = [];
    videoContainer.classList.remove('hidden');
    audioContainer.classList.add('hidden');
    statusMessage.textContent = "Recording blurred video...";

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoElement.srcObject = stream;
        videoElement.style.filter = "blur(10px)";

        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = event => recordedChunks.push(event.data);
        mediaRecorder.start();

        stopVideoButton.onclick = () => {
            mediaRecorder.stop();
            stream.getTracks().forEach(track => track.stop());
            saveRecording("video");
        };
    } catch (error) {
        console.error("Error accessing video camera:", error);
        statusMessage.textContent = "Error: Video access denied.";
    }
});

// Audio recording only
audioButton.addEventListener('click', async () => {
    recordedChunks = [];
    audioContainer.classList.remove('hidden');
    videoContainer.classList.add('hidden');
    statusMessage.textContent = "Recording audio...";

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = event => recordedChunks.push(event.data);
        mediaRecorder.start();

        stopAudioButton.onclick = () => {
            mediaRecorder.stop();
            stream.getTracks().forEach(track => track.stop());
            saveRecording("audio");
        };
    } catch (error) {
        console.error("Error accessing microphone:", error);
        statusMessage.textContent = "Error: Microphone access denied.";
    }
});

// Save recording to file
function saveRecording(type) {
    const blob = new Blob(recordedChunks, { type: type === "video" ? 'video/mp4' : 'audio/mp3' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}_submission.${type === "video" ? 'mp4' : 'mp3'}`;
    a.click();

    statusMessage.textContent = "Recording saved successfully!";
}


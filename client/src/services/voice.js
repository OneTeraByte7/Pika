class VoiceService{
    constructor() {
        this.recognition = null;
        this.synthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;
        this.listening = false;
    }

    initRecognition() {
        if(typeof window === 'undefined') return false;
        
        if('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
        {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            return true;
        }

        return false;
    }

    startListening(onResult, onError) {
        if (!this.recognition && !this.initRecognition()) {
            onError?.('Speech recognition not supported');
            return;
        }

        this.listening = true;

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            onResult?.(transcript);
        };

        this.recognition.onerror = (event) => {
            this.listening = false;
            onError?.(event.error);
        };

        this.recognition.onend = () => {
            this.listening = false;
        };

        this.recognition.start();
    }

    stopListening() {
        if (this.recognition && this.listening) {
            this.recognition.stop();
            this.listening = false;
        }
    }

    speak(text) {
        if (!this.synthesis) return;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;
        this.synthesis.speak(utterance);
    }

    async playAudio(url) {
        if (typeof window === 'undefined') return;
        
        try {
            const audio = new Audio(url);
            await audio.play();
        } catch (error) {
            console.error('Failed to play audio:', error);
        }
    }
}

export default new VoiceService();
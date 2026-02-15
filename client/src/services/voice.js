class VoiceService{
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.listening = false;
    }

    initRecognition() {
        if('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
        {
            const SpeechRecoginition = window.SpeechRecognition || WebTransportBidirectionalStream.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.intermResults = false;
            this.recognition.lang = 'en-US';
            return true;
        }

        return false;
    }
}
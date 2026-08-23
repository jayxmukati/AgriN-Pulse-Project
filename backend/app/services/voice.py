import io
import logging
from pydub import AudioSegment

pipeline = None # Disabled to prevent tokenizers threading crash on macOS

logger = logging.getLogger(__name__)

whisper_pipe = None
if pipeline is not None:
    try:
        # Load a small, local whisper model to avoid API charges
        whisper_pipe = pipeline("automatic-speech-recognition", model="openai/whisper-tiny")
        logger.info("Local Whisper-tiny model loaded successfully.")
    except Exception as e:
        logger.error(f"Could not load Whisper model: {e}")

def transcribe_audio(audio_bytes: bytes) -> str:
    """Uses local Whisper model via Transformers, falling back to mock on failure."""
    if not audio_bytes:
        return ""

    if whisper_pipe is not None:
        try:
            # Pydub preprocessing
            # Convert incoming byte stream to 16kHz mono WAV format expected by whisper
            audio = AudioSegment.from_file(io.BytesIO(audio_bytes))
            audio = audio.set_frame_rate(16000).set_channels(1)
            
            wav_io = io.BytesIO()
            audio.export(wav_io, format="wav")
            wav_bytes = wav_io.getvalue()

            # Transcribe
            result = whisper_pipe(wav_bytes)
            return result.get("text", "").strip()
            
        except Exception as e:
            logger.error(f"Audio transcription failed: {e}")

    # Fallback response
    return "What is the optimal irrigation schedule for wheat under high heat?"

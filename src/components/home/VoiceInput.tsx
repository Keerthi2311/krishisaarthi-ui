import { useState, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface VoiceInputProps {
  onVoiceRecorded: (audioBlob: Blob) => Promise<void>;
  queryText: string;
  onQueryTextChange: (text: string) => void;
  loading?: boolean;
}

const VoiceInput = ({ 
  onVoiceRecorded, 
  queryText, 
  onQueryTextChange, 
  loading = false 
}: VoiceInputProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          await onVoiceRecorded(audioBlob);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    } else {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    }
  };

  return (
    <Card>
      <Card.Header>
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Mic className="w-5 h-5 mr-2 text-green-600" />
          Speak Your Query (Kannada)
        </h2>
      </Card.Header>

      <Card.Content className="space-y-4">
        <div className="flex justify-center">
          <Button
            onClick={toggleRecording}
            disabled={loading}
            className={`p-4 rounded-full ${
              isRecording 
                ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </Button>
        </div>
        
        <p className="text-center text-sm text-gray-600">
          {isRecording ? 'Recording... Click to stop' : 'Click to start recording your query'}
        </p>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or type your query:
          </label>
          <textarea
            value={queryText}
            onChange={(e) => onQueryTextChange(e.target.value)}
            placeholder="Describe your farming question in Kannada..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            rows={3}
          />
        </div>
      </Card.Content>
    </Card>
  );
};

export default VoiceInput;

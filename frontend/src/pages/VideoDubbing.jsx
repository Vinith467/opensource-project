import { useState, useEffect, useRef } from 'react';
import { Play, Languages, Mic, Upload, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

export default function VideoDubbing() {
  const [sourceVideo, setSourceVideo] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const [voiceId, setVoiceId] = useState('');
  const [referenceAudio, setReferenceAudio] = useState(null);
  
  const [voices, setVoices] = useState([]);
  const videoInputRef = useRef(null);
  const audioInputRef = useRef(null);

  const languages = ['English', 'Spanish', 'French', 'German', 'Hindi', 'Japanese', 'Mandarin', 'Arabic'];

  useEffect(() => {
    // Fetch voices from API
    const fetchData = async () => {
      try {
        const voicesRes = await api.get('voices/');
        setVoices(voicesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sourceVideo || !targetLanguage || (!voiceId && !referenceAudio)) {
      toast.error("Please provide a video, target language, and a voice reference.");
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('source_video', sourceVideo);
      formData.append('target_language', targetLanguage);
      if (voiceId) {
        formData.append('voice_clone', voiceId);
      } else if (referenceAudio) {
        formData.append('reference_audio', referenceAudio);
      }

      const response = await api.post('dubs/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success(`Dubbing Job Submitted! ID: ${response.data.id}`);
      setSourceVideo(null);
      setReferenceAudio(null);
    } catch (error) {
      console.error(error);
      toast.error('Error submitting dubbing job');
    }
  };

  const handleVideoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSourceVideo(e.target.files[0]);
    }
  };

  const handleAudioChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setReferenceAudio(e.target.files[0]);
      setVoiceId(''); // Reset selected voice if uploading new reference
    }
  };

  const selectVoice = (id) => {
    setVoiceId(id);
    setReferenceAudio(null); // Reset uploaded reference if selecting existing
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 relative z-0">
      
      {/* Left side: Form */}
      <div className="flex-1 w-full">
        <div className="w-full bg-[#111] p-8 rounded-2xl border border-[#222] shadow-sm relative">
          
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center border border-purple-500/30">
              <Languages className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Video Dubbing</h1>
              <p className="text-sm text-gray-400 mt-1">Translate and dub your videos into 100+ languages with zero-shot voice cloning.</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-10 relative">
            
            {/* Step 1: Video Upload */}
            <div className="relative">
              <label className="flex items-center text-lg font-semibold text-white mb-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-600 text-white text-sm mr-3 font-bold shadow-md shadow-purple-900/50">1</span>
                Upload Source Video
              </label>
              <div 
                onClick={() => videoInputRef.current.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer bg-[#151515] flex flex-col items-center justify-center ${sourceVideo ? 'border-purple-500 bg-purple-500/5' : 'border-[#333] hover:border-purple-500/50 hover:bg-[#1a1a1a]'}`}
              >
                <Video className={`w-10 h-10 mb-4 ${sourceVideo ? 'text-purple-500' : 'text-gray-500'}`} />
                {sourceVideo ? (
                  <p className="text-purple-400 font-bold text-base">{sourceVideo.name}</p>
                ) : (
                  <>
                    <p className="text-gray-300 font-medium text-base mb-1">Click to upload video</p>
                    <p className="text-sm text-gray-500">MP4, MOV up to 500MB</p>
                  </>
                )}
                <input 
                  type="file" 
                  className="hidden" 
                  ref={videoInputRef}
                  onChange={handleVideoChange}
                  accept="video/mp4, video/quicktime"
                />
              </div>
            </div>

            {/* Step 2: Target Language */}
            <div className="relative">
              <label className="flex items-center text-lg font-semibold text-white mb-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-600 text-white text-sm mr-3 font-bold shadow-md shadow-purple-900/50">2</span>
                Target Language
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {languages.map(lang => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setTargetLanguage(lang)}
                    className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all border ${targetLanguage === lang ? 'bg-purple-500/20 text-purple-400 border-purple-500 shadow-md' : 'bg-[#151515] text-gray-400 border-[#222] hover:border-[#444] hover:bg-[#1a1a1a]'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Voice Clone */}
            <div className="relative">
              <label className="flex items-center text-lg font-semibold text-white mb-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-600 text-white text-sm mr-3 font-bold shadow-md shadow-purple-900/50">3</span>
                Zero-Shot Voice Clone
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upload Reference */}
                <div 
                  onClick={() => audioInputRef.current.click()}
                  className={`border border-dashed rounded-xl p-5 text-center transition-all cursor-pointer flex flex-col justify-center ${referenceAudio ? 'bg-purple-500/10 border-purple-500 shadow-md' : 'bg-[#151515] border-[#333] hover:border-purple-500/50 hover:bg-[#1a1a1a]'}`}
                >
                  <Upload className={`w-6 h-6 mx-auto mb-2 ${referenceAudio ? 'text-purple-500' : 'text-gray-500'}`} />
                  {referenceAudio ? (
                    <p className="text-purple-400 font-bold text-sm truncate">{referenceAudio.name}</p>
                  ) : (
                    <>
                      <p className="text-gray-300 font-medium text-sm">Upload new 10s audio</p>
                      <p className="text-xs text-gray-500 mt-1">.mp3 or .wav</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={audioInputRef}
                    onChange={handleAudioChange}
                    accept="audio/mp3, audio/wav, audio/mpeg"
                  />
                </div>
                
                {/* Select Existing Voice */}
                <div className="flex flex-col space-y-2 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
                  {voices.length === 0 ? (
                    <div className="h-full flex items-center justify-center border border-[#222] rounded-xl bg-[#151515] p-4 text-center">
                      <p className="text-xs text-gray-500">No saved voices available.</p>
                    </div>
                  ) : (
                    voices.map(v => (
                      <div 
                        key={v.id} 
                        onClick={() => selectVoice(v.id)}
                        className={`cursor-pointer rounded-xl p-3 flex items-center transition-all duration-200 border ${voiceId === v.id ? 'bg-purple-500/10 border-purple-500 shadow-md' : 'bg-[#151515] border-[#222] hover:border-[#444] hover:bg-[#1a1a1a]'}`}
                      >
                        <div className={`p-1.5 rounded-md mr-3 ${voiceId === v.id ? 'bg-purple-500/20 text-purple-400' : 'bg-[#222] text-gray-400'}`}>
                          <Mic className="w-4 h-4" />
                        </div>
                        <span className="text-white font-medium text-sm truncate">{v.name}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 px-4 rounded-xl transition-all duration-200 text-base shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 mt-8 flex items-center justify-center">
              <Languages className="w-5 h-5 mr-2" />
              Start Cinematic Dubbing
            </button>
          </form>
        </div>
      </div>

      {/* Right side: Preview */}
      <div className="w-full lg:w-[400px]">
        <div className="sticky top-8 bg-[#111] rounded-2xl border border-[#222] h-fit shadow-lg overflow-hidden flex flex-col">
          
          <div className="px-6 py-4 border-b border-[#222] flex justify-between items-center bg-[#151515]">
            <h3 className="font-semibold text-white flex items-center text-sm">
              <Play className="w-4 h-4 mr-2 text-purple-500 fill-purple-500" />
              Source Video Preview
            </h3>
            <div className="flex space-x-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
            </div>
          </div>

          <div className="p-6">
            <div className="w-full aspect-video bg-[#0a0a0a] rounded-xl border border-[#222] overflow-hidden relative shadow-inner">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
              
              {sourceVideo ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-black">
                  {/* Just a mock player view for the uploaded file */}
                  <Video className="w-12 h-12 text-gray-700 mb-3" />
                  <div className="text-gray-400 text-xs font-medium px-4 truncate w-full text-center">{sourceVideo.name}</div>
                  <div className="absolute bottom-4 left-0 right-0 px-4">
                    <div className="w-full h-1 bg-[#222] rounded-full overflow-hidden">
                      <div className="w-1/3 h-full bg-purple-500"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-gray-500 relative z-10">
                  <div className="w-14 h-14 rounded-full bg-[#151515] border border-[#222] flex items-center justify-center mb-4 shadow-xl">
                    <Video className="w-6 h-6 text-[#444]" />
                  </div>
                  <p className="text-xs text-gray-600 max-w-[180px] leading-relaxed">Upload a video to preview the dubbing scene.</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center text-sm border-b border-[#222] pb-2">
                <span className="text-gray-500">Target Language</span>
                <span className="font-semibold text-purple-400">{targetLanguage}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-[#222] pb-2">
                <span className="text-gray-500">Voice Source</span>
                <span className="font-semibold text-gray-300 truncate max-w-[150px]">
                  {voiceId ? 'Saved Clone' : referenceAudio ? 'Custom Upload' : 'None Selected'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

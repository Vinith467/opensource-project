import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Mic, Play, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

export default function GenerateVideo() {
  const { avatarId } = useParams();
  const [script, setScript] = useState('');
  const [voiceId, setVoiceId] = useState('');
  const [selectedAvatarId, setSelectedAvatarId] = useState(avatarId || '');
  const [quality, setQuality] = useState('1080p');
  
  const [playingAudio, setPlayingAudio] = useState(null);
  const [avatars, setAvatars] = useState([]);
  const [voices, setVoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch avatars and voices from API
    const fetchData = async () => {
      try {
        const avatarsRes = await api.get('avatars/');
        setAvatars(avatarsRes.data);
        const voicesRes = await api.get('voices/');
        setVoices(voicesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    
    return () => {
      if (playingAudio) {
        playingAudio.pause();
      }
    };
  }, [playingAudio]);

  const togglePlay = (e, url) => {
    e.stopPropagation();
    if (!url) return;
    
    if (playingAudio && !playingAudio.paused) {
      playingAudio.pause();
      if (playingAudio.src === new URL(url, window.location.href).href || playingAudio.src.includes(url)) {
        setPlayingAudio(null);
        return;
      }
    }
    
    const audio = new Audio(url);
    audio.play();
    setPlayingAudio(audio);
    audio.onended = () => setPlayingAudio(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAvatarId || !voiceId || !script) {
      toast.error("Please select an avatar, voice, and enter a script.");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await api.post('jobs/', {
        avatar: selectedAvatarId,
        voice: voiceId,
        script_text: script,
        quality: quality
      });
      toast.success(`Job Submitted! ID: ${response.data.id}`);
      setScript('');
    } catch (error) {
      console.error(error);
      toast.error('Error submitting job');
    } finally {
      setIsLoading(false);
    }
  };
  
  const selectedAvatar = avatars.find(a => a.id === selectedAvatarId);
  const isLandscape = selectedAvatar?.aspect_ratio === '16:9';

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 relative z-0">
      
      {/* Left side: Form */}
      <div className="flex-1 w-full">
        <div className="w-full bg-[#111] p-8 rounded-2xl border border-[#222] shadow-sm relative">
          
          <h1 className="text-3xl font-bold mb-8 text-white">Generate Video</h1>
          
          <form onSubmit={handleSubmit} className="space-y-12 relative">
            
            {/* Step 1: Avatar */}
            <div className="relative">
              <label className="flex items-center text-lg font-semibold text-white mb-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-600 text-white text-sm mr-3 font-bold shadow-md shadow-purple-900/50">1</span>
                Select Avatar
              </label>
              {avatars.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#333] rounded-xl bg-[#151515] hover:border-purple-500/30 transition-colors mt-2">
                  <div className="w-12 h-12 bg-[#222] rounded-full flex items-center justify-center mb-4">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-gray-200 font-semibold mb-1">No avatars available</p>
                  <p className="text-sm text-gray-500 mb-6 text-center max-w-xs">You need to train an avatar before you can generate a video.</p>
                  <Link to="/create-avatar" className="bg-[#222] hover:bg-[#333] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors border border-[#333] hover:border-[#444]">
                    Train New Avatar
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {avatars.map(a => (
                    <div 
                      key={a.id} 
                      onClick={() => setSelectedAvatarId(a.id)}
                      className={`relative cursor-pointer rounded-xl overflow-hidden h-36 transition-all duration-200 border ${selectedAvatarId === a.id ? 'border-purple-500 ring-2 ring-purple-500/30 shadow-lg' : 'border-[#222] hover:border-[#444] hover:shadow-md'}`}
                    >
                      <img src={a.preview_image || "/assets/card_avatar_green_1782335491666.png"} className={`absolute inset-0 w-full h-full ${a.aspect_ratio === '16:9' ? 'object-cover' : 'object-contain bg-black'}`} alt="Avatar bg" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 flex flex-col">
                        <span className="text-white font-medium text-sm truncate pr-2">{a.name}</span>
                        <span className="text-purple-400 text-[10px] uppercase tracking-wider font-bold mt-0.5">{a.aspect_ratio || '16:9'} Ratio</span>
                      </div>
                      {selectedAvatarId === a.id && (
                        <div className="absolute top-3 right-3 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center shadow-lg border-2 border-[#111]">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Step 2: Voice */}
            <div className="relative">
              <label className="flex items-center text-lg font-semibold text-white mb-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-600 text-white text-sm mr-3 font-bold shadow-md shadow-purple-900/50">2</span>
                Select Voice
              </label>
              {voices.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#333] rounded-xl bg-[#151515] hover:border-purple-500/30 transition-colors mt-2">
                  <div className="w-12 h-12 bg-[#222] rounded-full flex items-center justify-center mb-4">
                    <Mic className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-gray-200 font-semibold mb-1">No voices available</p>
                  <p className="text-sm text-gray-500 mb-6 text-center max-w-xs">Clone your voice or use a standard voice to get started.</p>
                  <Link to="/create-voice" className="bg-[#222] hover:bg-[#333] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors border border-[#333] hover:border-[#444]">
                    Clone Voice
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {voices.map(v => (
                    <div 
                      key={v.id} 
                      onClick={() => setVoiceId(v.id)}
                      className={`cursor-pointer rounded-xl p-4 flex flex-col transition-all duration-200 border ${voiceId === v.id ? 'bg-purple-500/10 border-purple-500 shadow-md' : 'bg-[#151515] border-[#222] hover:border-[#444] hover:bg-[#1a1a1a]'}`}
                    >
                      <div className="flex items-start justify-between w-full mb-3">
                        <div className="flex flex-col">
                          <span className="text-white font-semibold text-sm truncate">{v.name}</span>
                          <div className="flex space-x-2 mt-1.5">
                            {v.gender && <span className="text-[10px] bg-[#222] text-gray-300 px-2 py-0.5 rounded capitalize">{v.gender}</span>}
                            {v.age_bracket && <span className="text-[10px] bg-[#222] text-gray-300 px-2 py-0.5 rounded capitalize">{v.age_bracket}</span>}
                          </div>
                        </div>
                        {voiceId === v.id && (
                          <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center shadow-lg border-2 border-[#111] shrink-0">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          </div>
                        )}
                      </div>
                      <div className="flex w-full items-center">
                        <button 
                          type="button"
                          onClick={(e) => togglePlay(e, v.preview_audio || v.reference_audio_url)}
                          disabled={!v.preview_audio && !v.reference_audio_url}
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-500 transition-colors disabled:bg-[#333] disabled:cursor-not-allowed"
                        >
                           {playingAudio && (playingAudio.src === new URL(v.preview_audio || v.reference_audio_url || '', window.location.href).href || playingAudio.src.includes(v.preview_audio || v.reference_audio_url)) && !playingAudio.paused ? (
                             <div className="w-3 h-3 bg-white" /> // Pause square
                           ) : (
                             <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
                           )}
                        </button>
                        <span className="text-xs text-gray-500 ml-3">{v.preview_audio || v.reference_audio_url ? "Preview Voice" : "No preview"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Step 3: Script & Quality */}
            <div className="relative">
              <label className="flex items-center text-lg font-semibold text-white mb-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-600 text-white text-sm mr-3 font-bold shadow-md shadow-purple-900/50">3</span>
                Script & Settings
              </label>
              
              <div className="space-y-4">
                <div className="flex bg-[#151515] rounded-lg border border-[#222] p-1.5 w-full max-w-sm">
                  <button
                    type="button"
                    onClick={() => setQuality('1080p')}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${quality === '1080p' ? 'bg-[#333] text-white shadow-sm border border-[#444]' : 'text-gray-400 hover:text-gray-200 border border-transparent'}`}
                  >
                    1080p Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuality('4K')}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${quality === '4K' ? 'bg-[#333] text-white shadow-sm border border-[#444]' : 'text-gray-400 hover:text-gray-200 border border-transparent'}`}
                  >
                    4K Cinematic
                  </button>
                </div>

                <div className="relative">
                  <textarea 
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    className="w-full h-44 bg-[#151515] border border-[#222] rounded-xl p-5 text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none transition-colors placeholder-gray-600 text-base leading-relaxed"
                    placeholder="Type what you want your avatar to say..."
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setScript("Hello everyone! Welcome to my new course on building an AI Avatar SaaS. Today, we're going to dive into how to connect FLUX, XTTS-v2, and LivePortrait together to build a fully automated video generation pipeline. Let's get started!")}
                    className="absolute bottom-4 right-4 text-xs bg-[#222] text-gray-300 hover:bg-[#333] hover:text-white px-3 py-1.5 rounded-md font-medium transition-colors border border-[#333] flex items-center shadow-sm"
                  >
                    <span className="mr-1.5">✨</span> Magic Script
                  </button>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:opacity-70 text-white font-bold py-4 px-4 rounded-xl transition-all duration-200 text-base shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 mt-8"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Video...
                </>
              ) : (
                "Generate Video"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right side: Preview */}
      <div className="w-full lg:w-[400px]">
        <div className="sticky top-8 bg-[#111] rounded-2xl border border-[#222] h-fit shadow-lg overflow-hidden flex flex-col">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#222] flex justify-between items-center bg-[#151515]">
            <h3 className="font-semibold text-white flex items-center text-sm">
              <Play className="w-4 h-4 mr-2 text-purple-500 fill-purple-500" />
              Live Preview
            </h3>
            <div className="flex space-x-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
            </div>
          </div>

          <div className="p-6 flex justify-center">
            <div className={`w-full ${isLandscape ? 'aspect-video' : 'aspect-[9/16]'} transition-all duration-500 bg-[#0a0a0a] rounded-xl border border-[#222] overflow-hidden relative shadow-inner`}>
              {/* Subtle Grid Background for empty state */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
              
              {selectedAvatar ? (
                <>
                  <img src={selectedAvatar.preview_image || "/assets/card_avatar_green_1782335491666.png"} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000] via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-0 right-0 px-4 text-center">
                    <div className="inline-flex items-center space-x-2 bg-black/80 px-3 py-1.5 rounded-full border border-white/10 shadow-xl backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
                      <span className="text-gray-100 text-[10px] font-bold tracking-widest uppercase">Ready to Animate</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-gray-500 relative z-10">
                  <div className="w-16 h-16 rounded-full bg-[#151515] border border-[#222] flex items-center justify-center mb-6 shadow-xl">
                    <Play className="w-6 h-6 text-[#444] ml-1" />
                  </div>
                  <h4 className="text-gray-300 font-semibold mb-2">No Scene Selected</h4>
                  <p className="text-xs text-gray-600 max-w-[200px] leading-relaxed">Select an avatar and voice to preview your scene before generating.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

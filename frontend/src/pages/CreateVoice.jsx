import { useState, useRef } from 'react';
import { Mic, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

export default function CreateVoice() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('voices/', { name });
      toast.success(`Successfully created Voice Clone ID: ${response.data.id}`);
      setName('');
      setFile(null);
    } catch (error) {
      console.error(error);
      toast.error('Error creating voice clone');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="w-full bg-[#111] p-10 rounded-2xl border border-[#222] shadow-sm">
        <h1 className="text-3xl font-bold mb-2 text-white">Clone Your Voice</h1>
        <p className="text-gray-400 mb-10 text-base">Upload a clean 1-2 minute audio clip to clone your voice using XTTS-v2.</p>
        
        <form onSubmit={handleUpload} className="space-y-8">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Voice Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#222] rounded-xl p-4 text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors text-base placeholder-gray-600"
              placeholder="e.g., My Podcast Voice"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Reference Audio (.wav or .mp3)</label>
            <div 
              onClick={() => fileInputRef.current.click()}
              className="border border-dashed border-[#444] rounded-xl p-16 text-center hover:border-purple-500 hover:bg-purple-500/5 transition cursor-pointer group/upload bg-[#1a1a1a]"
            >
              <Mic className="w-12 h-12 text-gray-600 mx-auto mb-4 group-hover/upload:text-purple-500 transition-colors" />
              {file ? (
                <p className="text-purple-400 font-bold text-base">{file.name}</p>
              ) : (
                <>
                  <p className="text-gray-300 font-medium text-base">Drag and drop audio file here</p>
                  <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                </>
              )}
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="audio/*"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:opacity-70 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-200 text-base shadow-sm mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Cloning Voice...
              </>
            ) : (
              "Clone Voice"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

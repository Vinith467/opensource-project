import { Link, useNavigate } from 'react-router-dom';
import { User, Mic, PlaySquare, Plus, GitBranch, ArrowRight, Play, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../api';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsRes = await api.get('jobs/');
        setJobs(jobsRes.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchData();
  }, []);

  const handleSuggestedPrompt = (tag) => {
    const prompts = {
      'Course Lesson': 'Create a 3-minute course lesson explaining the basics of artificial intelligence...',
      'Use Avatar V': 'Generate a casual greeting video using my custom Avatar V...',
      'Use Style/Brand': 'Create a corporate update video following our strict brand style guidelines...',
      'Upload Docs': '[Action] Parse my uploaded document and turn it into a presentation...',
      'Script to Video': 'Turn the following script into a dynamic video with B-roll...'
    };
    setPrompt(prompts[tag] || '');
  };

  return (
    <div className="flex flex-col items-center mt-8 space-y-12 w-full pb-16">
      
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Say it with video</h1>
        <p className="text-gray-400 text-lg font-medium">AvatarSaaS's new all-in-one agent for video creation.</p>
      </div>

      {/* Prompt Box */}
      <div className="w-full max-w-3xl">
        <div className="w-full bg-[#111111] rounded-2xl border border-[#222] p-2 shadow-sm focus-within:border-purple-500/50 focus-within:ring-1 focus-within:ring-purple-500/50 transition-all">
          <div className="flex space-x-2 p-2">
            {/* Avatar Toggle */}
            <Link to="/create-avatar" className="flex items-center space-x-2 bg-[#1a1a1a] px-4 py-2 rounded-xl border border-[#222] cursor-pointer hover:bg-[#222] transition-colors">
              <div className="bg-[#222] p-1.5 rounded-md"><User className="w-4 h-4 text-gray-300" /></div>
              <div className="text-left leading-tight">
                <div className="text-sm font-semibold text-gray-200">Auto</div>
                <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Avatar</div>
              </div>
            </Link>
            {/* Voice Toggle */}
            <Link to="/create-voice" className="flex items-center space-x-2 bg-[#1a1a1a] px-4 py-2 rounded-xl border border-[#222] cursor-pointer hover:bg-[#222] transition-colors">
              <div className="bg-[#222] p-1.5 rounded-md"><Mic className="w-4 h-4 text-gray-300" /></div>
              <div className="text-left leading-tight">
                <div className="text-sm font-semibold text-gray-200">Auto</div>
                <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Voice</div>
              </div>
            </Link>
            {/* Style Toggle */}
            <div className="flex items-center space-x-2 bg-[#1a1a1a] px-4 py-2 rounded-xl border border-[#222] cursor-pointer hover:bg-[#222] transition-colors opacity-50">
              <div className="bg-[#222] p-1.5 rounded-md"><PlaySquare className="w-4 h-4 text-gray-300" /></div>
              <div className="text-left leading-tight">
                <div className="text-sm font-semibold text-gray-200">Auto</div>
                <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Style/Brand</div>
              </div>
            </div>
          </div>

          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the video you want to create..."
            className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-600 px-6 py-6 resize-none h-32 outline-none text-lg"
          />

          <div className="flex items-center justify-between px-4 pb-4">
            <div className="flex space-x-3">
              <button className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-[#222]"><Plus className="w-5 h-5" /></button>
              <button className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-[#222]"><GitBranch className="w-5 h-5" /></button>
            </div>
            <div className="flex items-center space-x-3">
              <button className="text-sm font-medium text-gray-400 hover:text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-1">
                <span>Auto-pilot</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </button>
              <Link to="/generate" className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-2 rounded-lg transition-colors shadow-sm">
                Submit
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Prompts */}
      <div className="flex space-x-3">
        {['Course Lesson', 'Use Avatar V', 'Use Style/Brand', 'Upload Docs', 'Script to Video'].map(tag => (
          <button 
            key={tag} 
            onClick={() => handleSuggestedPrompt(tag)}
            className="border border-[#222] text-gray-400 text-sm px-4 py-1.5 rounded-lg hover:bg-[#111] hover:text-gray-200 hover:border-[#333] transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Premium Feature Cards */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        
        {/* Card 1: Avatar */}
        <Link to="/create-avatar" className="group relative rounded-2xl overflow-hidden h-56 transition-transform hover:-translate-y-1 hover:shadow-xl border border-[#222] bg-[#111]">
          <img src="/assets/card_avatar_green_1782335491666.png" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700" alt="Avatar bg" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#000] to-transparent"></div>
          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            <h3 className="text-3xl font-bold text-white leading-tight">Create an<br/>Avatar</h3>
            <div className="flex items-center text-sm font-bold text-purple-400">
              Go to Avatars <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </Link>

        {/* Card 2: Auto Edit */}
        <Link to="/generate" className="group relative rounded-2xl overflow-hidden h-56 transition-transform hover:-translate-y-1 hover:shadow-xl border border-[#222] bg-[#111]">
          <img src="/assets/card_auto_blue_1782335507869.png" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700" alt="Auto Edit bg" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#000] to-transparent"></div>
          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            <h3 className="text-3xl font-bold text-white leading-tight">Auto<br/>Edit</h3>
            <div className="flex items-center text-sm font-bold text-purple-400">
              Create now <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </Link>

        {/* Card 3: Photo to Video */}
        <Link to="/create-voice" className="group relative rounded-2xl overflow-hidden h-56 transition-transform hover:-translate-y-1 hover:shadow-xl border border-[#222] bg-[#111]">
          <img src="/assets/card_photo_pink_1782335523585.png" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700" alt="Photo to Video bg" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#000] to-transparent"></div>
          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            <h3 className="text-3xl font-bold text-white leading-tight">Clone<br/>Voice</h3>
            <div className="flex items-center text-sm font-bold text-purple-400">
              Try it now <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </Link>
      </div>

      {/* Jobs List (Dynamic Grid) */}
      {jobs.length > 0 && (
        <div className="w-full mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Video Generations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map(job => (
              <div key={job.id} className="relative group rounded-2xl overflow-hidden h-48 transition-all hover:-translate-y-1 hover:shadow-xl border border-[#222] bg-[#111] hover:border-purple-500/50">
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                  <div className="flex justify-between items-start">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      job.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                      job.status === 'failed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}>
                      {job.status.replace('_', ' ')}
                    </span>
                    <span className="font-mono text-xs text-gray-500">...{job.id.slice(-6)}</span>
                  </div>
                  <div>
                    <p className="text-gray-200 font-medium text-sm line-clamp-2 mb-4">"{job.script_text}"</p>
                    {job.status === 'completed' && (
                      <button onClick={() => setSelectedJob(job)} className="flex items-center text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors bg-purple-500/10 w-fit px-4 py-2 rounded-lg border border-purple-500/20 hover:bg-purple-500/20">
                        <Play className="w-4 h-4 mr-1.5" /> Watch Video
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111216] border border-[#2e303a] rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Generated Video {selectedJob.quality && <span className="text-xs bg-[#2e303a] px-2 py-1 rounded ml-2 align-middle">{selectedJob.quality}</span>}</h3>
              <p className="text-gray-400 text-sm mb-6">Script: {selectedJob.script_text}</p>
              
              <div className="w-full bg-black rounded-xl overflow-hidden mb-6">
                <video 
                  src={selectedJob.final_video_url || "https://www.w3schools.com/html/mov_bbb.mp4"} 
                  controls 
                  className="w-full max-h-[60vh] object-contain"
                  autoPlay
                />
              </div>

              <div className="flex justify-end">
                <a 
                  href={selectedJob.final_video_url || "https://www.w3schools.com/html/mov_bbb.mp4"} 
                  download={`video_${selectedJob.id}.mp4`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold px-6 py-2 rounded-full transition-colors"
                >
                  Download Video
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

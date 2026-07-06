import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Video, User, Plus, Folder, LayoutTemplate, Layers, Settings, MessageSquare, ChevronDown, Languages, PenTool } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import CreateAvatar from './pages/CreateAvatar';
import CreateVoice from './pages/CreateVoice';
import GenerateVideo from './pages/GenerateVideo';
import VideoDubbing from './pages/VideoDubbing';
import ScriptWriter from './pages/ScriptWriter';

import { AnimatePresence, motion } from 'framer-motion';

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function Navigation() {
  const location = useLocation();
  
  return (
    <div className="flex h-screen overflow-hidden bg-[#000000] text-white font-sans relative">
      
      {/* Unified Professional Sidebar */}
      <nav className="w-64 bg-[#09090b] border-r border-[#1a1a1a] flex flex-col py-6 px-4 z-20">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
            <Video className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">AvatarSaaS</span>
        </div>
        
        {/* Create New Button */}
        <Link to="/generate" className="bg-white hover:bg-gray-100 text-black font-semibold rounded-lg py-2.5 px-4 flex items-center justify-center space-x-2 transition-colors mb-8 cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Create Video</span>
        </Link>
        
        <div className="flex flex-col space-y-1 w-full flex-1">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-3">Menu</div>
          <Link to="/" className={`px-3 py-2.5 rounded-lg flex items-center space-x-3 transition-colors ${location.pathname === '/' ? 'bg-purple-500/10 text-purple-400' : 'text-gray-400 hover:text-gray-200 hover:bg-[#111]'}`}>
            <Home className="w-5 h-5" />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>
          <Link to="/create-avatar" className={`px-3 py-2.5 rounded-lg flex items-center space-x-3 transition-colors ${location.pathname.includes('avatar') ? 'bg-purple-500/10 text-purple-400' : 'text-gray-400 hover:text-gray-200 hover:bg-[#111]'}`}>
            <User className="w-5 h-5" />
            <span className="font-medium text-sm">Avatars</span>
          </Link>
          <Link to="/create-voice" className={`px-3 py-2.5 rounded-lg flex items-center space-x-3 transition-colors ${location.pathname.includes('voice') ? 'bg-purple-500/10 text-purple-400' : 'text-gray-400 hover:text-gray-200 hover:bg-[#111]'}`}>
            <Layers className="w-5 h-5" />
            <span className="font-medium text-sm">Voices</span>
          </Link>
          <Link to="/video-dubbing" className={`px-3 py-2.5 rounded-lg flex items-center space-x-3 transition-colors ${location.pathname.includes('dubbing') ? 'bg-purple-500/10 text-purple-400' : 'text-gray-400 hover:text-gray-200 hover:bg-[#111]'}`}>
            <Languages className="w-5 h-5" />
            <span className="font-medium text-sm">Video Dubbing</span>
          </Link>
          <div className="px-3 py-2.5 rounded-lg flex items-center space-x-3 text-gray-400 hover:text-gray-200 hover:bg-[#111] cursor-pointer transition-colors" onClick={() => toast("Assets coming soon!", { icon: '📁' })}>
            <Folder className="w-5 h-5" />
            <span className="font-medium text-sm">Assets</span>
          </div>
          <Link to="/script-writer" className={`px-3 py-2.5 rounded-lg flex items-center space-x-3 transition-colors ${location.pathname.includes('script-writer') ? 'bg-purple-500/10 text-purple-400' : 'text-gray-400 hover:text-gray-200 hover:bg-[#111]'}`}>
            <PenTool className="w-5 h-5" />
            <span className="font-medium text-sm">Script Writer</span>
          </Link>
        </div>
        
        <div className="mt-auto pt-4 border-t border-[#1a1a1a]">
          <div className="px-3 py-2 rounded-lg flex items-center space-x-3 text-gray-400 hover:text-gray-200 hover:bg-[#111] cursor-pointer transition-colors" onClick={() => toast("Account Settings coming soon!", { icon: '⚙️' })}>
            <Settings className="w-5 h-5" />
            <span className="font-medium text-sm">Settings</span>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#000000] relative z-0">
        
        {/* Top bar (Ask AI / Notifications) */}
        <div className="absolute top-4 right-6 flex items-center space-x-4 z-10">
          <button onClick={() => toast("AI Assistant coming soon!", { icon: '✨' })} className="bg-[#111] hover:bg-[#222] border border-[#222] rounded-full py-1.5 px-4 text-sm font-medium transition-colors text-gray-300">
            Ask AI
          </button>
          <button onClick={() => toast("Support Chat coming soon!", { icon: '💬' })} className="relative p-2 bg-[#111] hover:bg-[#222] rounded-full border border-[#222] transition-colors text-gray-300">
            <MessageSquare className="w-4 h-4" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-[#111]"></span>
          </button>
        </div>

        <div className="h-full pt-16 px-8 pb-12 max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
              <Route path="/create-avatar" element={<PageTransition><CreateAvatar /></PageTransition>} />
              <Route path="/create-voice" element={<PageTransition><CreateVoice /></PageTransition>} />
              <Route path="/generate/:avatarId?" element={<PageTransition><GenerateVideo /></PageTransition>} />
              <Route path="/video-dubbing" element={<PageTransition><VideoDubbing /></PageTransition>} />
              <Route path="/script-writer" element={<PageTransition><ScriptWriter /></PageTransition>} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#1f2028',
            color: '#fff',
            border: '1px solid #2e303a',
          },
        }}
      />
      <Navigation />
    </Router>
  );
}

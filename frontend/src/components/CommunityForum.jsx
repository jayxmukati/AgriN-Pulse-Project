import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_URL || 'https://agrin-pulse-api.onrender.com';
import { MessageSquare, ThumbsUp, ShieldCheck, Share2, Search, Hash } from 'lucide-react';

export default function CommunityForum() {
  const [activeTag, setActiveTag] = useState('All');

  const trendingTags = ['#WheatRust', '#Irrigation', '#PestControl', '#Subsidies'];

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/api/v1/forum`)
      .then(res => setPosts(res.data))
      .catch(err => console.error("Failed to fetch forum posts", err));
  }, []);

  return (
    <div className="w-full relative z-10 text-white font-body-md pb-24 animate-in fade-in flex flex-col md:flex-row gap-6 mt-4">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0 space-y-4">
        <div className="card p-4">
          <h2 className="font-bold text-sm mb-4 text-green-300">Trending Topics</h2>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setActiveTag('All')}
              className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeTag === 'All' ? 'bg-green-500/20 text-green-400 font-bold' : 'text-white/70 hover:bg-white/5'}`}
            >
              All Posts
            </button>
            {trendingTags.map(tag => (
              <button 
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${activeTag === tag ? 'bg-green-500/20 text-green-400 font-bold' : 'text-white/70 hover:bg-white/5'}`}
              >
                <Hash className="w-4 h-4 opacity-50" /> {tag.replace('#', '')}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Feed */}
      <main className="flex-1 flex flex-col gap-4">
        <header className="flex items-center justify-between bg-black/20 p-4 rounded-2xl border border-white/10">
          <div>
            <h1 className="text-2xl font-bold">Community Expert Forum</h1>
            <p className="text-xs text-white/60">Ask questions, share knowledge, and get verified advice.</p>
          </div>
          <button className="bg-green-500 text-black px-4 py-2 font-bold rounded-xl text-sm hover:bg-green-400 transition-colors">
            New Post
          </button>
        </header>

        <div className="space-y-4">
          {posts.filter(p => activeTag === 'All' || p.tags.includes(activeTag)).map(post => (
            <article key={post.id} className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-sm">{post.author}</h3>
                  <p className="text-[10px] text-white/50">{post.role} • {post.time}</p>
                </div>
              </div>
              <p className="text-sm text-white/90 leading-relaxed mb-4">{post.content}</p>
              
              <div className="flex gap-2 mb-4">
                {post.tags.map(tag => (
                  <span key={tag} className="text-[10px] bg-white/10 px-2 py-1 rounded-md text-green-300 font-bold">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 border-t border-white/10 pt-3 text-white/60 text-xs font-bold">
                <button className="flex items-center gap-1.5 hover:text-green-400 transition-colors">
                  <ThumbsUp className="w-4 h-4" /> {post.likes}
                </button>
                <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <MessageSquare className="w-4 h-4" /> {post.replies.length} Replies
                </button>
                <button className="flex items-center gap-1.5 hover:text-white transition-colors ml-auto">
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>

              {/* Replies */}
              {post.replies.length > 0 && (
                <div className="mt-4 space-y-3 pl-4 md:pl-8 border-l-2 border-white/10">
                  {post.replies.map((reply, idx) => (
                    <div key={idx} className={`p-4 rounded-xl ${reply.verified ? 'bg-green-900/20 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'bg-black/20'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-sm flex items-center gap-1.5 text-green-400">
                          {reply.author}
                          {reply.verified && <ShieldCheck className="w-4 h-4 text-green-400" />}
                        </h4>
                        <span className="text-[10px] text-white/50">• {reply.time}</span>
                      </div>
                      <p className="text-sm text-white/80 leading-relaxed">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

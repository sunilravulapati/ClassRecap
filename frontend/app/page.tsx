"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafbff] relative overflow-hidden">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234338ca' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 lg:py-32">
        {/* Hero Section */}
        <div className="text-center mb-24">
          
          {/* Logo Removed Here */}
          
          <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
            Class<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Pulse</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Bridging the gap between lecture and mastery. Capture real-time learning signals to optimize your academic journey.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Student Card */}
          <Link
            href="/student"
            className="group p-1 bg-gradient-to-br from-transparent to-transparent hover:from-blue-200 hover:to-indigo-200 rounded-[2rem] transition-all duration-500"
          >
            <div className="h-full bg-white p-10 rounded-[1.8rem] shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden border border-slate-100">
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-blue-50 rounded-full blur-3xl group-hover:bg-blue-100 transition-colors"></div>
              
              <div className="relative">
                <div className="w-14 h-14 bg-blue-50 text-3xl rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  🎓
                </div>
                
                <h2 className="text-3xl font-bold text-slate-900 mb-4 flex items-center">
                  Student Portal
                  <svg className="w-6 h-6 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </h2>
                
                <p className="text-slate-500 text-lg leading-relaxed mb-8">
                  Reflect on today's lecture. Upload insights, generate AI-powered study guides, and track your retention.
                </p>
                
                <div className="flex gap-3">
                  <span className="px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-lg border border-blue-100">Quick Upload</span>
                  <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-lg border border-indigo-100">AI Recap</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Faculty Card */}
          <Link
            href="/faculty"
            className="group p-1 bg-gradient-to-br from-transparent to-transparent hover:from-indigo-200 hover:to-violet-200 rounded-[2rem] transition-all duration-500"
          >
            <div className="h-full bg-white p-10 rounded-[1.8rem] shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden border border-slate-100">
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-indigo-50 rounded-full blur-3xl group-hover:bg-indigo-100 transition-colors"></div>
              
              <div className="relative">
                <div className="w-14 h-14 bg-indigo-50 text-3xl rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  👩‍🏫
                </div>
                
                <h2 className="text-3xl font-bold text-slate-900 mb-4 flex items-center">
                  Faculty Dashboard
                  <svg className="w-6 h-6 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </h2>
                
                <p className="text-slate-500 text-lg leading-relaxed mb-8">
                  Monitor comprehension levels. Access automated class digests and adapt your teaching to student needs.
                </p>
                
                <div className="flex gap-3">
                  <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-lg border border-indigo-100">Analytics</span>
                  <span className="px-4 py-1.5 bg-violet-50 text-violet-700 text-xs font-bold uppercase tracking-wider rounded-lg border border-violet-100">Insights</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mt-32 border-t border-slate-100 pt-20">
          {[
            { title: "Save Time", desc: "Automate recap notes and feedback collection.", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-emerald-500", bg: "bg-emerald-50" },
            { title: "Track Progress", desc: "Identify learning gaps before the exam.", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2", color: "text-purple-500", bg: "bg-purple-50" },
            { title: "Data Driven", desc: "Evidence-based insights for better teaching.", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", color: "text-orange-500", bg: "bg-orange-50" }
          ].map((benefit, i) => (
            <div key={i} className="text-center group">
              <div className={`w-14 h-14 ${benefit.bg} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300`}>
                <svg className={`w-7 h-7 ${benefit.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={benefit.icon} />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{benefit.title}</h3>
              <p className="text-slate-500 leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 4s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
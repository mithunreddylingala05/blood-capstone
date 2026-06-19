import { Link } from 'react-router-dom'
import { Droplets, Heart, Users, Calendar, ArrowRight, ShieldCheck, Globe, Clock } from 'lucide-react'
import bloodDrop from '../../assets/blood_drop.png'
import communityHeart from '../../assets/community_heart.png'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-rose-100 italic-none">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-rose-200">
              <Droplets className="text-white" size={24} />
            </div>
            <div>
              <span className="text-slate-900 font-black text-xl tracking-tighter block leading-none">Smart Blood</span>
              <span className="text-primary font-bold text-xs tracking-widest uppercase">Connect</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-slate-600 font-bold text-sm hover:text-primary transition-colors">Home</a>
            <a href="#about" className="text-slate-600 font-bold text-sm hover:text-primary transition-colors">About</a>
            <a href="#donation" className="text-slate-600 font-bold text-sm hover:text-primary transition-colors">Donation</a>
            <a href="#contact" className="text-slate-600 font-bold text-sm hover:text-primary transition-colors">Contact</a>
          </div>

          <Link to="/login" className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-slate-800 transition-all hover:shadow-lg active:scale-95">
            Login / Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              <span className="text-primary font-bold text-xs uppercase tracking-widest">Real-time Connectivity</span>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
               <img src={bloodDrop} alt="Smart Blood Connect Logo" className="w-24 h-24 object-contain animate-float" />
               <h1 className="text-slate-900 text-6xl md:text-7xl font-black tracking-tight leading-[0.9]">
                Smart Blood<br />
                <span className="text-slate-700">Connect</span>
              </h1>
            </div>

            <p className="text-slate-500 text-xl md:text-2xl font-medium mb-10 max-w-lg leading-relaxed">
              Intelligent Management.<br />
              <span className="text-slate-400 font-normal">Saving Lives Together.</span>
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-rose-700 transition-all shadow-xl shadow-rose-200 flex items-center gap-2 group">
                Become a Donor <Heart size={20} className="group-hover:scale-125 transition-transform" />
              </Link>
              <button className="bg-white text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-2xl font-black text-lg hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2">
                Find a Drive <Calendar size={20} />
              </button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
                <div className="text-center">
                    <p className="text-2xl font-black text-slate-800">10k+</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Lives Impacted</p>
                </div>
                <div className="text-center border-x border-slate-100">
                    <p className="text-2xl font-black text-slate-800">500+</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Hospitals</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-black text-slate-800">15min</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Avg Response</p>
                </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-rose-50 rounded-full blur-[120px] -z-10"></div>
            <div className="relative rounded-[40px] overflow-hidden shadow-2xl border-8 border-white group">
                <img src={communityHeart} alt="Community Network" className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                            <ShieldCheck className="text-white" size={24} />
                        </div>
                        <div>
                            <p className="text-white font-bold">Verified Community</p>
                            <p className="text-white/70 text-xs font-medium">Over 25,000+ active donors joined</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Floating Badges */}
            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-bounce-slow">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                        <Globe size={18} />
                    </div>
                    <p className="text-xs font-black text-slate-800">Nationwide Network</p>
                </div>
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-pulse-soft">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center text-rose-600">
                        <Clock size={18} />
                    </div>
                    <p className="text-xs font-black text-slate-800">24/7 Availability</p>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-slate-900 text-4xl font-black mb-4">Why Choose Us?</h2>
            <p className="text-slate-500 font-medium">Powering the future of blood donation with technology.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Community First</h3>
              <p className="text-slate-500 text-sm leading-relaxed">A growing network of donors and patients supporting each other in times of need.</p>
            </div>
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Instant Alerts</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Get notified immediately when your blood group is needed nearby.</p>
            </div>
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-500 group-hover:scale-110 transition-transform">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Fully Verified</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Every request and hospital is verified to ensure maximum safety and reliability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="bg-slate-900 py-20 px-6 rounded-t-[60px]">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mb-8 rotate-12 shadow-2xl">
              <Droplets className="text-white" size={40} />
            </div>
            <h2 className="text-white text-4xl md:text-5xl font-black mb-6">Ready to save a life?</h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl">Join thousands of others who are making a difference today. It only takes a minute to sign up.</p>
            <div className="flex flex-wrap justify-center gap-4">
                <Link to="/register" className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-rose-700 transition-all flex items-center gap-2 group">
                   Sign Up Now <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </Link>
            </div>
            
            <div className="mt-20 pt-10 border-t border-white/10 w-full flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-white/40 text-sm font-medium">© 2024 Smart Blood Connect. All rights reserved.</p>
                <div className="flex gap-8">
                    <a href="#" className="text-white/40 hover:text-white transition-colors text-sm font-bold">Privacy Policy</a>
                    <a href="#" className="text-white/40 hover:text-white transition-colors text-sm font-bold">Terms of Service</a>
                </div>
            </div>
        </div>
      </footer>
    </div>
  )
}

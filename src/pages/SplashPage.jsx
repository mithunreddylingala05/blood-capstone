import { Droplets } from 'lucide-react'
import { APP_NAME, APP_TAGLINE } from '../utils/constants'

export default function SplashPage() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center w-full max-w-7xl mx-auto">
      <div className="flex flex-col items-center animate-fade-in">
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <Droplets size={48} className="text-white" />
        </div>
        <h1 className="text-white text-3xl font-black mb-2 text-center">{APP_NAME}</h1>
        <p className="text-white/70 text-sm mb-12 text-center">{APP_TAGLINE}</p>
        <div className="w-12 h-1 bg-white/30 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  )
}

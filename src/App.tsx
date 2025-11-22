import { useState } from 'react';
import './index.css';

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Professional Navigation */}
      <nav className="bg-slate-900 text-white sticky top-0 z-50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Clean, Professional */}
            <div className="flex items-center">
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
                SunEdge<span className="text-cyan-400">Power</span>
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-slate-300 hover:text-white transition-colors duration-200 font-medium">About</a>
              <a href="#epc-services" className="text-slate-300 hover:text-white transition-colors duration-200 font-medium">EPC Services</a>
              <a href="#capabilities" className="text-slate-300 hover:text-white transition-colors duration-200 font-medium">Capabilities</a>
              <a href="#markets" className="text-slate-300 hover:text-white transition-colors duration-200 font-medium">Markets</a>
              <a href="#contact" className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2.5 font-semibold transition-colors duration-200">
                Request Consultation
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-slate-800 transition"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-700">
              <a href="#about" className="block py-3 text-slate-300 hover:text-white transition">About</a>
              <a href="#epc-services" className="block py-3 text-slate-300 hover:text-white transition">EPC Services</a>
              <a href="#capabilities" className="block py-3 text-slate-300 hover:text-white transition">Capabilities</a>
              <a href="#markets" className="block py-3 text-slate-300 hover:text-white transition">Markets</a>
              <a
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full mt-4 bg-cyan-600 text-white px-6 py-3 font-semibold transition text-center"
              >
                Request Consultation
              </a>
            </div>
          )}
        </div>
      </nav>

      <main>
        {/* Hero Section - Enterprise C&I Positioning */}
        <div className="relative bg-slate-900 text-white overflow-hidden">
          {/* Subtle Technical Grid Pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-60"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
            <div className="text-center">
              {/* Professional Badge */}
              <div className="mb-8">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-600 text-slate-300 text-sm font-medium tracking-wide">
                  <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  CLASS A GENERAL CONTRACTOR | LICENSED, BONDED & INSURED
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
                <span className="text-white">Full-Service</span>
                <span className="block mt-2 text-cyan-400">
                  C&I Solar EPC
                </span>
                <span className="block mt-2 text-white">Contractor</span>
              </h1>

              {/* EPC Tagline */}
              <p className="text-base sm:text-lg text-slate-400 font-medium tracking-widest mb-8 uppercase">
                Engineering &bull; Procurement &bull; Construction
              </p>

              <p className="text-lg sm:text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                <span className="font-semibold text-white">19 years</span> of construction excellence.
                <span className="font-semibold text-cyan-400"> 2+ MW</span> of commercial solar installed to date.
                <span className="block mt-2 text-slate-400">Turnkey project delivery. Nationwide capabilities.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="#contact"
                  className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-white px-10 py-4 text-lg font-semibold transition-colors duration-200"
                >
                  Request a Consultation
                </a>
                <a
                  href="#epc-services"
                  className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white px-10 py-4 text-lg font-semibold transition-colors duration-200 border border-slate-600 text-center"
                >
                  Explore EPC Services
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Edge */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-700"></div>
        </div>

        {/* Stats Dashboard - Clean Enterprise Design */}
        <div className="bg-white py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-50 border border-slate-200 p-8 sm:p-12">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6 max-w-5xl mx-auto">
                {/* Stat 1 */}
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">2+ MW</div>
                  <div className="text-xs sm:text-sm text-slate-500 font-medium tracking-wide uppercase">Installed Capacity</div>
                </div>

                {/* Stat 2 */}
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">19</div>
                  <div className="text-xs sm:text-sm text-slate-500 font-medium tracking-wide uppercase">Years in Construction</div>
                </div>

                {/* Stat 3 */}
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">EPC</div>
                  <div className="text-xs sm:text-sm text-slate-500 font-medium tracking-wide uppercase">Turnkey Delivery</div>
                </div>

                {/* Stat 4 */}
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">USA</div>
                  <div className="text-xs sm:text-sm text-slate-500 font-medium tracking-wide uppercase">Nationwide Service</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* EPC Services - Full Lifecycle */}
        <div id="epc-services" className="py-20 sm:py-28 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium mb-4 tracking-wide uppercase">Full-Service EPC</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Complete Project Lifecycle
              </h2>
              <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                From initial engineering through final commissioning, SunEdge Power delivers turnkey C&I solar solutions
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Engineering */}
              <div className="group bg-white p-8 border border-slate-200 hover:border-slate-300 transition-colors duration-200">
                <div className="w-12 h-12 bg-slate-900 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Engineering</h3>
                <ul className="space-y-3 text-slate-600 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">&#8212;</span>
                    <span>System design & sizing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">&#8212;</span>
                    <span>Structural analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">&#8212;</span>
                    <span>Electrical engineering</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">&#8212;</span>
                    <span>Permit documentation</span>
                  </li>
                </ul>
              </div>

              {/* Procurement */}
              <div className="group bg-white p-8 border border-slate-200 hover:border-slate-300 transition-colors duration-200">
                <div className="w-12 h-12 bg-slate-900 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Procurement</h3>
                <ul className="space-y-3 text-slate-600 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">&#8212;</span>
                    <span>Equipment sourcing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">&#8212;</span>
                    <span>Supply chain management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">&#8212;</span>
                    <span>Vendor coordination</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">&#8212;</span>
                    <span>Quality assurance</span>
                  </li>
                </ul>
              </div>

              {/* Construction */}
              <div className="group bg-white p-8 border border-slate-200 hover:border-slate-300 transition-colors duration-200">
                <div className="w-12 h-12 bg-slate-900 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Construction</h3>
                <ul className="space-y-3 text-slate-600 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">&#8212;</span>
                    <span>Site preparation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">&#8212;</span>
                    <span>Racking & mounting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">&#8212;</span>
                    <span>Electrical installation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">&#8212;</span>
                    <span>System commissioning</span>
                  </li>
                </ul>
              </div>

              {/* O&M Support */}
              <div className="group bg-white p-8 border border-slate-200 hover:border-slate-300 transition-colors duration-200">
                <div className="w-12 h-12 bg-slate-900 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">O&M Support</h3>
                <ul className="space-y-3 text-slate-600 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">&#8212;</span>
                    <span>Utility interconnection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">&#8212;</span>
                    <span>System handoff & training</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">&#8212;</span>
                    <span>Warranty coordination</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">&#8212;</span>
                    <span>O&M partner referrals</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Leadership Team */}
        <div id="about" className="bg-slate-50 py-20 sm:py-28 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 bg-slate-200 text-slate-600 text-sm font-medium mb-4 tracking-wide uppercase">Leadership</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Leadership Team
              </h2>
              <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Decades of combined expertise in construction, solar installation, and commercial project management
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
              {/* Ron McCabe */}
              <div className="bg-white p-8 sm:p-10 border border-slate-200">
                <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-slate-900 flex items-center justify-center flex-shrink-0">
                    <span className="text-4xl sm:text-5xl text-white font-bold">R</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">Ron McCabe</h3>
                    <p className="text-cyan-600 font-semibold text-lg mt-1">Managing Member & Partner</p>
                    <p className="text-slate-500 font-medium">Founder | Since 2006</p>
                  </div>
                </div>

                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p>
                    As founder and managing member of SunEdge Power, Ron McCabe has been driving the company's vision since 2006.
                    Holding a <span className="font-semibold text-slate-900">Class "A" General Contractor license</span>, Ron transitioned
                    his extensive construction background--spanning residential and commercial building as well as specialized sinkhole
                    remediation--into the emerging solar industry.
                  </p>
                  <p>
                    His comprehensive grasp of construction fundamentals, combined with hands-on experience in heavy equipment operations,
                    gives SunEdge Power a distinct competitive edge when executing sophisticated solar installations nationwide.
                  </p>
                  <p className="text-slate-700 bg-slate-50 p-4 border-l-2 border-slate-900">
                    Ron spearheads business development initiatives and strategic alliance formation while maintaining oversight of all
                    operational elements, from initial site development through final system commissioning.
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap mt-8">
                  <span className="bg-slate-100 text-slate-700 px-3 py-1.5 text-sm font-medium">Class A Contractor</span>
                  <span className="bg-slate-100 text-slate-700 px-3 py-1.5 text-sm font-medium">19+ Years</span>
                  <span className="bg-slate-100 text-slate-700 px-3 py-1.5 text-sm font-medium">Heavy Equipment</span>
                </div>
              </div>

              {/* Kyle Amundsen */}
              <div className="bg-white p-8 sm:p-10 border border-slate-200">
                <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <span className="text-4xl sm:text-5xl text-white font-bold">K</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">Kyle Amundsen</h3>
                    <p className="text-cyan-600 font-semibold text-lg mt-1">Partner & Solar Operations Director</p>
                    <p className="text-slate-500 font-medium">Since 2017</p>
                  </div>
                </div>

                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p>
                    Kyle Amundsen brings battle-tested solar industry leadership to SunEdge Power, with a portfolio spanning
                    <span className="font-semibold text-slate-900"> residential installations, commercial-scale projects, and utility-grade deployments</span>.
                    Since entering the solar sector in 2017, Kyle has built a reputation as a forward-thinking leader within the renewable energy community.
                  </p>
                  <p>
                    His comprehensive understanding of system engineering, installation best practices, and project execution strategies
                    delivers exceptional value to both the company and its strategic partners.
                  </p>
                  <p className="text-slate-700 bg-slate-50 p-4 border-l-2 border-slate-800">
                    As Director of Solar Operations, Kyle manages the full scope of solar activities, with particular emphasis on complex
                    commercial installations and microgrid solutions, while also directing specialized ground-mount drilling operations.
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap mt-8">
                  <span className="bg-slate-100 text-slate-700 px-3 py-1.5 text-sm font-medium">Solar Operations</span>
                  <span className="bg-slate-100 text-slate-700 px-3 py-1.5 text-sm font-medium">8+ Years</span>
                  <span className="bg-slate-100 text-slate-700 px-3 py-1.5 text-sm font-medium">Project Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Capabilities - Our Competitive Edge */}
        <div id="capabilities" className="py-20 sm:py-28 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium mb-4 tracking-wide uppercase">Capabilities</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Our Competitive Edge
              </h2>
              <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                What sets SunEdge Power apart as your full-service C&I solar EPC partner
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Advanced Equipment */}
              <div className="group bg-white p-8 border border-slate-200 hover:border-slate-300 transition-colors duration-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-slate-900 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Specialized Equipment</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Purpose-built drilling and mounting equipment for commercial ground-mount installations. Our heavy equipment capabilities enable efficient deployment across challenging terrain and soil conditions.
                </p>
              </div>

              {/* Nationwide Reach */}
              <div className="group bg-white p-8 border border-slate-200 hover:border-slate-300 transition-colors duration-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-slate-900 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Nationwide Capability</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Licensed to operate across the United States with deep regulatory knowledge, permitting expertise, and utility interconnection experience. We navigate local requirements to fast-track your project timeline.
                </p>
              </div>

              {/* Construction Heritage */}
              <div className="group bg-white p-8 border border-slate-200 hover:border-slate-300 transition-colors duration-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-slate-900 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Construction Heritage</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  19 years of general contracting experience translates to superior project management, safety protocols, and build quality. Our Class A license ensures compliance and professionalism on every project.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Markets Served */}
        <div id="markets" className="bg-slate-900 text-white py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 bg-slate-800 text-slate-400 text-sm font-medium mb-4 tracking-wide uppercase">Markets</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Markets We Serve
              </h2>
              <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                Full-service EPC solutions tailored to the unique requirements of each market segment
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
              <div className="bg-slate-800 p-6 sm:p-8 text-center hover:bg-slate-700 transition-colors duration-200 border border-slate-700">
                <div className="w-12 h-12 bg-slate-700 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2">Commercial</h3>
                <p className="text-xs sm:text-sm text-slate-400">Office, retail, warehouses</p>
              </div>

              <div className="bg-slate-800 p-6 sm:p-8 text-center hover:bg-slate-700 transition-colors duration-200 border border-slate-700">
                <div className="w-12 h-12 bg-slate-700 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2">Industrial</h3>
                <p className="text-xs sm:text-sm text-slate-400">Manufacturing, distribution</p>
              </div>

              <div className="bg-slate-800 p-6 sm:p-8 text-center hover:bg-slate-700 transition-colors duration-200 border border-slate-700">
                <div className="w-12 h-12 bg-slate-700 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2">Agricultural</h3>
                <p className="text-xs sm:text-sm text-slate-400">Farms, agribusiness</p>
              </div>

              <div className="bg-slate-800 p-6 sm:p-8 text-center hover:bg-slate-700 transition-colors duration-200 border border-slate-700">
                <div className="w-12 h-12 bg-slate-700 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2">Municipal</h3>
                <p className="text-xs sm:text-sm text-slate-400">Government, public works</p>
              </div>

              <div className="bg-slate-800 p-6 sm:p-8 text-center hover:bg-slate-700 transition-colors duration-200 border border-slate-700 col-span-2 lg:col-span-1">
                <div className="w-12 h-12 bg-slate-700 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2">Utility-Scale</h3>
                <p className="text-xs sm:text-sm text-slate-400">Solar farms, IPP projects</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section - Professional Dark Theme */}
        <div id="contact" className="bg-slate-800 py-20 sm:py-28 border-t border-slate-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-3 py-1 bg-slate-700 text-slate-300 text-sm font-medium mb-6 tracking-wide uppercase">Start Your Project</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Request a Consultation
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Discuss your C&I solar project with our team. From initial assessment through final commissioning,
              we deliver turnkey EPC solutions tailored to your requirements.
            </p>
            <div className="bg-slate-900 border border-slate-700 p-10 max-w-md mx-auto">
              <div className="w-16 h-16 bg-cyan-600 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-white font-bold text-2xl mb-2">SunEdge Power</p>
              <p className="text-cyan-400 font-semibold text-lg mb-4">Full-Service C&I Solar EPC</p>
              <div className="space-y-2 text-slate-300">
                <p className="font-medium">Class A General Contractor</p>
                <p className="text-sm text-slate-400">Licensed, Bonded & Insured</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              SunEdge<span className="text-cyan-400">Power</span>
            </h2>
            <p className="text-slate-400 font-medium tracking-widest text-sm mb-4 uppercase">
              Engineering &bull; Procurement &bull; Construction
            </p>
            <p className="text-slate-400 mb-4">Full-Service C&I Solar EPC Contractor</p>
            <p className="text-slate-500 text-sm mb-2">Class A General Contractor | Licensed, Bonded & Insured</p>
            <p className="text-slate-600 text-sm">&copy; {new Date().getFullYear()} SunEdge Power. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

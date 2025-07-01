import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0">
      {/* Hero Section */}
      <div className="text-center mb-12 lg:mb-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">
          Professional File Processing Suite
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-6 lg:mb-8 px-4">
          Streamline your workflow with our comprehensive collection of file optimization tools. 
          <span className="font-semibold text-indigo-600"> Secure, fast, and completely free.</span>
        </p>
        
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
          <div className="px-3 py-2 sm:px-4 bg-indigo-100 text-indigo-700 rounded-lg text-xs sm:text-sm font-medium">
            Privacy Focused
          </div>
          <div className="px-3 py-2 sm:px-4 bg-green-100 text-green-700 rounded-lg text-xs sm:text-sm font-medium">
            Client-side Processing
          </div>
          <div className="px-3 py-2 sm:px-4 bg-blue-100 text-blue-700 rounded-lg text-xs sm:text-sm font-medium">
            Fast Results
          </div>
          <div className="px-3 py-2 sm:px-4 bg-purple-100 text-purple-700 rounded-lg text-xs sm:text-sm font-medium">
            Always Free
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 lg:mb-16">
        {[
          {
            title: 'Image Compression',
            description: 'Reduce image file sizes while maintaining visual quality using advanced compression algorithms.',
            icon: (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            ),
            href: '/uploadImage',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
          },
          {
            title: 'PDF Optimization',
            description: 'Optimize PDF files for web and storage with intelligent size reduction while preserving quality.',
            icon: (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            ),
            href: '/uploadPdf',
            color: 'text-red-600',
            bgColor: 'bg-red-50'
          },
          {
            title: 'PDF Splitting',
            description: 'Extract specific pages or ranges from PDF documents with precision control.',
            icon: (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h2M9 5a2 2 0 012 2v10a2 2 0 01-2 2M9 5a2 2 0 012-2h2a2 2 0 012 2M15 19h2a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
              </svg>
            ),
            href: '/split',
            color: 'text-green-600',
            bgColor: 'bg-green-50'
          },
          {
            title: 'PDF Merging',
            description: 'Combine multiple PDF files into a single document with custom ordering.',
            icon: (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            ),
            href: '/merge',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
          },
          {
            title: 'Image to PDF',
            description: 'Convert multiple images into professional PDF documents with customizable layouts.',
            icon: (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L4 7m3-3l3 3m6 0h1a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h1" />
              </svg>
            ),
            href: '/ImagetoPDF',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
          },
          {
            title: 'Coming Soon',
            description: 'We are continuously working on new features to enhance your file processing workflow.',
            icon: (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            ),
            href: '#',
            color: 'text-gray-600',
            bgColor: 'bg-gray-50'
          }
        ].map((feature, index) => (
          <Link
            key={index}
            href={feature.href}
            className={feature.href === '#' ? 'cursor-default' : 'cursor-pointer'}
          >
            <div
              className={`${feature.bgColor} rounded-lg p-4 sm:p-6 professional-card hover:shadow-lg transition-all duration-300 ${feature.href !== '#' ? 'hover:scale-105' : ''}`}
            >
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 ${feature.color} mb-3 sm:mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                  {feature.description}
                </p>
                {feature.href !== '#' && (
                  <span className="text-indigo-600 hover:text-indigo-700 font-medium text-xs sm:text-sm transition-colors">
                    Get Started →
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8 mb-12 lg:mb-16">
        <div className="text-center mb-6 lg:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 lg:mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">Built with modern web technologies for optimal performance</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {[
            { number: '100%', label: 'Free to Use', icon: '✓' },
            { number: '0', label: 'Files Stored', icon: '🔒' },
            { number: '< 1s', label: 'Processing Time', icon: '⚡' },
            { number: 'Unlimited', label: 'Usage', icon: '∞' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-xl sm:text-2xl mb-2">{stat.icon}</div>
              <div className="text-lg sm:text-2xl font-bold text-indigo-600 mb-1">{stat.number}</div>
              <div className="text-xs sm:text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-4 lg:mt-6">
          <p className="text-xs text-gray-400">
            All processing happens locally in your browser. No files are uploaded to our servers.
          </p>
        </div>
      </div>

      {/* Getting Started */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 lg:mb-4">Ready to Get Started?</h2>
        <p className="text-gray-600 mb-6 lg:mb-8 text-sm sm:text-base">Select a tool from the sidebar to begin processing your files.</p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <button className="px-4 sm:px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all duration-200 text-sm sm:text-base">
            Compress Images
          </button>
          <button className="px-4 sm:px-6 py-3 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base">
            Optimize PDFs
          </button>
        </div>
      </div>
    </div>
  );
}

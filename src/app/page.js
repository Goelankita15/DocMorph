export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Professional File Processing Suite
        </h1>
        
        <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
          Streamline your workflow with our comprehensive collection of file optimization tools. 
          <span className="font-semibold text-indigo-600"> Secure, fast, and completely free.</span>
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <div className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
            Privacy Focused
          </div>
          <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
            Client-side Processing
          </div>
          <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
            No File Upload Required
          </div>
          <div className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
            Always Free
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
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
          <div
            key={index}
            className={`${feature.bgColor} rounded-lg p-6 professional-card cursor-pointer`}
          >
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 ${feature.color} mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {feature.description}
              </p>
              {feature.href !== '#' && (
                <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors">
                  Get Started →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-gray-600">Built with modern web technologies for optimal performance</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { number: '100%', label: 'Free to Use', icon: '✓' },
            { number: '0', label: 'Files Stored', icon: '🔒' },
            { number: '< 1s', label: 'Processing Time', icon: '⚡' },
            { number: 'Unlimited', label: 'Usage', icon: '∞' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-indigo-600 mb-1">{stat.number}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">
            All processing happens locally in your browser. No files are uploaded to our servers.
          </p>
        </div>
      </div>

      {/* Getting Started */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
        <p className="text-gray-600 mb-8">Select a tool from the sidebar to begin processing your files.</p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all duration-200">
            Compress Images
          </button>
          <button className="px-6 py-3 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg font-medium transition-all duration-200">
            Optimize PDFs
          </button>
        </div>
      </div>
    </div>
  );
}

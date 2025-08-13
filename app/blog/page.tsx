export default function Blog() {
  return (
    <div className="min-h-screen bg-black text-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light tracking-[0.2em] text-white mb-4">Blog</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light">
            Thoughts on software engineering, cloud technologies, and the latest in tech.
          </p>
        </div>

        {/* Coming Soon */}
        <div className="text-center">
          <div className="bg-gray-950 border border-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
            <div className="mb-6">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <h2 className="text-2xl font-light tracking-[0.1em] text-gray-300 mb-4">Blog Coming Soon</h2>
              <p className="text-gray-400 font-light mb-6">
                I'm working on creating valuable content about software engineering,
                cloud technologies, and my experiences in the tech industry.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-light tracking-[0.1em] text-gray-400">Upcoming Topics:</h3>
              <ul className="space-y-2 text-left">
                <li className="flex items-center">
                  <span className="text-gray-600 mr-2">•</span>
                  <span className="text-gray-500 font-light">Migrating from Docker to Kubernetes: Lessons Learned</span>
                </li>
                <li className="flex items-center">
                  <span className="text-gray-600 mr-2">•</span>
                  <span className="text-gray-500 font-light">GitOps with FluxCD: A Practical Guide</span>
                </li>
                <li className="flex items-center">
                  <span className="text-gray-600 mr-2">•</span>
                  <span className="text-gray-500 font-light">Building Microservices with Spring Boot</span>
                </li>
                <li className="flex items-center">
                  <span className="text-gray-600 mr-2">•</span>
                  <span className="text-gray-500 font-light">From Mainframe to Cloud: A Developer's Journey</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

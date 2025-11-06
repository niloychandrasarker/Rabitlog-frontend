import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="mt-4">
      {/* BreadCrumb */}
      <div className="flex gap-4 mb-8">
        <Link to="/">Home</Link>
        <span>•</span>
        <span className="text-blue-800">About</span>
      </div>

      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          About Rabitlog 📚
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          A community-driven platform for technology enthusiasts to share
          knowledge, insights, and experiences
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Mission Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            Our Mission
          </h2>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
            Rabitlog is dedicated to creating a vibrant community where
            developers, designers, and tech enthusiasts can share their
            knowledge and learn from each other. We believe in the power of
            shared knowledge to drive innovation and growth in the technology
            sector.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl sm:text-4xl md:text-5xl mb-4">✍️</div>
            <h3 className="font-bold text-lg sm:text-xl mb-3 text-gray-800">
              Write & Share
            </h3>
            <p className="text-gray-600">
              Share your expertise and experiences with a global community of
              tech enthusiasts. Your voice matters and can help others learn.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl sm:text-4xl md:text-5xl mb-4">🌟</div>
            <h3 className="font-bold text-lg sm:text-xl mb-3 text-gray-800">
              Learn & Grow
            </h3>
            <p className="text-gray-600">
              Explore in-depth articles on web development, AI, cloud computing,
              security, and cutting-edge technologies.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl sm:text-4xl md:text-5xl mb-4">🤝</div>
            <h3 className="font-bold text-lg sm:text-xl mb-3 text-gray-800">
              Connect
            </h3>
            <p className="text-gray-600">
              Join discussions, save your favorite posts, and build your
              professional network in the tech community.
            </p>
          </div>
        </div>

        {/* Topics Section */}
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
            Topics We Cover
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { name: "Web Design", icon: "🎨" },
              { name: "Development", icon: "💻" },
              { name: "Databases", icon: "🗄️" },
              { name: "SEO", icon: "🔍" },
              { name: "Marketing", icon: "📢" },
              { name: "AI & ML", icon: "🤖" },
              { name: "Mobile", icon: "📱" },
              { name: "Cloud Computing", icon: "☁️" },
              { name: "DevOps", icon: "⚙️" },
              { name: "Security", icon: "🔒" },
              { name: "Blockchain", icon: "⛓️" },
              { name: "Research", icon: "🔬" },
            ].map((topic) => (
              <span
                key={topic.name}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-shadow"
              >
                {topic.icon} {topic.name}
              </span>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-xl shadow-lg">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              1000+
            </div>
            <div className="text-base sm:text-lg">Articles Published</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-8 rounded-xl shadow-lg">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              500+
            </div>
            <div className="text-base sm:text-lg">Active Writers</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-8 rounded-xl shadow-lg">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              10K+
            </div>
            <div className="text-base sm:text-lg">Monthly Readers</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-12 rounded-xl shadow-xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Join Our Community Today!
          </h2>
          <p className="text-base sm:text-lg mb-6 opacity-90">
            Start writing, sharing, and connecting with fellow tech enthusiasts
          </p>
          <Link
            to="/write"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Start Writing ✨
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

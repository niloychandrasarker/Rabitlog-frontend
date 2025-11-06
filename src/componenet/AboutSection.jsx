const AboutSection = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md p-8 my-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-4xl">📚</span>
          About This Blog
        </h2>
        <div className="space-y-4 text-gray-700">
          <p className="text-lg leading-relaxed">
            Welcome to our technology blog platform! Were a community of
            passionate developers, designers, and tech enthusiasts sharing
            knowledge and insights about the ever-evolving world of technology.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl mb-3">✍️</div>
              <h3 className="font-bold text-xl mb-2">Write & Share</h3>
              <p className="text-sm text-gray-600">
                Share your expertise and experiences with a global community of
                tech enthusiasts.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl mb-3">🌟</div>
              <h3 className="font-bold text-xl mb-2">Learn & Grow</h3>
              <p className="text-sm text-gray-600">
                Explore articles on web development, AI, cloud computing,
                security, and more.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-bold text-xl mb-2">Connect</h3>
              <p className="text-sm text-gray-600">
                Join discussions, save your favorite posts, and build your
                network in tech.
              </p>
            </div>
          </div>
          <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-xl mb-3">Our Topics</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Web Design",
                "Development",
                "Databases",
                "SEO",
                "Marketing",
                "AI & ML",
                "Mobile",
                "Cloud Computing",
                "DevOps",
                "Security",
                "Blockchain",
                "Research",
              ].map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-12 border-t border-gray-800">
      <div className="px-4 md:px-8 lg:px-32 2xl:px-64 py-6 text-center text-sm">
        <p>
          &copy; {new Date().getFullYear()} Rabitlog. Made with ❤️ by{" "}
          <a
            href="https://github.com/niloychandrasarker"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Niloy Chandra Sarker
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

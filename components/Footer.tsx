export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-16">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start justify-between gap-6">
        <div className="text-xs text-gray-400 leading-relaxed max-w-md">
          <p className="text-xs font-semibold text-gray-900 mb-2">AI PO Xavi Marín Suite</p>
          <p>
            <span className="text-gray-600 font-medium">Problem:</span> repetitive PO work steals
            time that should go to strategy.
          </p>
          <p>
            <span className="text-gray-600 font-medium">Solution:</span> a suite of AI tools that
            automate that load, built and used daily by a real PM.
          </p>
          <p>
            <span className="text-gray-600 font-medium">Impact:</span> hours become seconds on
            user stories, PRDs and stakeholder updates.
          </p>
        </div>
        <div className="text-xs text-gray-400 text-left sm:text-right flex-shrink-0">
          <a
            href="https://xavimarin.net"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:text-brand-800 transition-colors"
          >
            xavimarin.net →
          </a>
          <p className="mt-1">Built by Xavi Marín · No data stored on our servers</p>
          <p className="mt-1">MIT License</p>
        </div>
      </div>
    </footer>
  );
}

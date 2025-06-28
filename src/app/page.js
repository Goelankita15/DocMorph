export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <h1 className="text-4xl font-bold text-blue-700">Welcome to Compressify</h1>
      <p className="text-lg text-gray-700 leading-relaxed">
        Compressify is a free and open-source file utility platform designed to simplify your workflow.
        You can easily:
      </p>
      <ul className="list-disc list-inside text-gray-600 space-y-1">
        <li>Compress Images and PDFs</li>
        <li>Split and Merge PDFs</li>
        <li>Convert Images to PDFs</li>
        <li>Reorder, Rotate, and Delete PDF Pages</li>
        <li>And more features coming soon!</li>
      </ul>
      <p className="text-md text-gray-500">
        Start by choosing a feature from the sidebar.
      </p>
    </div>
  );
}

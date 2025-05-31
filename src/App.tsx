import { useState } from "react";
import { Toaster, toast } from "sonner";
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
        <h2 className="text-xl font-semibold text-primary">TDS Virtual TA</h2>
      </header>
      <main className="flex-1">
        <Content />
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<{ answer: string; links: Array<{ url: string; text: string }> } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const answerQuestion = useAction(api.tds.answerQuestion);

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    setIsLoading(true);
    try {
      let imageBase64 = null;
      
      // Convert image to base64 if selected
      if (selectedImage) {
        imageBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            // Remove data:image/...;base64, prefix
            resolve(base64.split(',')[1]);
          };
          reader.readAsDataURL(selectedImage);
        });
      }

      const result = await answerQuestion({
        question,
        image: imageBase64,
      });

      setAnswer(result);
      
      toast.success("Question answered!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to get answer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col gap-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">TDS Virtual Teaching Assistant</h1>
            <p className="text-xl text-secondary mb-4">
              Ask questions about the IIT Madras Tools in Data Science course
            </p>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="mb-4">
                <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                  Ask your TDS question:
                </label>
                <textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g., Should I use gpt-4o-mini or gpt-3.5-turbo for the assignment?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload an image (optional):
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {selectedImage && (
                  <p className="text-sm text-gray-500 mt-1">
                    Selected: {selectedImage.name}
                  </p>
                )}
              </div>
              
              <button
                onClick={handleAskQuestion}
                disabled={isLoading || !question.trim()}
                className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Getting Answer..." : "Ask Question"}
              </button>
            </div>

            {answer && (
              <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
                <h3 className="font-semibold text-lg mb-3">Answer:</h3>
                <p className="text-gray-800 mb-4 whitespace-pre-wrap">{answer.answer}</p>
                
                {answer.links.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Relevant Sources:</h4>
                    <ul className="space-y-2">
                      {answer.links.map((link, index) => (
                        <li key={index}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            {link.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg mt-6">
              <h3 className="font-semibold mb-2">🚀 API Ready for Submission</h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong>API Endpoint:</strong> https://clear-clownfish-52.convex.cloud/api/
              </p>
              <p className="text-xs text-gray-500">
                Supports text questions and base64-encoded images. Ready for promptfoo evaluation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

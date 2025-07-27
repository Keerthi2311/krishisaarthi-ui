import { CropAdvice } from '@/types';
import Card from '@/components/ui/Card';

interface AdviceResultsProps {
  advice: CropAdvice[];
  loading?: boolean;
  error?: string | null;
}

const AdviceResults = ({ advice, loading = false, error = null }: AdviceResultsProps) => {
  if (loading) {
    return (
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-900">
            AI Recommendations
          </h2>
        </Card.Header>
        <Card.Content>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing your query with AI...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
          </div>
        </Card.Content>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-900">
            AI Recommendations
          </h2>
        </Card.Header>
        <Card.Content>
          <div className="text-center py-8">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <p className="text-red-600 font-medium mb-2">Unable to get AI recommendations</p>
            <p className="text-gray-600 text-sm">{error}</p>
            <p className="text-gray-500 text-xs mt-2">Please try again or check your connection</p>
          </div>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <h2 className="text-xl font-semibold text-gray-900">
          AI Recommendations
        </h2>
      </Card.Header>
      
      <Card.Content>
        {advice.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">🤖</div>
            <p className="text-gray-600">
              Upload an image or record your query to get personalized farming advice
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Our AI will analyze your crops and provide expert recommendations
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {advice.map((item, index) => (
              <div
                key={index}
                className={`border-l-4 p-4 rounded-r-lg transition-all hover:shadow-md ${
                  item.priority === 'high' 
                    ? 'border-red-500 bg-red-50' 
                    : item.priority === 'medium'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-green-500 bg-green-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    item.priority === 'high' 
                      ? 'bg-red-100 text-red-800'
                      : item.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {item.priority} priority
                  </span>
                </div>
                
                <p className="text-sm text-gray-700 mb-2">
                  {item.englishSummary}
                </p>
                
                {item.text !== item.englishSummary && (
                  <p className="text-sm text-gray-800 font-medium mb-3 font-kannada">
                    {item.text}
                  </p>
                )}
                
                {item.audioUrl && (
                  <div className="mt-3">
                    <audio controls className="w-full">
                      <source src={item.audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
                
                <div className="text-xs text-gray-500 mt-2">
                  Generated at {new Date(item.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default AdviceResults;

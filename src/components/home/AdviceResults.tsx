import { CropAdvice } from '@/types';
import Card from '@/components/ui/Card';

interface AdviceResultsProps {
  advice: CropAdvice[];
  loading?: boolean;
}

const AdviceResults = ({ advice, loading = false }: AdviceResultsProps) => {
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
            <p className="text-gray-600">Analyzing your query...</p>
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
          </div>
        ) : (
          <div className="space-y-4">
            {advice.map((item, index) => (
              <div
                key={index}
                className={`border-l-4 p-4 rounded-r-lg ${
                  item.priority === 'high' 
                    ? 'border-red-500 bg-red-50' 
                    : item.priority === 'medium'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-green-500 bg-green-50'
                }`}
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  {item.englishSummary}
                </p>
                <p className="text-sm text-gray-800 font-medium mb-3 font-kannada">
                  {item.kannadaText}
                </p>
                
                {item.audioUrl && (
                  <audio controls className="w-full">
                    <source src={item.audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            ))}
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default AdviceResults;

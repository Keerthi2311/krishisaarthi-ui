export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          KrishiSaarthi Loading...
        </h2>
        <p className="text-gray-600">
          ನಮ್ಮ ಕೃಷಿ ಸಹಾಯಕ ತಯಾರಾಗುತ್ತಿದೆ...
        </p>
      </div>
    </div>
  );
}

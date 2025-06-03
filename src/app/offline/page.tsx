export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <div className="max-w-md">
        <div className="text-6xl mb-6">📡</div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          오프라인 모드
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          인터넷 연결이 끊어졌습니다. 연결이 복원되면 자동으로 동기화됩니다.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
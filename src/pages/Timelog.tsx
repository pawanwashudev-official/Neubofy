import { useEffect } from "react";

const Timelog = () => {
  useEffect(() => {
    document.title = "Timelog";
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <h1 className="text-4xl font-bold mb-4">Timelog</h1>
      <p className="text-lg text-gray-600">Welcome to the Timelog page!</p>
    </div>
  );
};

export default Timelog;
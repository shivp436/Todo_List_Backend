// Example asynchronous function that could fetch data
const fetchTasks = async (): Promise<any[]> => {
  // Simulate a delay for fetching data
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        { id: 1, task: 'Sample Task' },
        { id: 2, task: 'Another Task' },
        { id: 3, task: 'Final Task' },
        { id: 4, task: 'Last Task' },
        { id: 5, task: 'End Task' },
      ]);
    }, 1000);
  });
};

export { fetchTasks };

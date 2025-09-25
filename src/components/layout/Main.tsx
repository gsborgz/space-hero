export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className='px-4 py-8 mx-auto h-[94%] lg:mx-50 text-gray-950 dark:text-gray-50'>
      { children }
    </main>
  );
}

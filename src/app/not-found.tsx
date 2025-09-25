'use client'

import Image from 'next/image';

export default function Custom404() {  
  return (
    <section className='flex flex-col items-center justify-center h-[93%] gap-1'>
      <Image src='/images/notfound-1.svg' alt='opening image' width={400} height={400} className='ml-16' priority />

      <span className="text-lg font-medium">Page Not Found</span>
    </section>
  );
}

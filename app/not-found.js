import React from 'react';
import Link from 'next/link'

const NotFound = () => (
    <>
    <div className='flex justify-center h-screen items-center flex-col'>
        <h1>404 - Page Not Found</h1>
        <p>The page you re looking for doesn t exist.</p>
        <Link className='border rounded-xl p-2 bg-blue-200 border-blue-700' href="/">Return Home</Link>
    </div>
    </>
);

export default NotFound;

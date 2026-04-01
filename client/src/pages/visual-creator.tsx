import React from 'react';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import VisualContentCreator from '../components/VisualContentCreator';

export default function VisualCreatorPage() {
  return (
    <>
      <Head>
        <title>Visual Creator - Pika AI</title>
        <meta name="description" content="Create stunning visual content with advanced line options and drawing tools." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Toaster position="top-center" />
      
      <div className="min-h-screen bg-pitch-black">
        <VisualContentCreator />
      </div>
    </>
  );
}
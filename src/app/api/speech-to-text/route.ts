import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { audio } = await request.json();

    const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${process.env.SPEECH_TO_TEXT_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        config: {
          encoding: 'WEBM_OPUS',
          sampleRateHertz: 48000,
          languageCode: 'en-US',
          model: 'default',
          enableAutomaticPunctuation: true,
          useEnhanced: true
        },
        audio: {
          content: audio.content
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Speech API error: ${response.statusText}`);
    }

    const data = await response.json();
    const transcription = data.results?.[0]?.alternatives?.[0]?.transcript || '';

    return NextResponse.json({ text: transcription });
  } catch (error) {
    console.error('Speech-to-Text API error:', error);
    return NextResponse.json(
      { error: 'Failed to process audio' },
      { status: 500 }
    );
  }
}

"use client"

import Script from "next/script"

export function ElevenLabsWidget() {
  return (
    <>
      <Script 
        src="https://unpkg.com/@elevenlabs/convai-widget-embed" 
        async 
        strategy="lazyOnload"
      />
      {/* @ts-expect-error - ElevenLabs custom element */}
      <elevenlabs-convai agent-id="agent_1501kf306e6ee9arqb3bzq84jvf2"></elevenlabs-convai>
    </>
  )
}

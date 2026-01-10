import { useState } from 'react'

interface CodeProps {
  code: string
  highlightedCode: string
  language?: 'typescript' | 'javascript' | 'css'
}

export default function Code({ code, highlightedCode, language = 'typescript' }: CodeProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="group bg-muted relative max-h-162.5 w-full max-w-screen overflow-auto p-4">
      <button
        className="absolute top-2 right-2 rounded px-2 py-1 text-sm opacity-0 transition group-hover:opacity-100"
        onClick={copyToClipboard}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <pre>
        <code
          className={`language-${language}`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
    </div>
  )
}

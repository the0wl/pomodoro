interface CaptionProps {
  text: String
}

export default function Caption({ text } : CaptionProps) {
  return (
    <p className="text-[11px] leading-3 text-[#c2c2c2] font-normal">{text}</p>
  )
} 
interface HeadlineProps {
  text: String
}

export default function Headline({ text } : HeadlineProps) {
  return (
    <p className="text-[13px] leading-[18px] text-[#fff] font-semibold">{text}</p>
  )
} 
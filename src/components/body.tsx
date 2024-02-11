interface BodyProps {
  text: String
}

export default function Body({ text } : BodyProps) {
  return (
    <p className="text-[13px] leading-4 text-[#fff] font-normal">{text}</p>
  )
} 
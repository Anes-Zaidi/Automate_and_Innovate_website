export default function CTA() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full max-w-2xl">
      {/* Register Button */}
      <button
        className="w-full sm:max-w-xs px-8 sm:px-10 py-3 sm:py-4 font-semibold text-sm sm:text-base rounded transition-all hover:opacity-90 active:scale-95"
        style={{ backgroundColor: '#F9621D', color: '#0C0F14' }}
      >
        Register
      </button>

      {/* Contact Us Button */}
      <button
        className="w-full sm:max-w-xs px-8 sm:px-10 py-3 sm:py-4 font-semibold text-sm sm:text-base rounded transition-all hover:opacity-90 active:scale-95 border-2"
        style={{
          borderColor: '#F9621D',
          color: '#F9621D',
        }}
      >
        Contact Us
      </button>
    </div>
  )
}

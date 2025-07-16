export const MarsLogo = ({ className = "h-8 w-8" }: { className?: string }) => (
  <div className="flex items-center gap-2">
    <div 
      className={`${className} bg-gradient-to-r from-blue-600 to-teal-500 rounded flex items-center justify-center text-white font-bold text-xl overflow-hidden`}
      style={{ 
        backgroundImage: `url(/lovable-uploads/832f8720-ca9a-4255-bb20-ccad4e05ed04.png)`,
        backgroundSize: 'auto 100%',
        backgroundPosition: '0 0',
        backgroundRepeat: 'no-repeat',
        width: '40px'
      }}
    >
    </div>
  </div>
);
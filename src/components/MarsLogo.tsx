export const MarsLogo = ({ className = "h-8 w-8" }: { className?: string }) => (
  <div className="flex items-center gap-2">
    <img 
      src="/lovable-uploads/832f8720-ca9a-4255-bb20-ccad4e05ed04.png" 
      alt="Mars Logo" 
      className={`${className} object-contain`}
    />
  </div>
);
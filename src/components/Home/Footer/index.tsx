const Footer = () => {
  return (
    <footer className="bg-white border-t border-rose-100 mt-20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8">
          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-amber-500">
            🪔 RakhiPay
          </span>
        </div>
        <p className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} RakhiPay Inc. All rights reserved. Celebrating bonds across distances.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

import FeatureCard from './FeatureCard';

const Features = () => {
  const features = [
    {
      title: "Instant Transfers",
      description: "Send money instantly to your sister's account without any hassle or waiting periods.",
      icon: "⚡"
    },
    {
      title: "Beautiful E-Rakhis",
      description: "Attach a beautiful virtual Rakhi and a personalized heartfelt message with your gift.",
      icon: "🌸"
    },
    {
      title: "Bank Grade Security",
      description: "Your transactions are secured with military-grade encryption for complete peace of mind.",
      icon: "🔒"
    }
  ];

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Why Choose RakhiPay?
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            We make modern gifting feel as special as traditional envelopes.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;

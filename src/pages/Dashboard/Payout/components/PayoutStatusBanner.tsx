import React from 'react';
import { type IPayout, PayoutStatus } from '../../../../services/payout';

interface PayoutStatusBannerProps {
  payout: IPayout;
}

const PayoutStatusBanner: React.FC<PayoutStatusBannerProps> = ({ payout }) => {
  const sisterName = payout.sister?.name || 'Sister';
  const brotherPhone = payout.brother ? `${payout.brother.countryCode.replace('+', '')}${payout.brother.phoneNumber}` : '';
  const upiLink = `upi://pay?pa=${encodeURIComponent(payout.upiId || '')}&pn=${encodeURIComponent(sisterName)}&am=${payout.totalAmount}&cu=INR&tn=${encodeURIComponent(`Rakhi gift from ${sisterName}`)}`;
  const serverLink = `${import.meta.env.VITE_API_URL}/payouts/pay?pa=${encodeURIComponent(payout.upiId || '')}&pn=${encodeURIComponent(sisterName)}&am=${payout.totalAmount}`;
  const confirmLink = `${window.location.origin}/payout/${payout._id}/confirm`;
  const message = `🎀 Happy Raksha Bandhan, bhaiya! 💛\n\nI'm ${sisterName} and I've completed my rakhi quiz! My payout of ₹${payout.totalAmount} is still pending. 🙏\n\nPlease send the Rakhi money via UPI:\n${upiLink}\n\nUPI ID: ${payout.upiId || 'N/A'}\nAmount: ₹${payout.totalAmount}\n\n or \n\n Pay using this link \n\n ${serverLink} \n\n Once you've paid, please tap the link below to confirm the payment ✅\n${confirmLink}\n\nLove you bhaiya! 🌸`;
  const whatsappUrl = `https://wa.me/${brotherPhone}?text=${encodeURIComponent(message)}`;

  return (
    <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 flex flex-col justify-center text-center h-full">
      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 mx-auto ${
        payout.status === PayoutStatus.SUCCESS ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
      }`}>
        {payout.status === PayoutStatus.SUCCESS ? (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        ) : (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        )}
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-1">
        {payout.status === PayoutStatus.SUCCESS ? 'Payout Successful' : 'Payout Pending'}
      </h3>
      <p className="text-sm text-gray-500 mb-4">Total Amount: <span className="font-semibold text-gray-700">₹{payout.totalAmount}</span></p>
      <p className="text-xs text-gray-400 mb-4">Requested on: {new Date(payout.createdAt).toLocaleDateString()}</p>

      {/* WhatsApp Reminder Button — only shown for PENDING payouts */}
      {payout.status === PayoutStatus.PENDING && payout.brother && payout.sister && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold py-2.5 px-3 sm:px-5 rounded-lg shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 text-xs sm:text-sm mx-auto w-full"
        >
          {/* WhatsApp icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span className="break-words text-center">Request Rakhi Money on WhatsApp</span>
        </a>
      )}
    </div>
  );
};

export default PayoutStatusBanner;

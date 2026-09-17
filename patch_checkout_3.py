with open('src/app/checkout/ClientCheckout.tsx', 'r') as f:
    content = f.read()

# Replace the onClick handler for Wallet payment with a form submission
content = content.replace(
    '''<button 
                  onClick={() => {
                    if (walletBalance >= total) {
                      router.push('/checkout/success');
                    } else {
                      alert('Insufficient wallet balance. Please fund your wallet first or use Direct Bank Transfer.');
                    }
                  }}
                  disabled={walletBalance < total}
                  className="w-full py-[14px] rounded-full bg-[#008b45] text-white font-bold text-[14px] hover:bg-[#007339] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >''',
    '''<form action={async () => {
                    if (walletBalance >= total) {
                        setIsSubmitting(true);
                        const fd = new FormData();
                        fd.append("opportunityId", opp.id);
                        fd.append("paymentMethod", paymentMethod);
                        fd.append("totalAmount", total.toString());
                        await checkoutAction(fd);
                    }
                  }}>
                    <button 
                      type="submit"
                      disabled={walletBalance < total || isSubmitting}
                      className="w-full py-[14px] rounded-full bg-[#008b45] text-white font-bold text-[14px] hover:bg-[#007339] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >'''
)
content = content.replace('Pay from Wallet\n                </button>', 'Pay from Wallet\n                </button>\n              </form>')

# Fix the router import and form submit
content = content.replace("const router = useRouter();", "")
content = content.replace("import { useSearchParams, useRouter } from 'next/navigation';", "")

with open('src/app/checkout/ClientCheckout.tsx', 'w') as f:
    f.write(content)

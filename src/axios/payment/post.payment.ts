import ApiHelper from "@/ApiHelper";

export function PaymentStart(amount: number) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${process.env.URL}/api/v1/payment`, { amount })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function PaymentVerification(
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${process.env.URL}/api/v1/payment/paymentverification`, {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}



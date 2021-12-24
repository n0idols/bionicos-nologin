export default function ThankYouPage() {
  return (
    <div>
      <h1>Thank you for your order!</h1>
      <p>Please check your email for receipt</p>
      <p>You can also view your orders here</p>
      CONFIRMED: {}
    </div>
  );
}

// export async function getServerSideProps({ req }) {
//   if (!req.params.payment.intent) {
//     return {
//       props: {},
//     };
//   }

//   const details = await req.params.payment.intent;
// }

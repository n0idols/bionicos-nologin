import Image from "next/image";

export default function Payments() {
  return (
    <div className="flex justify-center w-full">
      <Image src="/visa.svg" height={50} width={50} alt="visa logo" />

      <Image
        src="/mastercard.svg"
        height={50}
        width={50}
        alt="mastercard logo"
      />

      <Image src="/amex.svg" height={50} width={50} alt="amex logo" />
    </div>
  );
}
// import Image from "next/image";

// export default function Payments() {
//   return (
//     <div className="flex w-full">
//       <div className="relative h-6 w-6">
//         <Image src="/visa.svg" className="h-6 w-6" layout="fill" />
//       </div>
//       <div className="relative h-6 w-6">
//         <Image src="/visa.svg" className="h-6 w-6" layout="fill" />
//       </div>
//       <div className="relative h-6 w-6">
//         <Image src="/mastercard.svg" className="h-6 w-6" layout="fill" />
//       </div>
//       <div className="relative h-6 w-6">
//         <Image src="/amex.svg" className="h-6 w-6" layout="fill" />
//       </div>
//     </div>
//   );
// }

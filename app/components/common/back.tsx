import Link from "next/link";

export default function GoBackTo(prop:{link:string}){
  return (
    <Link href={prop.link}><img alt="back button icon"/></Link>
  );
}
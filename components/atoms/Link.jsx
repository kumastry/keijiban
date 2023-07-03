import { Link as NextLink } from "next/link";

export default function Link({ href, text }) {
  return <NextLink href={href}>{text}</NextLink>;
}

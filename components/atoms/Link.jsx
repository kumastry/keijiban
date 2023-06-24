import {Link as NextLink} from "next/link";

export default function NextLink(
    href = "",
    Child
) {
    return (
        <NextLink href={href}>
            <Child/>
        </NextLink>
    );
}

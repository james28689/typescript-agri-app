import React from "react";
import { Link } from "react-router-dom";

type NavItemProps = {
    title: string;
    links: LinkType[];
}

export type LinkType = {
    link: string
    text: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export default function NavItem(props: NavItemProps) {
    return (
        <li className="mx-4 my-2 space-y-2">
            <h2 className="text-secondary-900 font-semibold text-sm pl-2">{props.title}</h2>

            { props.links.map(thisLink => {
                return(
                    <Link to={thisLink.link} className="flex items-center text-secondary-500 fill-current hover:text-green-600 py-4 px-4 w-44 bg-transparent hover:bg-primary-500 hover:bg-opacity-30 rounded-xl">
                        <thisLink.icon className="w-5 h-5 mr-2" />
                        <span className="">{thisLink.text}</span>
                    </Link>
                )
            }) }

            <hr />
        </li>
    )
}

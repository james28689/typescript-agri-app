import { ReactComponent as HouseIcon } from "../../images/home-alt.svg"
import NavItem, { LinkType } from "./NavItem"
import wheatIcon from "../../images/wheat-icon-2.png"
import { ReactComponent as SettingsIcon } from "../../images/cog.svg"

const NavItemLinks: LinkType[] = [
    {
        link: "/about",
        text: "Overview",
        icon: HouseIcon
    },
    {
        link: "/settings",
        text: "Settings",
        icon: SettingsIcon
    }
]

export default function Nav() {
    return (
        <div className="fixed bg-white h-full border-r w-60 z-20">
            <ul className="flex flex-col items-center h-full space-y-2">
                <li className="w-full">
                    <a href="/" className="flex items-center text-secondary-900 font-semibold text-lg py-4 px-4 w-44 bg-transparent rounded-xl mx-4 my-2">
                        <img src={wheatIcon} className="h-7 min-h-7 mr-2" alt="Agri App Icon" />
                        <span>AGRI</span>
                    </a>
                </li>

                <NavItem title="Dashboard" links={NavItemLinks} />
            </ul>
        </div>
    )
}

import { ReactComponent as HouseIcon } from "../../images/home-alt.svg";
import wheatIcon from "../../images/wheat-icon-2.png";
import { ReactComponent as AnalyticsIcon } from "../../images/analytics.svg";
import { ReactComponent as StockIcon } from "../../images/warehouse.svg";
import { ReactComponent as SalesIcon } from "../../images/money-check.svg";
import { ReactComponent as CostsIcon } from "../../images/file-invoice.svg";
import { Link } from "react-router-dom";

interface NavProps {
    active: string;
}

export interface LinkType {
    link: string
    text: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const NavItemLinks: LinkType[] = [
    {
        link: "/",
        text: "Home",
        icon: HouseIcon
    },
    {
        link: "/overview",
        text: "Fields",
        icon: AnalyticsIcon
    },
    {
        link: "/sales",
        text: "Sales",
        icon: SalesIcon
    },
    {
        link: "/stock",
        text: "Stock",
        icon: StockIcon
    },
    {
        link: "/costs",
        text: "Costs",
        icon: CostsIcon
    }
]

export default function Nav(props: NavProps) {
    return (
        <div className="fixed bg-white h-full border-r w-60 z-20">
            <ul className="flex flex-col items-center h-full space-y-2">
                <li className="w-full">
                    <div className="flex items-center text-secondary-900 font-semibold text-lg py-4 px-4 w-44 bg-transparent rounded-xl mx-4 my-2">
                        <img src={wheatIcon} className="h-7 min-h-7 mr-2" alt="Agri App Icon" />
                        <span>AGRI</span>
                    </div>
                </li>
                
                {
                    NavItemLinks.map(link => {
                        if (link.text === props.active) {
                            return(
                                <Link key={link.text} to={link.link} className="flex items-center text-primary-600 font-semibold fill-current hover:text-green-600 py-4 px-4 w-44 bg-transparent hover:bg-primary-500 hover:bg-opacity-30 rounded-xl">
                                    <link.icon className="w-5 h-5 mr-2" />
                                    <span className="">{link.text}</span>
                                </Link>
                            )
                        } else {
                            return(
                                <Link key={link.text} to={link.link} className="flex items-center text-secondary-500 font-semibold fill-current hover:text-green-600 py-4 px-4 w-44 bg-transparent hover:bg-primary-500 hover:bg-opacity-30 rounded-xl">
                                    <link.icon className="w-5 h-5 mr-2" />
                                    <span className="">{link.text}</span>
                                </Link>
                            )
                        }
                    })
                }
            </ul>
        </div>
    )
}

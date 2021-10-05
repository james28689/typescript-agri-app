import React from "react";

import wheatIcon from "../../images/wheat-icon-2.png"
import backgroundImage from "../../images/background.png"
import styles from "./BackgroundCard.module.css"

type BackgroundCardProps = {
    title: string;
    children: React.ReactNode;
}

export default function BackgroundCard(props: BackgroundCardProps) {
    return (
        <div style={{backgroundImage: `url(${backgroundImage})`}} className={styles.myBackground}>
            <div className={styles.myCard}>
                <img className={styles.myIcon} src={wheatIcon} alt="Agri App Icon" />

                <h1 className={styles.myTitle}>{props.title}</h1>

                { props.children }
            </div>
        </div>
    )
}

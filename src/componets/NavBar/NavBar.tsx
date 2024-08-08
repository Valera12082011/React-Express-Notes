import React from 'react';

import styles from './NavBar.module.css'

import { IoHomeSharp } from 'react-icons/io5';
import { FaStickyNote } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";


const NavBar: React.FC = () => {
    return (
        <div className={styles.NavBar}>
            <ul className={styles.RoutersItems}>
                <li className={styles.ItemRouter}>
                    <a href = '/'>Home</a>
                    <IoHomeSharp></IoHomeSharp>
                </li>

                <li className={styles.ItemRouter}>
                    <a href='/add'>Add</a>
                    <IoMdAdd></IoMdAdd>
                </li>

                <li className={styles.ItemRouter}>
                    <a href='/notes'>Notes</a>
                    <FaStickyNote></FaStickyNote>
                </li>
            </ul>
        </div>
    );

}

export default NavBar;

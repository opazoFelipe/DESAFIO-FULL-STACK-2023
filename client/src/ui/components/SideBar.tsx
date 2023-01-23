import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import {
    Sidebar,
    Menu,
    MenuItem,
    useProSidebar,
} from "react-pro-sidebar";

import {
    FaBars,
    FaSignOutAlt
} from "react-icons/fa";

import { useAuthStore, useUiStore } from "../../hooks";

export const SideBar = () => {
    const { collapseSidebar } = useProSidebar();
    const { onStartingLogout } = useAuthStore();
    const { getPrivateRoutes } = useUiStore();

    const routes = getPrivateRoutes();

    return (
        <>
            <Sidebar
                image="https://user-images.githubusercontent.com/25878302/144499035-2911184c-76d3-4611-86e7-bc4e8ff84ff5.jpg"
                transitionDuration={0}
            >
                <Menu>
                    <MenuItem
                        icon={<FaBars />}
                        onClick={() => collapseSidebar()}
                    ></MenuItem>
                    {
                       routes.map(({ path, name, MenuIcon, displaySideBar }) => {
                            if (displaySideBar) {
                                return (
                                    <MenuItem
                                        key={path}
                                        component={<Link to={path} />}
                                        icon={<MenuIcon />}
                                    >
                                        {name}
                                    </MenuItem>
                                )
                            }
                        })
                    }
                    <MenuItem onClick={() => onStartingLogout()} icon={<FaSignOutAlt />}> Salir</MenuItem>
                </Menu>
            </Sidebar>
        </>
    );
}
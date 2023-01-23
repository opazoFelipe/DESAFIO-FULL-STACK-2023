import React from "react";
import { Link } from 'react-router-dom';

import { MenuItem, useProSidebar } from "react-pro-sidebar";

// import { useAuthStore } from "../../hooks";
import { adminRoutes } from "../../routes/admin-routes";
import { FaBars } from "react-icons/fa";

export const SideBarItems = () => {
    const { collapseSidebar } = useProSidebar();
    // const { roles } = useAuthStore();
    // const hasAdminRoutes = roles.includes("admin");
    // const hasAlumnosRoutes = roles.includes("alumno");

    return (
        <>
            {/* <MenuItem
                icon={<FaBars />}
                onClick={() => collapseSidebar()}
            ></MenuItem>
            {
                hasAdminRoutes && adminRoutes.map(route =>
                    <MenuItem
                        key={`$side-{route.path}`}
                        component={<Link to={route.path} />}
                        icon={<route.icon />}
                    >{route.name}</MenuItem>
                )
            }
            {
                hasAlumnosRoutes && adminRoutes.map(route =>
                    <MenuItem
                        key={`$side-{route.path}`}
                        component={<Link to={route.path} />}
                        icon={<route.icon />}
                    >{route.name}</MenuItem>
                )
            } */}
        </>
    )
}

"use client";
import { cn } from '@/lib/utils';
import React, {  useState } from 'react';


// Define other types used in the component
interface CollapseProps {
        children:React.ReactNode
}

export const Collapse = ({ children }:CollapseProps)=>{
        const [isCollapsed, setIsCollapsed] = useState(false);
        const toggleCollapse = () => {
                setIsCollapsed(!isCollapsed);
        }
        return (
                <div>
                        <div onClick={() => toggleCollapse()} className={cn("none cursor-pointer", isCollapsed && "relative")} >
                                {children}
                        </div>
                </div>
        )
}

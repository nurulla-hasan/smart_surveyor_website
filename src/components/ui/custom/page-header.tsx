"use client"

import { Badge } from "@/components/ui/badge"

const PageHeader = ({title, description, length}: {title: string, description: string, length?: number}) => {
    return (
        <div className="grid">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold uppercase tracking-normal">{title}</h1>
                {length && <Badge className="rounded-full">{length}</Badge>}
            </div>
            <p className="text-muted-foreground">
                {description}
            </p>
        </div>
    )
}

export default PageHeader
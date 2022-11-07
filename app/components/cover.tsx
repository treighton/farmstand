type CoverChildren = {
    title: string, 
}

const Cover: React.FC<CoverChildren> = ( {title} ) => {
    return (
        <div 
            className="bg-light-alt flex justify-center items-center py-20"
        ><h1 className="text-6xl font-serif text--zinc-900">{title}</h1></div>
    )
}

export default Cover
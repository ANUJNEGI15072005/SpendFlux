const Loader = () => {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-white">

            <div className="flex flex-col items-center gap-6">

                {/* Logo */}
                <h1 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight animate-pulse">
                    Spend<span className="text-blue-900">Flux</span>
                </h1>

                {/* Animated bars */}
                <div className="flex gap-1">
                    <span className="w-2 h-6 bg-blue-900 rounded animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-6 bg-blue-900 rounded animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-6 bg-blue-900 rounded animate-bounce"></span>
                </div>

                {/* Optional subtitle */}
                <p className="text-gray-400 text-sm tracking-wide">
                    Loading your page...
                </p>

            </div>

        </div>
    );
};

export default Loader;
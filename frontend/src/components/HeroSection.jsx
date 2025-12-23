function HeroSection() {
    return (
        <>
            <div className="hero min-h-screen" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1503264116251-35a269479413)",}}>
                <div className="hero-overlay"></div>
                <div className="hero-content text-neutral-content text-center">
                    <div className="max-w-md">
                    <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
                    <p className="mb-5">
                        Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                        quasi. In deleniti eaque aut repudiandae et a id nisi.
                    </p>
                    <button className="btn btn-primary">Explore</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HeroSection;
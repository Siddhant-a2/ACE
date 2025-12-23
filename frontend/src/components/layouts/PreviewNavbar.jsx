
function PreviewNavbar(){
    return (
        <>
            <div className="navbar bg-base-100 shadow-sm">
                <div className="flex-1">
                    <img src="/ace_logo.jpg" alt="ace logo" className="h-10 w-10 rounded-full object-cover ring-2 ring-primary ring-offset-2 ring-offset-base-100 transition-transform duration-200 hover:scale-105" />
                </div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1">
                        <li className="btn btn-ghost">Home</li>
                        <li className="btn btn-ghost">Login</li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default PreviewNavbar;
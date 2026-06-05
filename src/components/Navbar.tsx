import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-gradient-to-b from-black/90 to-black/50 border-b border-white/10 px-6 md:px-10 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left side - Logo */}
        <div className="flex items-center">
          <button
            onClick={() => navigate('/')}
            className="text-white font-extralight tracking-widest text-lg font-orbitron hover:text-cyan-300 transition-colors uppercase"
          >
            ◆ Rahul Wani
          </button>
        </div>

        {/* Right side - Navigation */}
        <div className="flex items-center gap-4 sm:gap-6">
          <a href="#about" className="text-xs font-mono uppercase tracking-[0.25em] text-white/60 hover:text-white transition-colors">
            About
          </a>
          <a href="#projects" className="text-xs font-mono uppercase tracking-[0.25em] text-white/60 hover:text-white transition-colors">
            Projects
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

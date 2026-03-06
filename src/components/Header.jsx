import { Link } from "react-router-dom"

function Header(){

return(

<nav className="nav">

<h2>Nanak Love</h2>

<ul>

<li><Link to="/">Home</Link></li>
<li><Link to="/vichar">Daily Vichar</Link></li>
<li><Link to="/kirtan">Kirtan</Link></li>
<li><Link to="/quotes">Quotes</Link></li>
<li><Link to="/about">About</Link></li>

</ul>

</nav>

)

}

export default Header

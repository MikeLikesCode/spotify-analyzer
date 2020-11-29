import Link from "next/link";
import { useRouter } from 'next/router'
import { Nav, NavItem} from "reactstrap";
import navStyles from "../../styles/Nav.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faSpotify } from "@fortawesome/free-brands-svg-icons";
import {
  faUserAlt,
  faList,
  faRecordVinyl,
  faMicrophone,
  faClock,
} from "@fortawesome/free-solid-svg-icons";


const Navbar = () => {

const router = useRouter();

 return(
  <div>
    <Nav className={navStyles.Nav}>
      <div className={navStyles.Brand}>
        <FontAwesomeIcon icon={faSpotify} />
      </div>
      <div className={navStyles.Links}>
        <div className={navStyles.flexItems}>
          <NavItem className={`${navStyles.Link} ${router.pathname == "/" ? "active" : ""}`}>
            <Link  href="/">
              <a>
                <div className={navStyles.align}>
                  <FontAwesomeIcon icon={faUserAlt} />
                  <p className={navStyles.title}>Profile</p>
                </div>
              </a>
            </Link>
          </NavItem>
          <NavItem className={`${navStyles.Link} ${router.pathname == "/topArtists" ? "active" : ""}`}>
            <Link href="/topArtists">
              <a>
                <div className={navStyles.align}>
                  <FontAwesomeIcon icon={faMicrophone} />
                  <p className={navStyles.title}>Top Artists</p>
                </div>
              </a>
            </Link>
          </NavItem>
          <NavItem className={`${navStyles.Link} ${router.pathname == "/topTracks" ? "active" : ""}`}>
            <Link href="/topTracks">
              <a>
                <div className={navStyles.align}>
                  <FontAwesomeIcon icon={faRecordVinyl} />
                  <p className={navStyles.title}>Top Tracks</p>
                </div>
              </a>
            </Link>
          </NavItem>
          <NavItem className={`${navStyles.Link} ${router.pathname == "/recent" ? "active" : ""}`}>
            <Link href="/recent">
              <a>
                <div className={navStyles.align}>
                  <FontAwesomeIcon icon={faClock} />
                  <p className={navStyles.title}>Recent</p>
                </div>
              </a>
            </Link>
          </NavItem>
          <NavItem className={`${navStyles.Link} ${router.pathname == "/playlist" ? "active" : ""}`}>
            <Link href="/playlist">
              <a>
                <div className={navStyles.align}>
                  <FontAwesomeIcon icon={faList} />
                  <p className={navStyles.title}>Playlist</p>
                </div>
              </a>
            </Link>
          </NavItem>
        </div>
      </div>

      <div className={navStyles.Github}>
        <FontAwesomeIcon icon={faGithub} />
      </div>
    </Nav>
  </div>
 )
 }

export default Navbar;

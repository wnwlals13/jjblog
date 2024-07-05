import styles from "./app.module.css";
import { Outlet } from "react-router-dom";
import Navbar from "./utils/navbar/navbar";
import Footer from "./utils/footer/footer";

function App({ authService, dbService, FileInput }) {
  return (
    <div className={styles.app}>
        <Navbar authService={authService} />
        <div className={styles.main}>
          <Outlet/>
        </div>
        {/* <Footer/> */}
    </div>
  );
}

export default App;